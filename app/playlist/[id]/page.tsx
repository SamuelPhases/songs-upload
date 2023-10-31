"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Icon } from '@iconify/react'
import { useRecoilState, useRecoilValue } from "recoil"
import { DocumentData, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { format } from "date-fns"
import toast from "react-hot-toast"


import { currentPlaying, likedLoading, loggedInUser, playlistsItems, selectedGenre } from "@/app/state/atoms"
import SectionRow from "@/app/components/SectionRow"
import { PlaylistsProps, SongProps, uploadFile, useDebounce } from "@/app/utils"
import { db } from "@/firebase"
import Modal from "@/app/components/Modal"
import AppLayout from "../../components/layouts/AppLayout"
import CardInfo from "../components/CardInfo"
import CardRowItem from "../components/CardRowItem"
import PlaylistFooterInfo from "../components/PlaylistFooterInfo"
import SearchCardRowItem from "../components/SearchCardRowItem"
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage"
import Image from "next/image"
import DisplayCard from "../components/DisplayCard"



type Props = {}

const Page = (props: Props) => {

  // const [isClient, setIsClient] = useState(false)
  
  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  const [genreTab, setGenreTab] = useState([
    {
      name: 'Christian',
      id: ''
    },
    {
      name: 'Gospel',
      id: ''
    },
    {
      name: 'Worship',
      id: ''
    },
    {
      name: 'Praise',
      id: ''
    }
  ])
  const genre = useRecoilValue(selectedGenre)

  const [playlist, setPlaylist] = useState<PlaylistsProps | null | DocumentData>(null)
  const [user, setUser] = useRecoilState(loggedInUser)
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [updatePlaylistLoading, setUpdatePlaylistLoading] = useState<boolean>(false)
  const [loadingSearchResult, setLoadingSearchResult] = useState<boolean>(false)
  // const [editData, setEditData] = useState({imgUrl: `${playlist?.imgUrl}`, name: `${playlist?.name}`, description: `${playlist?.description}`, genre: `${playlist?.genre}`})
  const [editData, setEditData] = useState({imgUrl: ``, name: ``, description: ``, genre: ``})
  const [image, setImage] = useState<string>("")
  const [playlists, setPlaylists] = useRecoilState(playlistsItems)

  useEffect(() => {
    const getPlaylist = async (id: string) => {
      const docRef = doc(db, "playlists", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlaylist({id, ...docSnap.data()})
        setEditData({...editData, imgUrl: docSnap.data().imgUrl, name: docSnap.data().name.toUpperCase(), description: docSnap.data().description, genre: docSnap.data().genre})
        // setImage(docSnap.data().imgUrl)
      } else {
        setPlaylist(null)
      }
    }
    typeof(id) === "string" && getPlaylist(id)
  },[id,setPlaylist])
  // },[id,setPlaylist,updatePlaylistLoading])
  // },[id,setPlaylist,updatePlaylistLoading,editData])

  const handleEditData = (e: any) => setEditData({...editData, [e.target.name]: e.target.value})
  const maximumFileSize = 2
  const expectedFileTypes = ['png','jpeg','jpg']
  const handleImgUpload = async (e: any) => {
    const file = e.target.files[0]
    const validFileType = expectedFileTypes.includes(file.type.split('/')[1])
    const validSize = Math.ceil(file.size / 1048576)
    if (file) {
      if (validFileType) {
        if (validSize <= maximumFileSize) {
          setUploadingFile(true)
          try {
            setImage(URL.createObjectURL(file))
            const data = await uploadFile(file)
            if (data.trim() !== '') {
              setEditData({...editData, imgUrl:data})
            } else {
              toast.error('Something went wrong')
            } 
          } catch (error: any) {
            toast.error(error.message)
          } finally {
            setUploadingFile(false)
          }
        } else {
          toast.error('File Size has exceeded the expected file size of 2MB.')
        }
      } else {
        toast.error(`Only images with these extensions are expected - "png, jpeg or jpg".`)
      }
    } else {
      // toast.error('You need to choose a file to upload')
      toast.error('No file selected')
    }
  } 
  const editPlaylist = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (editData.name.trim() === "") return toast.error('Name field is required.')
    setLoading(true)
    if (typeof(id) === "string") {
      try {
        const playlistRef = doc(db, "playlists", id);
        const data = {...playlist,
          imgUrl: editData.imgUrl ?? "",
          name: editData.name.toLowerCase(),
          description: editData.description,
          genre: editData.genre.toLowerCase(),
          updatedAt: Date.now()
        }
        await updateDoc(playlistRef, data);
        setLoading(false)
        const newPlaylists: PlaylistsProps[] = playlists.map((playlist,index) => {
          if (playlist.id === id) {
            return {...playlist,...data}
          } else {
            return playlist
          }
        })
        setPlaylists(newPlaylists)
        setPlaylist(data)
        toast.success('Playlist updated successfully')
        toggleEditModal()
      } catch (error: any) {
        setLoading(false)
        toast.error(error?.message)
      }
    }
  }
  const [editModal, setEditModal] = useState<boolean>(false)
  const toggleEditModal = () => setEditModal(!editModal)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [search, setSearch] = useState<string>('')
  const handleSearchText = (e: any) => setSearch(e.target.value)
  const debouncedSearch = useDebounce(search,500)
  const [likeLoading, setLikeLoading] = useRecoilState(likedLoading)
  const [uploadingFile, setUploadingFile] = useState<boolean>(false)
  const handleSearch = async (debouncedSearch: string) => {
    setLoadingSearchResult(true)
    try {
      const q = query(collection(db, "songs"), where("name", "==", debouncedSearch));
      const querySnapshot = await getDocs(q);
      const data: any[] = []
      querySnapshot.forEach((doc) => {
        return data.push({id: doc.id, ...doc.data()})
      });
      setSearchResults(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoadingSearchResult(false)
    }
  }

  const addSongToPlaylist = async (songId: string) => {
    if (typeof(id) === "string" && playlist) {
      setUpdatePlaylistLoading(true)
      try {
        const playlistRef = doc(db, "playlists", id);
        // Atomically add a new song to the "songs" array field.
        await updateDoc(playlistRef, {
          songs: arrayUnion(songId)
        });
        const { songs } = playlist
        const newSongList = songs.includes(songId) ? songs : [...songs,songId]
        const newPlaylist = {...playlist,songs: newSongList}
        setPlaylist(newPlaylist)
        toast.success('Song added to playlist')
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setUpdatePlaylistLoading(false)
      }
    } else {
      toast.error('Something went wrong.')
    }
  }

  const removeFromPlaylist = async (songId: string) => {
    if (typeof(id) === "string" && user && playlist) {
      if (user.id === playlist.owner) {
        setUpdatePlaylistLoading(true)
        try {
          const playlistRef = doc(db, "playlists", id);
          // Atomically remove a new song to the "songs" array field.
          await updateDoc(playlistRef, {
            songs: arrayRemove(songId)
          });
          const { songs } = playlist
          const newSongList = songs.filter((song: string) => song !== songId)
          const newPlaylist = {...playlist,songs: newSongList}
          setPlaylist(newPlaylist)
          toast.success('Song removed from playlist')
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setUpdatePlaylistLoading(false)
        }
      } else {
        toast.error('You can only remove from your playlist.')
      }
    }
  }
  useEffect(() => {
    debouncedSearch.trim() !== "" && handleSearch(debouncedSearch.toLowerCase())
  },[debouncedSearch])

  const [showMore, setShowMore] = useState(false)
  const toggleShowMore = () => setShowMore(!showMore)


  // if (!isClient) return null
  const active = playlist?.owner === user?.id
  const [currentSong, setCurrentSong] = useRecoilState(currentPlaying)

  const choosePlaylist = async (playlist: PlaylistsProps | DocumentData) => {
    try {
      if (playlist) {
        const docRef = doc(db, "playlists", playlist.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const ids = docSnap.data().songs
          const getData = async (ids: string[]) => {
            const infoPromises = ids.map( async (id: string) => {
              try {
                const info = await getDoc(doc(db, "songs", id))
                if (info.exists()) {
                  const data = info.data()
                  return data
                } else {
                  toast.error('One of the songs in this playlist has been deleted')
                }
              } catch (error: any) {
                toast.error(error.message)
              }
            })
            const result = await Promise.all(infoPromises)
            return result
          } 
          try {
            const res = await getData(ids)
            const resIds = res.map((song: DocumentData | undefined | SongProps) => song?.owner)
            const getOwners = async (list: string[]) => {
              const getUsers = list.map( async (item: string) => {
                try {
                  const info = await getDoc(doc(db, "users", item))
                  if (info.exists()) {
                    const data = info.data().userName
                    return data
                  } else {
                    toast.error('One of the songs in this playlist has been deleted')
                  }
                } catch (error: any) {
                  toast.error(error.message)
                }
              })
              const names = await Promise.all(getUsers)
              return names
            }
            try {
              const nameList = await getOwners(resIds)
              // if (res) {
              // }
              setCurrentSong({
                // playlist: res,
                playlist: res as (SongProps | DocumentData)[],
                playlistTitle: docSnap.data().name,
                playlistSongOwners: nameList,
                song: null,
                play: false,
              })
            } catch (error: any) {
              toast.error(error.message)
              setCurrentSong({
                // playlist: res,
                playlist: res as (SongProps | DocumentData)[],
                playlistTitle: docSnap.data().name,
                playlistSongOwners: [],
                song: null,
                play: false,
              })
            }
          } catch (error) {
            toast.error('Something went wrong')
          }
        } else {
          setCurrentSong({playlist: [], playlistTitle: "", playlistSongOwners: [], song: null, play: false})
        }
      }
    } catch (error) {
      toast.error('Sorry something went wrong')
    }
  }

  


  return (
    <AppLayout> 
      <div className="pb-7">
        <div className="flex flex-col items-center md:flex-row md:items-end gap-5 w-full pt-14 pb-5 text-white">
          <DisplayCard playlist={playlist} user={user} />
          <div className="grid gap-7 w-full md:w-3/4 lg:w-4/5">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 flex-wrap justify-between">
                <p className="text-sm">Playlist</p>
                {playlist?.genre?.trim() !== "" && <p className="text-sm capitalize text-white font-bold bg-gray-700 rounded py-1 px-5 line-clamp-1">{playlist?.genre}</p>}
              </div>
                {playlist?.owner === user?.id ? (
                  <button type="button" onClick={toggleEditModal} className={`text-left line-clamp-2 w-fit font-black text-white capitalize ${playlist?.name.length < 30 ? 'text-2xl md:text-4xl xl:text-7xl' : 'text-lg md:text-2xl xl:text-4xl'}`}>{playlist?.name}</button>
                ) : (
                  <h1 className={`text-left line-clamp-2 w-fit font-black text-white capitalize ${playlist?.name.length < 30 ? 'text-3xl lg:text-5xl 2xl:text-7xl' : 'text-xl lg:text-2xl 2xl:text-4xl'}`}>{playlist?.name}</h1>
                )}
            </div>
            <div className="grid gap-1">
              <p className="text-[13px] lg:text-sm text-gray-500 font-semibold">{playlist?.description}</p>
              {playlist  && <CardInfo songsCount={playlist?.songs.length} id={playlist.owner} active={active} />}
              {/* <div className="grid gap-1">
                <p className="text-gray-500 text-sm font-bold">Gospel music picked just for you</p>
                <CardInfo songsCount={playlist?.songs.length} />
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-7 flex-wrap py-5">
          {playlist && playlist.songs.length > 0 && (
            <button type="button" onClick={()=>choosePlaylist(playlist)} className="w-11 h-11 md:w-14 md:h-14 text-white bg-green-600 flex items-center justify-center rounded-full hover:animate-pulse focus:animate-pulse active:animate-pulse transition-all">
              <Icon icon="line-md:pause-to-play-filled-transition" className="text-4xl" />
            </button>
          )}
          {/* {(playlist?.songs.length > 0 && playlist?.owner !=== user?.id) && ( */}
          {(playlist?.songs.length > 0 && playlist?.owner !== user?.id) && (
            <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all">
              <Icon icon="line-md:heart" className="text-4xl" />
            </button>
          )}
          <button type="button" className="text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all">
            <Icon icon="tabler:dots" className="text-3xl" />
          </button>
        </div>
        {playlist?.songs.length > 0 && (
          <div className="py-5 flex items-start gap-10 w-full">
            <div className="w-full flex flex-col gap-5">
              <div className="flex items-center justify-between gap-5 text-gray-500 py-2 border-b border-b-gray-700 px-5 w-full">
                <div className="flex items-center gap-4 flex-1">
                  <p className="text-sm font-bold">#</p>
                  <p className="text-sm font-bold">Title</p>
                </div>
                <div className="hidden md:block md:w-1/5">
                  <p className="text-sm font-bold">Genre</p>
                </div>
                <div className="hidden md:block md:w-1/5">
                  <p className="text-sm font-bold">Date added</p>
                </div>
                <div className="w-2/5 md:w-1/5 md:pr-8 flex justify-end">
                  <Icon icon="ri:time-line" className="text-base" />
                </div>
              </div>
              <div className="grid gap-5 w-full">
                <div className="w-full">
                  {/* <CardRowItem key={index} dislikeSong={dislikeSong} index={index + 1} likeSong={likeSong} removeFromPlaylist={removeFromPlaylist} songId={songId} user={user} likeLoading={likeLoading} /> */}
                  {playlist?.songs.map((songId: string, index: number) => (
                    <CardRowItem key={index} id={songId} index={index + 1} user={user} setUser={setUser} likeLoading={likeLoading} setLikeLoading={setLikeLoading} removeFromPlaylist={removeFromPlaylist} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {user && user.id === playlist?.owner && (
          <>
            {showMore && (
              <div className="text-white py-3.5 flex flex-col gap-3.5 my-5 border-t border-t-gray-700">
                <h3 className="font-bold text-lg lg:text-2xl">Let&apos;s find something for your playlist</h3>
                <input type="search" value={search} onChange={handleSearchText} placeholder="Search for songs" className="w-full lg:w-[400px] border border-transparent focus:border-gray-300 p-2 text-[13px] lg:text-sm bg-gray-800" />
                <div className="py-5 w-full">
                  {search.trim() !== "" && (
                    <>
                      {loadingSearchResult ? (
                        <div className="grid place-items-center">
                          <Icon icon="svg-spinners:eclipse-half" className="text-4xl lg:text-7xl text-white" />
                        </div>
                      ) : (
                        <>
                          {searchResults.length === 0 ? (
                            <div className="grid place-items-center gap-1 w-full">
                              <h3 className="text-gray-500 text-xl lg:text-4xl text-center font-extrabold">No result found for &lsquo;{search}&rsquo;</h3>
                              <p className="text-gray-400 text-[13px] lg:text-sm text-center font-medium">Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                            </div>
                          ) : (
                            <>
                              {searchResults.map((song,index) => (
                                <SearchCardRowItem key={index} song={song} updatePlaylist={addSongToPlaylist} updatePlaylistLoading={updatePlaylistLoading} active={active} />
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="w-full flex justify-end">
              <button type="button" onClick={toggleShowMore} className="w-fit text-gray-500 font-bold hover:text-white active:text-white transition-all text-sm mx-2 text-right">Show {showMore ? 'less': 'more'}</button>
            </div>
          </>
        )}
        <div className="grid gap-1 text-gray-500 py-5">
          <div className="grid gap-05">
            <p className="text-sm font-bold">{playlist?.createdAt && <>{format(new Date(playlist?.createdAt), 'PPP')}</>}</p>
            {/* <p className="text-sm font-bold">Recently updated on {playlist?.updatedAt && <>{format(new Date(playlist?.updatedAt), 'PPP')}</>}</p> */}
          </div>
          {playlist?.createdAt && <PlaylistFooterInfo owner={playlist?.owner} year={format(new Date(playlist?.createdAt), 'yyyy')} />}
          {playlist?.createdAt && <PlaylistFooterInfo owner={playlist?.owner} year={format(new Date(playlist?.createdAt), 'yyyy')} />}
        </div>
        <div className="grid gap-10 py-10">
          {/* { user && user.id === playlist?.owner ? (
            <SectionRow title='Public Playlists' playlist playlists={playlists}  />
          ) : (
            <SectionRow title={`More by `} playlist playlists={playlists}  />
          ) } */}
        </div>
      </div>
      {editModal && playlist && (
        <Modal>
          <form onSubmit={editPlaylist} className="w-full flex items-center justify-center gap-5 flex-col">
            <div className="flex items-center justify-between gap-5 w-full">
              <h3 className="text-3xl font-bold">Edit details</h3>
              <button type="button" onClick={toggleEditModal} className="w-10 h-10 grid place-items-center hover:bg-gray-700 focus:bg-gray-700 transition-all rounded-full">
                <Icon icon="line-md:remove" className="text-3xl" />
              </button>
            </div>
            <div className="flex items-start justify-between gap-5 w-full">
              <div className="w-full lg:w-1/2 h-[200px] bg-gray-800 relative group overflow-hidden">
                <button type="button" disabled={loading || uploadingFile} className="absolute top-2 right-2 w-8 h-8 grid place-items-center bg-gray-900 rounded-full z-10">
                  <Icon icon="tabler:dots" className="text-2xl" />
                </button>
                {((playlist.imgUrl && playlist.imgUrl.trim() !== "") || (image && image.trim() !== "")) && (
                  <div className="absolute inset-0 cursor-pointer transition-all bg-gray-700">
                    {/* {playlist.imgUrl} */}
                    <Image src={image || editData.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
                    {/* <Image src={editData.imgUrl ?? image} alt="Selected file" layout="fill" className="absolute inset-0 object-cover bg-green-500" /> */}
                    {/* <Image src={image ?? playlist.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover bg-green-500" /> */}
                    {/* <Image src={image ?? playlist.imgUrl ?? ""} alt="Selected file" layout="fill" className="absolute inset-0 object-cover" /> */}
                    {/* <Image src={image ?? playlist.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover" /> */}
                  </div>
                )}
                <label htmlFor="imgUrl" className="absolute inset-0 cursor-pointer grid place-items-center place-content-center transition-all bg-transparent">
                  <Icon icon="carbon:music" className="text-8xl opacity-100  group-hover:opacity-0 group-hover:hidden group-focus:hidden group-focus:opacity-0 transition-all" />
                  <Icon icon="cil:pencil" className="text-8xl opacity-0 hidden group-hover:opacity-100 group-hover:block group-focus:block group-focus:opacity-100 transition-all" />
                </label>
                <input type="file" name="imgUrl" disabled={loading || uploadingFile} id="imgUrl" accept="image/*" onChange={handleImgUpload} className="disabled:cursor-not-allowed hidden absolute inset-0" />
              </div>
              <div className="flex flex-col gap-2 justify-between w-full lg:w-1/2 h-full">
                {/* {playlist?.imgUrl} */}
                {/* <input type="text" name="name" onChange={handleEditData} maxLength={50} value={editData.name} placeholder="Name" className="p-2 rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800" /> */}
                <input type="text" name="name" disabled={loading} onChange={handleEditData} maxLength={50} defaultValue={playlist.name} placeholder="Name" className="p-2 rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
                <textarea name="description" disabled={loading} onChange={handleEditData} maxLength={150} defaultValue={playlist.description} placeholder="Add an optional description" className="p-2 h-[150px] rounded resize-none border border-transparent focus:border-white transition-all text-sm bg-gray-800"/>
              </div>
            </div>
            <input type="text" name="genre" disabled={loading} onChange={handleEditData} defaultValue={playlist.genre} placeholder="Genre" className="p-2 rounded h-[40px] w-full border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
            <button type="submit" disabled={loading || uploadingFile} className="w-full p-3 disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-900 bg-white text-gray-900 transition-all focus:bg-gray-900 focus:text-white hover:bg-gray-900 hover:text-white active:bg-gray-900 active:text-white font-extrabold text-base uppercase border border-white
            grid place-items-center"
            >
              {uploadingFile ? (
                <>Uploading File</>
              ) : (
                <>
                  { loading ? ( <Icon icon="svg-spinners:eclipse-half" className="text-3xl" /> ) : ( <>Update</> )}
                </>
              )}
            </button>
          </form>
        </Modal>
      )}
    </AppLayout>
  )
}

export default Page