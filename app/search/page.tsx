"use client"

import { useState, useEffect } from "react"
import { query, collection, where, getDocs, or } from "firebase/firestore"
import toast from "react-hot-toast"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { Icon } from '@iconify/react';


import AppLayout from "../components/layouts/AppLayout"
import BrowseCardSearchRow from "./components/BrowseCardSearchRow"
import { searchSongResults, searchArtistResults, searchPlaylistResults, searchComplete, searchPageTerm, loggedInUser, likedLoading } from "../state/atoms"
import FoundSearchText from "./components/FoundSearchText"
import { useDebounce } from "../utils"
import { db } from "@/firebase"




type Props = {}

const Page = (props: Props) => {

  const songsFound = useRecoilValue(searchSongResults)
  const artistsFound = useRecoilValue(searchArtistResults)
  const playlistsFound = useRecoilValue(searchPlaylistResults)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [likeLoading, setLikeLoading] = useRecoilState(likedLoading)
  const filterTabList = ['all', 'artist', 'music', 'playlist']
  const [searchFilter, setSearchFilter] = useState('all')
  const switchSearchFilter = (e: any) => setSearchFilter(e.target.value)
  const setSongsFound = useSetRecoilState(searchSongResults)
  const setArtistsFound = useSetRecoilState(searchArtistResults)
  const setPlaylistsFound = useSetRecoilState(searchPlaylistResults)
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
  

  return (
    <AppLayout>
      <form className="flex md:hidden items-center gap-2 relative h-11 w-full rounded-lg overflow-hidden mb-4 text-white">
        <Icon icon="iconamoon:search-light" className="absolute top-1/2 -translate-y-1/2 left-3 text-lg" />
        <input type="search" value={search} onChange={handleSearchText} placeholder="What do you want to listen to ?" className="bg-gray-700/50 absolute inset-0 pl-10 pr-5 border-2 border-transparent focus:border-white rounded-lg text-sm" />
      </form>
      {searching ? (
        <div className="py-10 px-5 flex flex-col items-center justify-center gap-10 text-white">
          <Icon icon="svg-spinners:270-ring-with-bg" className="text-4xl" />
        </div>
      ) : (
        <>
          {search.trim() !== "" ? (
            <>
              {(songsFound.length > 0 || artistsFound.length > 0 || playlistsFound.length > 0) ? (
                <>
                  {/* <div className="flex flex-col gap-3 pb-7">
                    <div className="flex items-center gap-3">
                      {filterTabList.map((tab,index) => (
                        <button type="button" disabled={tab === searchFilter} value={tab} onClick={switchSearchFilter} key={index} className={`${tab === searchFilter ? 'bg-white text-gray-900 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-700/50 focus:bg-gray-700/50'} text-sm font-medium transition-all py-1 px-4 capitalize rounded-2xl`}>{tab}</button>
                      ))}
                    </div>
                  </div> */}
                  <FoundSearchText songsFound={songsFound} artistsFound={artistsFound} playlistsFound={playlistsFound} user={user} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} />
                </>
              ) : (
                <div className="py-10 px-5 flex flex-col items-center justify-center gap-10 text-white">
                  <h3 className="font-extrabold text-lg md:text-2xl text-center">No results found for &ldquo;{search}&rdquo;</h3>
                  <p className="font-semibold text-sm md:text-base text-center">Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                </div>
              )}
            </>
          ) : (
            <div className="grid gap-5 h-[15vh] md:h-[60vh] lg:h-[20vh] xl:h-[40vh] 2xl:h-[50vh]">
              {/* <h2 className="text-white font-bold text-2xl">Browse all</h2>
              <BrowseCardSearchRow/> */}
            </div>
          )}
        </>
      )}
    </AppLayout>
  )
}

export default Page