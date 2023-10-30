"use client"
import { useState } from "react"
import Link from "next/link"
import { Icon } from '@iconify/react'
import { DocumentData } from "firebase/firestore"

import { UserProps } from "@/app/utils"
import Image from "next/image"


type Props = {
    artist: UserProps | DocumentData | null,
    followersCount: number
}

const About = ({ artist, followersCount }: Props) => {

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

  return (
    <>
        {modal && (
            <div className={`fixed bg-[#00000040] z-50 transition-all items-center justify-center inset-0 ${modal ? 'opacity-100 flex' : 'opacity-0 hidden'}`}>
                <div className="w-10/12 md:w-[85%] lg:min-w-[550px] max-w-[800px] h-[400px] md:h-[650px] lg:h-[550px] bg-gray-900 m-auto overflow-y-auto rounded-xl relative">
                    <button type="button" onClick={toggleModal} className="w-8 h-8 rounded-xl z-20 absolute right-3 top-3 flex items-center justify-center bg-gray-900 text-white hover:bg-gray-900/50 focus:bg-gray-900/50 active:bg-gray-900/50 transition-all">
                        <Icon icon="gg:close" className="text-2xl" />
                    </button>
                    <div className="w-full h-1/2 bg-gray-500 relative overflow-hidden">
                        {artist && artist.displayPicture && (
                            <div className="absolute inset-0 cursor-pointer transition-all bg-gray-700">
                                <Image src={artist.displayPicture} alt="Selected file" layout="fill" className="absolute inset-0 object-contain bg-gray-700" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row w-full justify-between gap-7 md:gap-16 px-5 md:px-10 py-5">
                        <div className="flex flex-col gap-5 text-white">
                            <div className="">
                                <h1 className="text-xl md:text-4xl font-bold">{followersCount}</h1>
                                <p className="text-sm md:text-base text-gray-500 capitalize">follower{followersCount > 1 && 's'}</p>
                            </div>
                            {/* <div className="">
                                <h1 className="text-4xl font-bold">155,684</h1>
                                <p className="text-gray-500 capitalize">Listeners</p>
                            </div> */}
                            <div className="grid gap-0.5">
                                {artist?.email && <Link href={`mailto:${artist?.email}`} target="_blank" className="text-sm md:text-base text-gray-500 hover:text-white focus:text-white active:text-white transition-all flex items-center gap-1">@{artist?.email}</Link>}
                                {artist?.fbLink && <Link href={`${artist?.fbLink}`} target="_blank" className="text-sm md:text-base text-gray-500 hover:text-white focus:text-white active:text-white transition-all flex items-center gap-1">Facebook</Link>}
                                {artist?.igLink && <Link href={`${artist?.igLink}`} target="_blank" className="text-sm md:text-base text-gray-500 hover:text-white focus:text-white active:text-white transition-all flex items-center gap-1">Instagram</Link>}
                                {artist?.ttLink && <Link href={`${artist?.ttLink}`} target="_blank" className="text-sm md:text-base text-gray-500 hover:text-white focus:text-white active:text-white transition-all flex items-center gap-1">Instagram</Link>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 w-full md:w-3/4 text-gray-500">
                            <p className="text-sm md:text-base">{artist?.description || 'No description'}</p>
                            <div className="text-sm md:text-base flex items-center gap-3">
                                <p>Posted by {artist?.firstName} {artist?.lastName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        <div className="py-5">
            <h2 className="text-white text-xl lg:text-3xl font-bold">About</h2>
            <div className="h-[350px] lg:h-[450px] w-full md:w-3/5 lg:w-[600px] 2xl:w-1/2 bg-gray-800 rounded-2xl relative hover:scale-[101%] focus:scale-[101%] active:scale-[101%] transition-all overflow-hidden">
                {artist && artist.displayPicture && (
                    <div className="h-[250px] lg:h-[300px] w-full object-hidden relative">
                        <div className="absolute inset-0 cursor-pointer transition-all bg-gray-700">
                            <Image src={artist.displayPicture} alt="Selected file" layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
                        </div>
                    </div>
                )}
                <button type="button" onClick={toggleModal} className="absolute inset-0 bg-transparent group-hover:scale-[101%] group-focus:scale-[101%] group-active:scale-[101%] transition-all"></button>
                <div className="absolute bottom-12 md:bottom-7 lg:bottom-10 left-0 lg:left-10 grid gap-1 text-white w-full lg:w-4/5 mx-auto">
                    {/* <p className="font-bold">155,684 Monthly Listeners</p> */}
                    <p className="line-clamp-2 lg:line-clamp-2 px-2 lg:px-0 text-sm lg:text-base">{artist?.description || 'No description'}</p>
                </div>
            </div>
        </div>
    </>
  )
}

export default About