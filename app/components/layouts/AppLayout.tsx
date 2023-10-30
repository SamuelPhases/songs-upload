"use client"
// import { Icon } from "@iconify/react/dist/iconify.js"
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { DocumentData, collection, doc, getCountFromServer, getDoc, getDocs, onSnapshot, or, orderBy, query, where } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

import RootLayout from '@/app/layout';
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'
import { allSongs, currentPlaying, followInformation, followingUsers, likedLoading, loadingModal, loadingModalText, loggedInUser, otherUsers, otherUsersPlaylists, playlistsItems, searchArtistResults, searchComplete, searchPageTerm, searchPlaylistResults, searchSongResults, selectedGenre, updateProfileLoading, updateProfilePageModal, userRefactorViewHistory, userSongs, userViewHistory } from '@/app/state/atoms';
import { PlaylistsProps, SongProps, UserProps, getColor, handleTitle, moreLength, useDebounce } from '@/app/utils';
import { auth, db } from '@/firebase';
import Modal from '../Modal';
import UploadMusic from '../UploadMusic';
import UploadProfile from '@/app/user/components/UpdateProfile';
import AudioPlayer from '../AudioPlayer';
import SidebarMobile from '../SidebarMobile';



interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {}

export const revalidate = 0

const AppLayout = ({children, ...props}: Props) => {

    const router = useRouter()
    const pathname = usePathname()
    // console.log('pathname ==>>',pathname)
    const likedPage = pathname === "/collection/tracks"
    const searchRouteActive = pathname === "/search"
    const prevPage = () => router.back()
    const nextPage = () => router.forward()
    const getGenre = pathname?.split('/')[1] === "genre" ? pathname?.split('/')[2] : null
    const [genre, setGenre] = useRecoilState(selectedGenre)
    useEffect(()=>setGenre(getGenre),[getGenre,setGenre])
    const [distance, setDistance] = useState<number>(0)
    const handleScroll = (e:any) => setDistance(e.target.scrollTop)
    const [user, setUser] = useRecoilState(loggedInUser)
    const loading = useRecoilValue(loadingModal)
    const loadingText = useRecoilValue(loadingModalText)
    const setLoading = useSetRecoilState(loadingModal)
    const setLoadingText = useSetRecoilState(loadingModalText)
    const [playlists, setPlaylists] = useRecoilState(playlistsItems)
    const [songs, setSongs] = useRecoilState(userSongs)
    const [songList, setSongList] = useRecoilState(allSongs)
    const [otherPlaylists, setOtherPlaylists] = useRecoilState(otherUsersPlaylists)
    const likeLoading = useRecoilValue(likedLoading)
    const [users, setUsers] = useRecoilState(otherUsers)
    const [following, setFollowing] = useRecoilState(followingUsers)
    const [followData, setFollowData] = useRecoilState(followInformation)
    // console.log({followData})
    const [updateProfileModal, setUpdateProfileModal] = useRecoilState(updateProfilePageModal)
    const [updatingProfile, setUpdatingProfile] = useRecoilState(updateProfileLoading)
    const toggleProfileModal = () => setUpdateProfileModal(!updateProfileModal)
    const [loadingUser, setLoadingUser] = useState<boolean>(false)
    const [songsList, setSongsList] = useState(userSongs)
    const setViewHistory = useSetRecoilState(userViewHistory)
    const setRefactorViewHistory = useSetRecoilState(userRefactorViewHistory)
    // const [deleting, setDeleting] = useRecoilState(deletingStatus)
    // console.log({updateProfileModal})

    useEffect(()=>{
        onAuthStateChanged(auth, async (user:any) => {
          if (user) {
            setLoadingUser(true)
            // GET USER VIEW HISTORY            
            const getViews = async () => {
            if (user) {
                const docRef = doc(db, "views", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                const history = docSnap.data()
                setViewHistory(history.history)
                setRefactorViewHistory(history.history.slice(0,moreLength))
                } 
            }
            }
            getViews()
            // GET ALL OTHER USER SONGS
            const qAllSongs = query(collection(db, "songs"), where("owner", "!=", user.uid), orderBy("owner", "desc"));
            const querySnapshotAllSongs = await getDocs(qAllSongs);
            const dataAllSongs: SongProps | any[] = [];
            querySnapshotAllSongs.forEach( async (doc) => {
                return dataAllSongs.push({id: doc.id, ...doc.data()})
            });
            setSongList(dataAllSongs)
            // GET ALL OTHER USER PLAYLISTS
            const qAllPlaylists = query(collection(db, "playlists"), where("owner", "!=", user.uid), orderBy("owner", "desc"));
            const querySnapshotAllPlaylists = await getDocs(qAllPlaylists);
            const dataAllPlaylists: SongProps | any[] = [];
            querySnapshotAllPlaylists.forEach( async (doc) => {
                return dataAllPlaylists.push({id: doc.id, ...doc.data()})
            });
            setOtherPlaylists(dataAllPlaylists)
            // GET CURRENT USER PLAYLISTS
            const q = query(collection(db, "playlists"), where("owner", "==", user.uid), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data: PlaylistsProps | any[] = [];
            querySnapshot.forEach( async (doc) => {
                return data.push({id: doc.id, ...doc.data()})
            });
            setPlaylists(data)
            // GET SONGS
            const qSong = query(collection(db, "songs"), where("owner", "==", user.uid), orderBy("createdAt", "desc"));
            const querySnapshotSong = await getDocs(qSong);
            const songData: SongProps | any[] = [];
            querySnapshotSong.forEach( async (doc) => {
                // doc.data() is never undefined for query doc snapshots
                return songData.push({id: doc.id, ...doc.data()})
            });
            setSongs(songData)
            // GET ALL USERS ASIDES CURRENT USER
            const usersRef = query(collection(db, "users"), where("id", "!=", user.uid), orderBy("id", "desc"));
            const querySnapshotUsers = await getDocs(usersRef);
            const usersData: UserProps | any[] = [];
            querySnapshotUsers.forEach( async (doc) => {
                // doc.data() is never undefined for query doc snapshots
                return usersData.push({id: doc.id, ...doc.data()})
            });
            setUsers(usersData)
            // GET FOLLOW INFORMATION
            const followRef = doc(db, "follow", user.uid);
            const followSnapRef = await getDoc(followRef);
            if (followSnapRef.exists()) {
                setFollowData(followSnapRef.data())
            }
            // GET CURRENT USER
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUser(docSnap.data())
            } 
            // GET CURRENT USER SONGS 
            setLoadingUser(false)
        }else {
          window.location.href='/login';
        }
        });
    },[loading,setUser])
    // },[setUser,setPlaylists,loading,setFollowData,setUsers])


    // const [artistFollowInfo, setArtistFollowInfo] = useState<FollowDataProps | DocumentData>({followers: [],following:[]})
    // useEffect(()=>{
    //   const followingUser = async (id: string) => {
    //     // setCheckFollowing(true)
    //     console.log('a')
    //     console.log(id)
    //     try {
    //       const docRef = doc(db, "follow", id);
    //       const docSnap = await getDoc(docRef)
    //       if (docSnap.exists()) {
    //         console.log(docSnap.data())
    //         // docSnap.data().followers.includes(user.id) ? setFollowingValue(true) : setFollowingValue(false)
    //         setFollowData(docSnap.data())
    //       } else {
    //         console.log('ab')
    //       }
    //     } catch (error: any) {
    //       toast.error(error.message)
    //     } finally {
    //     //   setCheckFollowing(false)
    //     }
    //   }
    //   user && followingUser(user.id)
    // },[user,setFollowData])
    // // },[loadingFollow,id,user])
    // console.log({followData})

    const [currentSong, setCurrentSong] = useRecoilState(currentPlaying)
    const [uploadModal, setUploadModal] = useState(false)
    const [moreLinksModal, setMoreLinksModal] = useState(false)
    const goToUser = () => router.push('/user')
    const toggleUpload = () => {
        setUploadModal(!uploadModal)
        setMoreLinksModal(false)
    }
    const toggleLinksModal = () => setMoreLinksModal(!moreLinksModal)
    // console.log({playlists})
    const [songsFound, setSongsFound] = useRecoilState(searchSongResults)
    const [artistsFound, setArtistsFound] = useRecoilState(searchArtistResults)
    const [playlistsFound, setPlaylistsFound] = useRecoilState(searchPlaylistResults)
    const [search, setSearch] = useRecoilState(searchPageTerm)
    const handleSearchText = (e: any) => setSearch(e.target.value)
    const debouncedSearch = useDebounce(search,500)
    const [searching, setSearching] = useRecoilState(searchComplete)
    const handleSearch = async (debouncedSearch: string) => {
      setSearching(true)
      try {
        const q = query(collection(db, "songs"), or(where("name", "==", debouncedSearch),where("genre", "==", debouncedSearch)));
        const querySnapshot = await getDocs(q);
        const data: any[] = []
        querySnapshot.forEach((doc) => {
          return data.push({id: doc.id, ...doc.data()})
        });
        setSongsFound(data)
        const qUsers = query(collection(db, "users"), or(where("firstName", "==", debouncedSearch), where("lastName", "==", debouncedSearch), where("userName", "==", debouncedSearch)));
        const querySnapshotUsers = await getDocs(qUsers);
        const dataUsers: any[] = []
        querySnapshotUsers.forEach((doc) => {
          return dataUsers.push({id: doc.id, ...doc.data()})
        });
        setArtistsFound(dataUsers)
        const qPlaylist = query(collection(db, "playlists"), or(where("name", "==", debouncedSearch),where("genre", "==", debouncedSearch)));
        const querySnapshotPlaylist = await getDocs(qPlaylist);
        const dataPlaylist: any[] = []
        querySnapshotPlaylist.forEach((doc) => {
          return dataPlaylist.push({id: doc.id, ...doc.data()})
        });
        setPlaylistsFound(dataPlaylist)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setSearching(false)
      }
    }
  
    useEffect(() => {
      debouncedSearch.trim() !== "" && handleSearch(debouncedSearch.toLowerCase())
    },[debouncedSearch])

    console.log({user})
    const [mobileSideNav, setMobileSideNav] = useState<boolean>(false)
    const toggleMobileSideNav = () => setMobileSideNav(!mobileSideNav)
    const closeMobileSideNav = () => setMobileSideNav(false)


  return (
    <>
        <Toaster/>
        <RootLayout>
            <section className={`flex flex-col bg-black h-screen overflow-hidden px-2 gap-2 ${currentSong ? 'pt-3' : 'py-3'}`}>
            {/* <div className={`flex justify-between bg-black h-screen overflow-hidden px-2 gap-2 py-3`}> */}
                <div className={`flex justify-between bg-black overflow-hidden gap-2 ${currentSong ? 'md:h-[92%] lg:h-[85%] xl:h-[90%] 2xl:h-[91.5%]' : 'h-full'}`}>
                    <Sidebar user={user} playlists={playlists} setLoading={setLoading} setLoadingText={setLoadingText} updatingProfile={updatingProfile} />
                    {/* <main className={`flex-1 h-full overflow-hidden rounded-xl ${distance > 305 ? `bg-gradient-to-b ${likedPage ? 'from-[#50399E] via-transparent' : `${getColor(genre)}  via-transparent`} from-[7%] to-[#121212] to-[7%]` : `bg-gradient-to-b ${likedPage ? 'from-[#50399E] via-transparent' : `${getColor(genre)} via-transparent`} to-[#121212]`}`}> */}
                    {/* <main className={`flex-1 h-full overflow-hidden rounded-xl ${distance > 305 ? `bg-gradient-to-b ${likedPage ? 'from-[#50399E] via-transparent' : `${getColor(genre)}  via-transparent`} lg:from-[7%] to-[#121212] lg:to-[7%]` : `bg-gradient-to-b ${likedPage ? 'from-[#50399E] via-transparent' : `${getColor(genre)} via-transparent`} to-[#121212]`}`}> */}
                    <main className={`flex-1 h-full overflow-hidden rounded-xl ${distance > 305 ? `bg-gradient-to-b ${likedPage ? 'from-[#50399E] via-transparent' : `${getColor(genre)}  via-transparent`} lg:from-[10%] lg:to-[10%] 2xl:from-[7%] to-[#121212] 2xl:to-[7%]` : `bg-gradient-to-b ${likedPage ? 'from-[#50399E] via-transparent' : `${getColor(genre)} via-transparent`} to-[#121212]`}`}>
                        <div className="relative h-full w-full flex-1 flex flex-col">
                            {/* <div className={`h-fit w-full px-5 ${searchRouteActive ? 'py-4' : 'py-4'}`}> */}
                            <div className={`h-fit w-full z-50 bg-gray-900 md:bg-transparent px-5 py-1 md:py-4`}>
                                <div className="flex items-center gap-7 justify-between">
                                    <div className="flex items-center gap-5">
                                        {user && (
                                            <>
                                                <button type="button" onClick={toggleMobileSideNav} className="w-8 h-8 rounded bg-[#0A0A0A] flex md:hidden items-center justify-center text-gray-200 hover:text-white focus:text-white active:text-white">
                                                    { !mobileSideNav && <Icon icon="line-md:close-to-menu-alt-transition" className="text-xl" /> }
                                                    { mobileSideNav && <Icon icon="line-md:menu-to-close-alt-transition" className="text-xl" /> }
                                                </button>
                                                <button type="button" onClick={prevPage} className="w-8 h-8 rounded-full bg-[#0A0A0A] items-center justify-center text-gray-500 hover:text-white focus:text-white active:text-white">
                                                    <Icon icon="line-md:chevron-small-left" className="text-3xl" />
                                                </button>
                                                <button type="button" onClick={nextPage} className="w-8 h-8 rounded-full bg-[#0A0A0A] items-center justify-center text-gray-500 hover:text-white focus:text-white active:text-white">
                                                    <Icon icon="line-md:chevron-small-right" className="text-3xl" />
                                                </button>
                                            </>
                                        )}
                                        {searchRouteActive && (
                                            <form className="hidden md:flex items-center gap-2 relative h-11 w-[350px] rounded-3xl overflow-hidden text-white">
                                                <Icon icon="iconamoon:search-light" className="absolute top-1/2 -translate-y-1/2 left-3 text-lg" />
                                                <input type="search" value={search} onChange={handleSearchText} placeholder="What do you want to listen to ?" className="bg-gray-700/50 absolute inset-0 pl-10 pr-5 border-2 border-transparent focus:border-white rounded-3xl text-sm" />
                                            </form>
                                        )}
                                        {genre && distance > 175 && <h3 className="text-3xl font-black capitalize text-white">{handleTitle(genre)}</h3> }
                                        {likedPage && distance > 250 && <h3 className="text-lg md:text-3xl font-black capitalize text-white truncate">Liked Songs</h3> }
                                    </div>
                                    <div className="flex items-center gap-5 relative">
                                        {moreLinksModal && (
                                            <div className="absolute w-[210px] lg:w-[300px] right-0 top-10 z-20 bg-gray-800 shadow-md rounded p-2">
                                                <button type="button" onClick={toggleUpload} className="py-2 px-3 text-sm text-white font-bold transition-all hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-700 w-full text-left capitalize flex items-center gap-5 justify-between">
                                                    Upload Song
                                                    <Icon icon="line-md:uploading-loop" className="text-2xl" />
                                                </button>
                                                <button type="button" onClick={goToUser} className="py-2 px-3 text-sm text-white font-bold transition-all hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-700 w-full text-left capitalize flex items-center gap-5 justify-between">
                                                    Profile
                                                    <Icon icon="line-md:account" className="text-2xl" />
                                                </button>
                                            </div>
                                        )}
                                        {!user ? (
                                            <>
                                                <button type="button" className="text-sm lg:text-base text-gray-400/50 hover:text-white focus:text-white active:text-white transition font-bold">Sign up</button>
                                                <button type="button" className="text-sm lg:text-base py-1.5 px-3 lg:py-2.5 lg:px-5 rounded-3xl text-gray-900 hover:text-white focus:text-white active:text-white bg-white hover:bg-blue-900 focus:bg-blue-900 active:bg-blue-900 transition font-bold">Log in</button>
                                            </>
                                        ) : (
                                            <>
                                                {!searchRouteActive && (
                                                    <button type="button" className="hidden lg:inline-block py-1.5 px-5 text-sm rounded-3xl text-gray-900 hover:text-white focus:text-white active:text-white bg-white hover:bg-blue-900 focus:bg-blue-900 active:bg-blue-900 transition font-bold">Explore Premium</button>
                                                )}
                                            </>

                                        )}
                                        <button type="button" className="hidden 2xl:inline-block py-1.5 px-5 text-sm rounded-3xl text-white hover:text-gray-900 focus:text-gray-900 active:text-gray-900 bg-black hover:bg-white focus:bg-white active:bg-white transition font-bold">Install App</button>
                                        {user && (
                                            <>
                                                <Link href="/content-feed" className="rounded-full w-9 h-9 text-white hover:text-gray-900 focus:text-gray-900 active:text-gray-900 bg-black hover:bg-white focus:bg-white active:bg-white transition flex items-center justify-center">
                                                    <Icon icon="basil:notification-solid" className="text-xl" />
                                                </Link>
                                                {/* <Link href="/account" className="rounded-full w-9 h-9 text-white hover:text-gray-900 focus:text-gray-900 active:text-gray-900 bg-black hover:bg-white focus:bg-white active:bg-white transition flex items-center justify-center"> */}
                                                <button type="button" onClick={toggleLinksModal} className="rounded-full w-9 h-9 text-white hover:text-gray-900 focus:text-gray-900 active:text-gray-900 bg-black hover:bg-white focus:bg-white active:bg-white transition flex items-center justify-center">
                                                    <Icon icon="line-md:account" className="text-xl" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 xl:px-5 py-7 relative">
                                {loadingUser ? (
                                    <div className="h-[70vh] grid place-items-center text-white">
                                        <Icon icon="svg-spinners:blocks-shuffle-3" className="text-7xl" />
                                    </div>
                                ) : (
                                    <>
                                        {user && (
                                            <div className="">
                                                {children}
                                            </div>
                                        )}
                                    </>
                                )}
                                <Footer user={user} />
                            </div>
                        </div>
                    </main>
                </div>
                {currentSong && <AudioPlayer user={user} currentSong={currentSong} setCurrentSong={setCurrentSong} />}
                {/* <AudioPlayer currentSong={currentSong} setCurrentSong={setCurrentSong} /> */}
                {mobileSideNav && <SidebarMobile user={user} playlists={playlists} setLoading={setLoading} setLoadingText={setLoadingText} updatingProfile={updatingProfile} closeMobileSideNav={closeMobileSideNav} />}
            </section>
            {loading && (
                <Modal>
                    <p className="text-xl text-center">{loadingText}</p>
                    <Icon icon="svg-spinners:270-ring-with-bg" className="text-7xl" />
                </Modal>
            )}
        </RootLayout>
        {uploadModal && user &&  <UploadMusic user={user} toggleModal={toggleUpload} />}
        {updateProfileModal && user && <UploadProfile user={user} toggleModal={toggleProfileModal} setUpdatingProfile={setUpdatingProfile} updatingProfile={updatingProfile} />}
    </>
  )
}

export default AppLayout