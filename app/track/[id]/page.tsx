"use client"

import { useEffect, useState } from "react"
import { Icon } from '@iconify/react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"


import { currentPlaying, likedLoading, loggedInUser, selectedGenre, viewTrack } from "@/app/state/atoms"
import SectionRow from "@/app/components/SectionRow"
import Title from "@/app/components/Title"
import CardRowItem from "@/app/artist/components/CardRowItem"
import AppLayout from "../../components/layouts/AppLayout"
import CardInfo from "../components/CardInfo"
import { useParams } from "next/navigation"
import { DocumentData, and, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore"
import toast from "react-hot-toast"
import { db } from "@/firebase"
import { PlaylistsProps, SongProps, UserProps } from "@/app/utils"
import Image from "next/image"
import { format } from "date-fns"
import TrackCardRowItem from "../components/TrackCardRowItem"


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
  // console.log('User =>', user)
  const { id } = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [track, setTrack] = useRecoilState(viewTrack)
  const [postedBy, setPostedBy] = useState<UserProps | null | DocumentData>(null)

  const [trackPropsLoading, setTrackPropsLoading] = useState<boolean>(false)
  const [viewedSongsLoading, setViewedSongsLoading] = useState<boolean>(false)
  const [viewedSongs, setViewedSongs] = useState<SongProps[]>([])
  const [refactorViewedSongs, setRefactoredViewedSongs] = useState<SongProps[]>([])
  const [more, setMore] = useState<boolean>(false)
  const toggleMore = () => setMore(!more)
  const [likeLoading, setLikeLoading] = useRecoilState(likedLoading)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [list, setList] = useState<PlaylistsProps[]>([])
  const [otherArtists, setOtherArtists] = useState<UserProps[]>([])

  const moreLength = 5


  useEffect(() => {
    const handleViewTrack = async () => {
      setLoading(true)
      if (typeof(id) === "string") {
          try {
            const docRef = doc(db, "songs", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setTrack({id, ...docSnap.data()})
              await updateDoc(docRef, {
                views: docSnap.data().views + 1
              });
            } 
            // toast.success('Track viewed successfully')
          } catch (error: any) {
          // console.log({error})
          toast.error(error?.message)
          } finally {
            setLoading(false)
          }
      }
    }
    handleViewTrack()
  },[id])

  useEffect(() => {
    const updateViewHistory = async () => {
      setLoading(true)
      if (user && typeof(id) === "string") {
          try {
            const docRef = doc(db, "songs", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const viewRef = doc(db, "views", user.id);
              // Atomically add a new song to the "songs" array field.
              await updateDoc(viewRef, {
                history: arrayUnion(id)
              });
            } 
            // toast.success('Added to view history')
          } catch (error: any) {
          // console.log({error})
          toast.error(error?.message)
          } finally {
            setLoading(false)
          }
      }
    }
    updateViewHistory()
  },[id,user])

  useEffect(() => {
    if (track) {
      const getPopularTracks = async () => {
        setViewedSongsLoading(true)
        try {
          const qAllSongs = query(collection(db, "songs"), where("owner", "==", track.owner), orderBy("views", "desc"));
          const querySnapshotAllSongs = await getDocs(qAllSongs);
          const dataAllSongs: SongProps | any[] = [];
          querySnapshotAllSongs.forEach( async (doc) => {
            return dataAllSongs.push({id: doc.id, ...doc.data()})
          });
          setViewedSongs(dataAllSongs)
          setRefactoredViewedSongs(dataAllSongs.slice(0,moreLength))
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setViewedSongsLoading(true)
        }
      }
      // const getPopularPlaylists = async () => {
      const getPlaylists = async () => {
        setViewedSongsLoading(true)
        try {
          // const qAllPlaylists = query(collection(db, "playlists"), where("owner", "==", track.owner), orderBy("views", "desc"));
          const qAllPlaylists = query(collection(db, "playlists"), where("owner", "==", track.owner));
          const querySnapshotAllPlaylists = await getDocs(qAllPlaylists);
          const dataAllPlaylists: PlaylistsProps | any[] = [];
          querySnapshotAllPlaylists.forEach( async (doc) => {
            return dataAllPlaylists.push({id: doc.id, ...doc.data()})
          });
          setList(dataAllPlaylists)
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setViewedSongsLoading(true)
        }
      }
      getPopularTracks()
      // getPopularPlaylists()
      getPlaylists()
    }
  },[track,id])

  useEffect(() => {
    if (user && track) {
      const getUsers = async () => {
        setViewedSongsLoading(true)
        try {
          const qAllUsers = query(collection(db, "users"), (where("id", "not-in", [track.owner,user.id])));
          const querySnapshotAllUsers = await getDocs(qAllUsers);
          const dataAllUsers: UserProps | any[] = [];
          querySnapshotAllUsers.forEach( async (doc) => {
            return dataAllUsers.push({id: doc.id, ...doc.data()})
          });
          setOtherArtists(dataAllUsers)
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setViewedSongsLoading(true)
        }
      }
      getUsers()
    }
  },[user,track,id])

  // console.log({otherArtists})
  // // console.log({song})
  // console.log({viewedSongs})

  const active = user?.id === track?.owner
  const [picked, setPicked] = useState(false)
  const setCurrentSong = useSetRecoilState(currentPlaying)


  const chooseSong = (song: SongProps | DocumentData | null) => {
    setPicked(true)
    setCurrentSong({playlist: [], playlistTitle: "", playlistSongOwners: [], song: null, play: false})
    if (song) {
      setCurrentSong({ playlist: [], playlistTitle: "", playlistSongOwners: [], song: {...track, ownerId: user?.id, owner: user?.userName}, play: true })
    }
  }

  return (
    <AppLayout> 
      <div className="pb-7">
        <div className="flex flex-col items-center md:flex-row md:items-end gap-5 w-full pt-0 lg:pt-14 pb-5 text-white">
          <div className="w-36 h-36 md:w-60 md:h-52 lg:h-48 lg:w-52 2xl:w-56 2xl:h-56 bg-gray-700 shadow-slate-900 shadow-2xl relative overflow-hidden grid place-content-center">
            {track && track.imgUrl.trim() !== "" ? (
              <div className="absolute inset-0 cursor-pointer transition-all">
                <Image src={track?.imgUrl} alt={`${track?.name}'s image`} layout="fill" className="absolute inset-0 object-cover" />
              </div>
            ) : (
              <h2 className="text-9xl font-bold text-gray-200 uppercase">{track?.name[0]}</h2>
            )}
          </div>
          <div className="grid gap-5 xl:gap-7 w-full md:w-3/4 lg:w-4/5">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 flex-wrap justify-between">
                <p className="text-sm">Song</p>
                {track?.genre?.trim() !== "" && <p className="text-sm capitalize text-white font-bold bg-gray-700 rounded py-1 px-5 line-clamp-1">{track?.genre}</p>}
              </div>
              <h1 className={`line-clamp-2 font-black text-white capitalize pb-2 ${track?.name?.length < 30 ? 'text-3xl lg:text-5xl 2xl:text-7xl' : 'text-xl lg:text-2xl 2xl:text-4xl'}`}>{track?.name}</h1>
            </div>
            {track && <CardInfo id={track.owner} duration={track.duration} active={active} date={track.createdAt} viewCount={track.views + 1} postedBy={postedBy} setPostedBy={setPostedBy} />}
          </div>
        </div>
        <div className="flex items-center gap-7 flex-wrap py-5">
          <button type="button" disabled={picked} onClick={()=>chooseSong(track)} className="disabled:cursor-not-allowed disabled:animate-none w-11 h-11 lg:w-14 lg:h-14 text-white bg-green-600 flex items-center justify-center rounded-full hover:animate-pulse focus:animate-pulse active:animate-pulse transition-all">
            {picked && <Icon icon="line-md:play-filled-to-pause-transition" className="text-3xl lg:text-4xl" />}
            {!picked && <Icon icon="line-md:pause-to-play-filled-transition" className="text-3xl lg:text-4xl" />}
          </button>
          <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all">
            {user?.songs.includes(id) ? <Icon icon="line-md:heart-filled" className="text-4xl text-green-500" /> : <Icon icon="line-md:heart" className="text-4xl" />}
          </button>
          <button type="button" className="text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all">
            <Icon icon="tabler:dots" className="text-3xl" />
          </button>
        </div>
        <div className="py-5 flex items-start gap-10 w-full">
            <div className="w-full">
                <p className="text-gray-500 text-sm font-bold">Tracks ranked by popularity</p>
                <Title title={postedBy?.userName} />
                <div className="grid gap-5 w-full my-2 lg:my-0">
                    <div className="w-full">
                      {!more ? (
                        <>
                          {refactorViewedSongs.map((song,index) => (
                            <TrackCardRowItem key={index} index={index + 1} song={song} user={user} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} />
                          ))}
                        </>
                      ) : (
                        <>
                          {viewedSongs.map((song,index) => (
                            <TrackCardRowItem key={index} index={index + 1} song={song} user={user} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} />
                          ))}
                        </>
                      )}
                    </div>
                    {viewedSongs.length > moreLength && (
                      <button type="button" onClick={toggleMore} className="text-gray-500 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all text-sm font-bold w-fit mr-auto">
                        See {!more ? 'more' : 'less'}
                      </button>
                    )}
                </div>
            </div>
        </div>
        <div className="grid gap-10 py-10">
          {list.length > 0 && <SectionRow title={`Playlists by ${postedBy?.userName}`} playlist playlists={list} />}
          {otherArtists.length > 0 && <SectionRow title="Other Artists" profile profileCardDetails={otherArtists} />}
        </div>
        {track && postedBy && (
          <div className="grid gap-1 text-gray-500">
            <p className="text-sm">{format(new Date (track.createdAt), "PPP")}</p>
            <p className="text-xs">&copy; {format(new Date (track.createdAt), "yyy")} {postedBy.userName}</p>
            <p className="text-xs">&copy; {format(new Date (track.createdAt), "yyy")} {postedBy.firstName}</p>
            <p className="text-xs">Lyrics provided by Musixmatch</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default Page