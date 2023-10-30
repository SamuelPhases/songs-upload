"use client"
import { useState, useEffect } from 'react';

import SectionRow from '../components/SectionRow';
import AppLayout from '../components/layouts/AppLayout';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { allSongs, currentPlaying, loggedInUser, otherUsers, otherUsersPlaylists, userRefactorViewHistory, viewTrack } from '../state/atoms';



export default function Home() {

    // const [isClient, setIsClient] = useState(false)
  
    // useEffect(() => {
    //   setIsClient(true)
    // }, [])

    // if (!isClient) return null
    // console.log({isClient})
    const users = useRecoilValue(otherUsers)
    const songs = useRecoilValue(allSongs)
    const otherPlaylists = useRecoilValue(otherUsersPlaylists)
    const setTrack = useSetRecoilState(viewTrack)
    const [currentSong, setCurrentSong] = useRecoilState(currentPlaying)
    const refactorViewHistory = useRecoilValue(userRefactorViewHistory)
    const user = useRecoilValue(loggedInUser)

    // console.log({songs})
  // console.log({otherPlaylists})

  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        {/* Not logged in */}
        {/* <SectionRow title="Songs Playlists" /> */}
        {/* Not logged in */}
        {refactorViewHistory && refactorViewHistory.length > 0 && (
          <SectionRow title="Recently played" refactorView refactorViewHistory={refactorViewHistory} setTrack={setTrack} user={user} setCurrentSong={setCurrentSong}  />
        )}
        {songs && songs.length > 0 && (
          <SectionRow title="Play a song" song songs={songs} user={user} setCurrentSong={setCurrentSong} />
        )}
          {/* <SectionRow title="Play a song" song songs={songs} setTrack={setTrack} user={user} setCurrentSong={setCurrentSong} /> */}
        {otherPlaylists && otherPlaylists.length > 0 && (
          <SectionRow title="Choose a playlist" playlist playlists={otherPlaylists} user={user} setTrack={setTrack} setCurrentSong={setCurrentSong} />
        )}
        {users && users.length > 0 && (
          <SectionRow title="Other artists" users={users} />
        )}
        {/* <SectionRow title="Recommended for today" /> */}
      </div>
    </AppLayout>
  )
}
