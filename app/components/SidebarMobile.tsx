"use client"

import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { DocumentData, addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

import { db } from "@/firebase";
import SidebarMedia from "./SidebarMedia";
import { loadingModal, loadingModalText, loggedInUser, personalPlaylistCount, sideNavState } from "../state/atoms";
import SidebarTop from "./SidebarTop";
import { LoggedInUserProps, PlaylistsProps } from "../utils";
import SidebarLikedSongs from "./SidebarLikedSongs";



interface SidebarMobileProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    user: LoggedInUserProps | DocumentData | null,
    playlists: PlaylistsProps[],
    setLoading: SetterOrUpdater<boolean>,
    setLoadingText: SetterOrUpdater<string>,
    updatingProfile?: boolean,
    closeMobileSideNav: () => void
}

const SidebarMobile = ({user, playlists, setLoading, setLoadingText, updatingProfile, closeMobileSideNav, ...props}: SidebarMobileProps) => {

    const [sortLabel, setSortLabel] = useState('recents')
    const [sortLabelToggle, setSortLabelToggle] = useState(false)
    const tags = ['artists','playlists']
    const sortLabels = ['recents', 'recently added', 'alphabetical', 'creator']
    const chooseSortLabel = (text: string) => {
        setSortLabelToggle(!sortLabelToggle)
        setSortLabel(text)
    }
    const [sideNav, setSideNav] = useRecoilState(sideNavState)
    const handleSideNavState = () => setSideNav(!sideNav)
    const playlistCount = useRecoilValue(personalPlaylistCount)
    const handleNewPlaylist = async (e: any) => {
        setLoading(true)
        setLoadingText('Adding new playlist')
        try {
            if (user) {
                await addDoc(collection(db, "playlists"), {
                    name: `My Playlist #${playlists.length + 1}`,
                    songs: [],
                    owner: user.id,
                    createdAt: Date.now(),
                    genre: "",
                    imgUrl: ""
                });
                const userRef = doc(db, "users", user.id);
                // Set the "capital" field of the city 'DC'
                await updateDoc(userRef, {
                    playlistCount: playlistCount + 1 ?? 1
                });
                setLoading(false)
                toast.success('Playlist successfully created.')
            } else {
                toast.error('You need to login to create a playlist.')
            }
        } catch (error: any) {
            setLoading(false)
            toast.error(error.message)
        } finally {
            setLoading(false)
            setLoadingText('')
        }
    }

  return (
    <aside {...props} className={`overflow-hidden absolute z-30 h-[93%] w-[96%] left-[2%] top-[6%] block md:hidden transition-all bg-gray-900`}>
        <div className="flex flex-col gap-3 h-full overflow-hidden w-full">
            <SidebarTop closeMobileSideNav={closeMobileSideNav} />
            <div className="rounded-xl bg-gray-800/40 h-full flex flex-col gap-3 overflow-y-auto px-2 pb-4">
                <div className="flex items-center md:justify-center lg:justify-between h-fit px-3 py-3">
                    <button
                        type="button"
                        onClick={handleSideNavState}
                        className={`hidden lg:flex gap-2 items-center font-semibold text-gray-400 transition hover:text-white focus:text-white active:text-white ${sideNav ? 'mr-auto' : 'mx-auto'}`}
                    >
                        <Icon icon="line-md:close-to-menu-transition" className="rotate-90 text-xl" />
                        {sideNav && <>Your Library</>}
                    </button>
                    {sideNav && (
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={handleNewPlaylist} className="w-7 h-7 rounded-full text-gray-400 transition hover:bg-gray-800/100 hover:text-white focus:text-white active:text-white flex items-center justify-center">
                                <Icon icon="line-md:plus" className="text-xl" />
                            </button>
                            <button type="button" className="w-7 h-7 rounded-full text-gray-400 transition hover:bg-gray-800/100 hover:text-white focus:text-white active:text-white flex items-center justify-center">
                                <Icon icon="line-md:arrow-small-right" className="text-xl" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="overflow-y-auto flex flex-col flex-1">
                    {!user ? (
                        <div className="hidden lg:grid gap-5">
                            <div className="px-7 py-5 flex flex-col gap-4 bg-gray-900/50 rounded-lg">
                                <h4 className="font-bold text-white text-base">Create your first playlist</h4>
                                <p className="font-semibold text-white/95 text-sm">It&apos;s easy, we&apos;ll help you</p>
                                <button
                                    type="button"
                                    className="font-bold text-gray-900 rounded-2xl py-1.5 px-5 text-sm w-fit bg-white transition-all
                                    hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 hover:text-white focus:text-white active:text-white
                                    "
                                >Create playlist</button>
                            </div>
                            <div className="px-7 py-5 flex flex-col gap-4 bg-gray-900/50 rounded-lg">
                                <h4 className="font-bold text-white text-base">Let&apos;s find some podcast to follow</h4>
                                <p className="font-semibold text-white/95 text-sm">We&apos;ll keep you updated on new episodes</p>
                                <button
                                    type="button"
                                    className="font-bold text-gray-900 rounded-2xl py-1.5 px-5 text-sm w-fit bg-white transition-all
                                    hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 hover:text-white focus:text-white active:text-white
                                    "
                                >Browse podcasts</button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {/* {sideNav && (
                            )} */}
                            <>
                                <div className="flex md:hidden lg:flex gap-4 flex-wrap px-3">
                                    {/* <button type="button" key={index} className="w-fit px-4 py-2 font-medium rounded-2xl bg-gray-900 text-sm text-white capitalize"> */}
                                    {tags.map((tag, index) => (
                                        <button type="button" key={index} className="w-fit px-4 py-1.5 font-medium rounded-xl bg-gray-700 text-sm text-white capitalize">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex md:hidden lg:flex gap-7 items-center justify-between px-3">
                                    <div className="hidden lg:flex items-center bg-gray-700 text-white rounded-lg pr-0.5">
                                        <label htmlFor="search" className="w-7 h-7 rounded-xl flex items-center justify-center">
                                            <Icon icon="line-md:search-filled" className="text-xl" />
                                        </label>
                                        <input type="search" id="search" placeholder="Search in your library" className="text-sm py-0.5 bg-transparent transition-all w-0 hover:w-[180px] focus:w-[180px] active:w-[180px]" />
                                    </div>
                                    <input type="search" id="search" placeholder="Search in your library" className="text-sm py-0.5 border-b text-gray-300 bg-transparent transition-all w-1/2 min-w-[180px]" />
                                    <button type="button" className="text-sm w-fit flex items-center gap-3 font-medium text-gray-300/50 hover:text-white focus:text-white active:text-white">
                                        Recents
                                        <Icon icon="line-md:navigation-right-down" className="text-base" />
                                    </button>
                                </div>
                            </>
                            <div className="flex flex-col items-center justify-center gap-0.5">
                                {user?.songs?.length > 0 && user && <SidebarLikedSongs closeMobileSideNav={closeMobileSideNav}  user={user} />}
                                {playlists.map((playlist: PlaylistsProps,index) => (
                                    <SidebarMedia closeMobileSideNav={closeMobileSideNav}  key={index} playlist={playlist} updatingProfile={updatingProfile} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </aside>
  )
}

export default SidebarMobile