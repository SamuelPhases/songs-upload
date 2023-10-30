"use client"

import { useEffect, useState } from "react"
import { Icon } from '@iconify/react'
import { useRecoilState, useRecoilValue } from "recoil"
import { DocumentData, and, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import toast from "react-hot-toast"


import { currentPlaying, likedLoading, loggedInUser, otherUsers, selectedGenre, viewingUser } from "@/app/state/atoms"
import SectionRow from "@/app/components/SectionRow"
import Title from "@/app/components/Title"
import AppLayout from "../../components/layouts/AppLayout"
import CardRowItem from "../components/CardRowItem"
import About from "../components/About"
import { db } from "@/firebase"
import { FollowDataProps, PlaylistsProps, SongProps, UserProps, moreLength } from "@/app/utils"
import Image from "next/image"

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
  const [artist, setArtist] = useRecoilState(viewingUser)
  const { id } = useParams()
  const [artistSongs, setArtistSongs] = useState<SongProps[]>([])
  const [refactorArtistSongs, setRefactoredArtistSongs] = useState<SongProps[]>([])
  const [more, setMore] = useState<boolean>(false)
  const toggleMore = () => setMore(!more)
  const [likeLoading, setLikeLoading] = useRecoilState(likedLoading)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [playlists, setPlaylists] = useState<PlaylistsProps[]>([])
  const [otherArtists, setOtherArtists] = useState<UserProps[]>([])
  // console.log({otherArtists})
  const [artistFollowInfo, setArtistFollowInfo] = useState<FollowDataProps | DocumentData>({followers: [],following:[]})
  const [followingValue, setFollowingValue] = useState<boolean>(false)
  const [loadingFollow, setLoadingFollow] = useState(false)
  const [checkFollowing, setCheckFollowing] = useState<boolean>(false)
  const [otherArtistsLoading, setOtherArtistsLoading] = useState<boolean>(false)
  const [artistsPlaylistsLoading, setArtistsPlaylistsLoading] = useState<boolean>(false)
  const [artistsSongsLoading, setArtistsSongsLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)  


  useEffect(() => {
    // GET ARTIST
    const getArtist = async (id: string) => {
      setLoading(true)
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setArtist({id: id, song: null, ...docSnap.data()})
        } else {
          setArtist(null)
          toast.error('Something went wrong.')
        }
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    // GET ARTIST SONGS
    const getArtistSongs = async (id: string) => {
      setArtistsSongsLoading(true)
      try {
        const q = query(collection(db, "songs"), where("owner", "==", id), orderBy("views", "desc"));
        const querySnapshot = await getDocs(q);
        const data: SongProps | any[] = [];
        querySnapshot.forEach( async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            return data.push({id: doc.id, ...doc.data()})
        });
        setArtistSongs(data)
        setRefactoredArtistSongs(data.slice(0,moreLength))
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setArtistsSongsLoading(false)
      }
    }
    // GET ARTIST PLAYLISTS
    const getArtistPlaylists = async (id: string) => {
      setArtistsPlaylistsLoading(true)
      try {
        const q = query(collection(db, "playlists"), where("owner", "==", id), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data: PlaylistsProps | any[] = [];
        querySnapshot.forEach( async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            return data.push({id: doc.id, ...doc.data()})
        });
        setPlaylists(data)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setArtistsPlaylistsLoading(false)
      }
    }
    // GET OTHER USERS BESIDES YOU AND ARTIST
    const getOtherArtists = async (id: string) => {
      setOtherArtistsLoading(true)
      try {
        const usersRef = query(collection(db, "users"), where("id", "not-in", [user?.id, id]), orderBy("id", "desc"));
        const querySnapshotUsers = await getDocs(usersRef);
        const usersData: UserProps | any[] = [];
        querySnapshotUsers.forEach( async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            return usersData.push({id: doc.id, ...doc.data()})
        });
        setOtherArtists(usersData)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setOtherArtistsLoading(false)
      }
    }


    typeof(id) === "string" && getArtist(id)
    typeof(id) === "string" && getArtistSongs(id)
    typeof(id) === "string" && getArtistPlaylists(id)
    typeof(id) === "string" && user && typeof(user.id) === "string" && getOtherArtists(id)
  },[id,setArtist,user?.id,user])
  useEffect(()=>{
    const followingUser = async (id: string) => {
      if (user) {
        setCheckFollowing(true)
        try {
          const docRef = doc(db, "follow", id);
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            docSnap.data().followers.includes(user.id) ? setFollowingValue(true) : setFollowingValue(false)
            setArtistFollowInfo(docSnap.data())
          }
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setCheckFollowing(false)
        }
      }
    }
    typeof(id) === "string" && user && followingUser(id)
  },[loadingFollow,id,user])

  // console.log({artistSongs})
  const handleFollow = async (id: string) => {
    if (typeof(id) === "string" && user) {
      setLoadingFollow(true)
      try {
        if (followingValue) {
          const followingRef = doc(db, "follow", user.id);
          await updateDoc(followingRef, {
            following: arrayRemove(id)
          });
          const followerRef = doc(db, "follow", id);
          await updateDoc(followerRef, {
            followers: arrayRemove(user.id)
          });
          toast.success(`You just unfollowed ${artist?.firstName}`)
        } else {
          const followingRef = doc(db, "follow", user.id);
          await updateDoc(followingRef, {
            following: arrayUnion(id)
          });
          const followerRef = doc(db, "follow", id);
          await updateDoc(followerRef, {
            followers: arrayUnion(user.id)
          });
          toast.success(`You are now following ${artist?.firstName}`)
        } 
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoadingFollow(false)
      }
    }
  }

  const fullName = `${artist?.firstName} ${artist?.lastName}`

  const [currentSong, setCurrentSong] = useRecoilState(currentPlaying)

  const handleArtistSongs = async (artist: UserProps | null | DocumentData, artistSongs: SongProps[]) => {
    const nameList = artistSongs.map((song) => `${artist?.userName}`)
    setCurrentSong({
      // playlist: res,
      playlist: artistSongs,
      playlistTitle: `All ${artist?.userName}'s songs`,
      playlistSongOwners: nameList,
      song: null,
      play: false,
    })
    // try {
    //   if (playlist) {
    //     const docRef = doc(db, "playlists", playlist.id);
    //     const docSnap = await getDoc(docRef);
    //     if (docSnap.exists()) {
    //       const ids = docSnap.data().songs
    //       const getData = async (ids: string[]) => {
    //         const infoPromises = ids.map( async (id: string) => {
    //           try {
    //             const info = await getDoc(doc(db, "songs", id))
    //             if (info.exists()) {
    //               const data = info.data()
    //               return data
    //             } else {
    //               toast.error('One of the songs in this playlist has been deleted')
    //             }
    //           } catch (error: any) {
    //             toast.error(error.message)
    //           }
    //         })
    //         const result = await Promise.all(infoPromises)
    //         return result
    //       } 
    //       try {
    //         const res = await getData(ids)
    //         const resIds = res.map((song: DocumentData | undefined | SongProps) => song?.owner)
    //         const getOwners = async (list: string[]) => {
    //           const getUsers = list.map( async (item: string) => {
    //             try {
    //               const info = await getDoc(doc(db, "users", item))
    //               if (info.exists()) {
    //                 const data = info.data().userName
    //                 return data
    //               } else {
    //                 toast.error('One of the songs in this playlist has been deleted')
    //               }
    //             } catch (error: any) {
    //               toast.error(error.message)
    //             }
    //           })
    //           const names = await Promise.all(getUsers)
    //           return names
    //         }
    //         try {
    //           const nameList = await getOwners(resIds)
    //           // if (res) {
    //           // }
    //           setCurrentSong({
    //             // playlist: res,
    //             playlist: res as (SongProps | DocumentData)[],
    //             playlistTitle: docSnap.data().name,
    //             playlistSongOwners: nameList,
    //             song: null,
    //             play: false,
    //           })
    //         } catch (error: any) {
    //           toast.error(error.message)
    //           setCurrentSong({
    //             // playlist: res,
    //             playlist: res as (SongProps | DocumentData)[],
    //             playlistTitle: docSnap.data().name,
    //             playlistSongOwners: [],
    //             song: null,
    //             play: false,
    //           })
    //         }
    //       } catch (error) {
    //         toast.error('Something went wrong')
    //       }
    //     } else {
    //       setCurrentSong({playlist: [], playlistTitle: "", playlistSongOwners: [], song: null, play: false})
    //     }
    //   }
    // } catch (error) {
    //   toast.error('Sorry something went wrong')
    // }
  }

  // const fullName = `${user?.firstName} ${user?.lastName}`
  // ${playlist?.name.length < 30 ? 'text-7xl' : 'text-4xl'}


  // if (!isClient) return null
  // console.log({artistSongs})
  console.log({artist})

  return (
    <AppLayout> 
      { ( loading || otherArtistsLoading || artistsPlaylistsLoading || artistsSongsLoading ) ? (
        <div className="h-[70vh] grid place-items-center text-white">
          <Icon icon="svg-spinners:blocks-shuffle-3" className="text-7xl" />
        </div>
      ) : (
        <>
          <div className="pb-7">
            <div className="flex flex-col md:flex-row items-center gap-5 w-full pt-0 lg:pt-14 pb-5 text-white">
                <div className="w-36 h-36 md:w-60 md:h-52 lg:h-48 lg:w-52 2xl:w-56 2xl:h-56 rounded-full bg-gray-700 relative grid place-content-center">
                  {artist && artist.displayPicture.trim() !== "" ? (
                    <div className="absolute inset-0 cursor-pointer transition-all">
                      <Image src={artist?.displayPicture} alt={`${artist?.userName}'s image`} layout="fill" className="absolute inset-0 object-cover" />
                    </div>
                  ) : (
                    <h2 className="text-9xl font-bold text-gray-200 uppercase">{artist?.userName[0]}</h2>
                  )}
                </div>
                <div className="grid gap-5 xl:gap-7 w-full md:w-3/4 lg:w-4/5">
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between flex-arap gap-0.5">
                        <p className="text-sm">{artistSongs.length > 0 ? 'Artist' : 'Profile'}</p>
                        <p className="text-sm text-white font-bold">{artist?.userName}</p>
                      </div>
                        <h1 className={`line-clamp-2 font-black text-white capitalize ${fullName?.length < 30 ? 'text-3xl lg:text-5xl 2xl:text-7xl' : 'text-xl lg:text-2xl 2xl:text-4xl'}`}>{fullName}</h1>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500 line-clamp-2">{artist?.description}</p>
                      <div className="flex flex-col items-start gap-0.5 md:flex-row md:items-center md:gap-3 md:justify-between">
                        <div className="flex flex-row items-center gap-1 py-3 flex-wrap">
                          {artistSongs.length > 0 && (
                            <>
                              <p className="text-[13px] 2xl:text-sm font-bold">{artistSongs.length} song{artistSongs.length > 1 && 's'}</p>
                              <Icon icon="radix-icons:dot-filled" className="text-xs md:block" />
                            </>
                          )}
                            {playlists.length > 0 && (
                              <>
                                <p className="text-[13px] 2xl:text-sm font-bold">{playlists.length} playlist{playlists.length > 1 && 's'}</p>
                                <Icon icon="radix-icons:dot-filled" className="text-xs md:block" />
                              </>
                            )}
                          <p className="text-[13px] 2xl:text-sm font-bold">{artistFollowInfo.following.length} Following</p>
                          <Icon icon="radix-icons:dot-filled" className="text-xs md:block" />
                          <p className="text-[13px] 2xl:text-sm font-bold">{artistFollowInfo.followers.length} Follower{artistFollowInfo.followers.length > 1 && 's'}</p>
                        </div>
                        <p className="text-[13px] 2xl:text-sm font-bold">Joined: {artist?.createdAt && <>{format(new Date(artist?.createdAt), 'PPP')}</>}</p>
                      </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-7 py-5 flex-wrap">
              {artistSongs.length > 0 && (
                <button type="button" onClick={()=>handleArtistSongs(artist,artistSongs)} className="w-11 h-11 lg:w-14 lg:h-14 text-white bg-green-600 flex items-center justify-center rounded-full hover:animate-pulse focus:animate-pulse active:animate-pulse transition-all">
                  <Icon icon="line-md:pause-to-play-filled-transition" className="text-3xl lg:text-4xl" />
                </button>
              )}
              <button type="button" disabled={checkFollowing} onClick={()=>handleFollow(artist?.id)} className="flex items-center gap-4 w-fit px-7 py-1.5 font-medium rounded-xl border border-gray-400/50x text-sm text-white capitalize hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200 transition-all hover:bg-gray-700/40 focus:bg-gray-700/40 active:bg-gray-700/40 disabled:cursor-not-allowed disabled:bg-gray-700/80 disabled:border-gray-500">
                { followingValue ? 'following' : 'follow' }
              </button>
              <button type="button" className="text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all">
                <Icon icon="tabler:dots" className="text-3xl" />
              </button>
            </div>
            <div className="py-5 flex flex-col md:flex-row items-start gap-5 lg:gap-10 w-full lg:w-5/6">
                <div className="w-full md:w-[70%]">
                    <Title title="Popular" />
                    <div className="grid gap-5">
                        <div className="w-full">
                          {/* <CardRowItem key={index} dislikeSong={dislikeSong} index={index + 1} likeSong={likeSong} removeFromPlaylist={dislikeSong} song={song} user={user} likeLoading={likeLoading} /> */}
                          {!more ? (
                            <>
                              {refactorArtistSongs.map((song,index) => (
                                <CardRowItem key={index} index={index + 1} song={song} user={user} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} />
                              ))}
                            </>
                          ) : (
                            <>
                              {artistSongs?.map((song,index) => (
                                <CardRowItem key={index} index={index + 1} song={song} user={user} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} />
                              ))}
                            </>
                          )}

                        </div>
                        {refactorArtistSongs.length > moreLength && (
                          <button type="button" onClick={toggleMore} className="text-gray-500 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all text-sm font-bold w-fit mr-auto">
                            See {!more ? 'more' : 'less'}
                          </button>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-[30%]">
                    <Title title="Artist pick" />
                    <div className="w-full h-[250px] bg-gradient-to-b from-gray-800"></div>
                </div>
            </div>
            <div className="grid gap-10 py-10">
                { playlists.length > 0 && ( <SectionRow title={`${artist?.firstName}'s Playlists`} playlist playlists={playlists} /> ) }
                { artistFollowInfo.followers.length > 0 && <SectionRow title="Followers" artist artistIds={artistFollowInfo.followers} user={user} /> }
                { artistFollowInfo.following.length > 0 && <SectionRow title="Following" artist artistIds={artistFollowInfo.following} user={user} /> }
            </div>
            <About artist={artist} followersCount={artistFollowInfo.followers.length} />
          </div>
        </>
      ) }
    </AppLayout>
  )
}

export default Page