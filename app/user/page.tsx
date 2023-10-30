"use client"

import { useEffect, useState } from "react"
import { Icon } from '@iconify/react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"


import { currentPlaying, followInformation, likedLoading, loggedInUser, playlistsItems, selectedGenre, updateProfileLoading, updateProfilePageModal, userRefactorViewHistory, userSongs, userViewHistory } from "@/app/state/atoms"
import SectionRow from "@/app/components/SectionRow"
import AppLayout from "../components/layouts/AppLayout"
import CardInfo from "./components/CardInfo"
import CardRowItem from "./components/CardRowItem"
import Title from "../components/Title"
import UploadProfile from "./components/UpdateProfile"
import { db } from "@/firebase"
import { DocumentData, collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore"
import { SongProps, moreLength } from "../utils"
import toast from "react-hot-toast"
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

  const [user, setUser] = useRecoilState(loggedInUser)
  const followData = useRecoilValue(followInformation)

  // console.log({user})
  const playlists = useRecoilValue(playlistsItems)
  const songs = useRecoilValue(userSongs)
  const setCurrentSong = useSetRecoilState(currentPlaying)
  // console.log({songs})
  const [likeLoading, setLikeLoading] = useRecoilState(likedLoading)
  const [updateProfileModal, setUpdateProfileModal] = useRecoilState(updateProfilePageModal)
  const toggleProfileModal = () => setUpdateProfileModal(!updateProfileModal)
  const updatingProfile = useRecoilValue(updateProfileLoading)
  // const [viewHistory, setViewHistory] = useState<{history:string[]} | DocumentData>({history:[]})
  // const [refactorViewedHistory, setRefactoredViewedHistory] = useState<{history:string[]} | DocumentData>({history:[]})
  const [viewHistory, setViewHistory] = useRecoilState(userViewHistory)
  const [refactorViewHistory, setRefactorViewHistory] = useRecoilState(userRefactorViewHistory)
  const [more, setMore] = useState<boolean>(false)
  const toggleMore = () => setMore(!more)
  // const [deleting, setDeleting] = useRecoilState(deletingStatus)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [loadingSongs, setLoadingSongs] = useState(false)
  const fullName = `${user?.firstName} ${user?.lastName}`

  // if (!isClient) return null

  return (
    <AppLayout> 
      {user && (
        <div className="pb-7">
          <div className="flex flex-col md:flex-row items-center lg:items-end gap-10 w-full pt-0 lg:pt-14 pb-5 text-white">
            <div className="w-36 h-36 md:w-60 md:h-52 lg:h-48 lg:w-48 xl:h-52 xl:w-52 2xl:w-56 2xl:h-56 bg-gray-700 rounded-full shadow-slate-700 shadow-2xl relative overflow-hidden grid place-content-center">
              {user && user.displayPicture.trim() !== "" ? (
                <div className="absolute inset-0 cursor-pointer transition-all">
                  <Image src={user?.displayPicture} alt={`${user?.userName}'s image`} layout="fill" className="absolute inset-0 object-cover" />
                </div>
              ) : (
                <h2 className="text-9xl font-bold text-gray-200 uppercase">{user?.userName[0]}</h2>
              )}
            </div>
            <div className="grid gap-5 xl:gap-7 w-full md:w-3/4 lg:w-[72%] xl:w-3/4 2xl:w-4/5">
              <div className="grid gap-3">
                <div className="flex items-center gap-1">
                  <p className="text-sm">Profile of</p>
                  <p className="text-sm font-bold">{user?.userName}</p>
                </div>
                <button type="button" onClick={toggleProfileModal} className={`w-fit cursor-pointer line-clamp-2 font-black text-white capitalize ${fullName?.length < 30 ? 'text-3xl lg:text-5xl 2xl:text-7xl' : 'text-xl lg:text-2xl 2xl:text-4xl'}`}>{fullName}</button>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">{user?.description}</p>
                { user && <CardInfo playlistCount={playlists.length} songsCount={songs.length} followData={followData} user={user} /> }
              </div>
            </div>
          </div>
          <div className="flex items-center gap-7 flex-wrap pb-5 pt-7">
            <button type="button" className="text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all">
              <Icon icon="tabler:dots" className="text-3xl" />
            </button>
          </div>
          <div className="py-5 flex items-start gap-10 w-full">
            <div className="w-full">
              <Title title="Top tracks this month" />
              <p className="text-gray-500 text-[13px] lg:text-sm font-bold">Only visible to you</p>
              <div className="grid gap-5 w-full py-4">
                <div className="w-full">
                  {!more ? (
                    <>
                      {refactorViewHistory.map((id: string, index: number) => (
                        <CardRowItem key={index} id={id} index={index + 1} user={user} viewHistory={viewHistory} refactorViewHistory={refactorViewHistory} setRefactorViewHistory={setRefactorViewHistory} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} deleting={deleting} setDeleting={setDeleting} setViewHistory={setViewHistory} />
                      ))}
                    </>
                  ) : (
                    <>
                      {viewHistory.map((id: string, index: number) => (
                        <CardRowItem key={index} id={id} index={index + 1} user={user} viewHistory={viewHistory} refactorViewHistory={refactorViewHistory} setRefactorViewHistory={setRefactorViewHistory} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} deleting={deleting} setDeleting={setDeleting} setViewHistory={setViewHistory} />
                      ))}
                    </>
                  )}
                </div>
                {viewHistory.length > moreLength && (
                  <button type="button" onClick={toggleMore} className="text-gray-500 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all text-sm font-bold w-fit mr-auto">
                    See {!more ? 'more' : 'less'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-10 py-10">
            { songs.length > 0 && ( <SectionRow title="Songs uploaded by you" song songs={songs} user={user} setCurrentSong={setCurrentSong} /> ) }
            { playlists.length > 0 && ( <SectionRow title="Public Playlists" playlist playlists={playlists} user={user} setCurrentSong={setCurrentSong} /> ) }
            { followData.following.length > 0 && <SectionRow title="Following" artist artistIds={followData.following} /> }
            { followData.followers.length > 0 && <SectionRow title="Followers" artist artistIds={followData.followers} /> }
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default Page