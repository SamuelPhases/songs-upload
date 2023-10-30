import Link from "next/link"
import { Icon } from '@iconify/react'
import { db } from "@/firebase"
import { DocumentData, doc, getDoc } from "firebase/firestore"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { UserProps } from "@/app/utils"
import { format } from "date-fns"
import Image from "next/image"


type Props = {
    active: boolean,
    date: number,
    duration: string,
    id: string,
    postedBy: DocumentData | UserProps | null,
    setPostedBy: Dispatch<SetStateAction<DocumentData | UserProps | null>>,
    viewCount: number,
}



const CardInfo = ({ id, active, date, duration, viewCount, postedBy, setPostedBy }: Props) => {


    useEffect(() => {
      const getOwner = async (id: string) => {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            console.log(docSnap.data())
            setPostedBy(docSnap.data())
        } else {
          setPostedBy(null)
        }
      }
      typeof(id) === "string" && getOwner(id)
    },[id,setPostedBy])



  return (
    <div className="flex items-center gap-2 text-white">
        <div className="w-5 h-5 rounded-full bg-gray-700 relative overflow-hidden grid place-content-center">
          {postedBy && postedBy.displayPicture.trim() !== "" ? (
              <div className="absolute inset-0 cursor-pointer transition-all">
                <Image src={postedBy.displayPicture} alt={`${postedBy.userName}'s profile picture`} layout="fill" className="absolute inset-0 object-cover" />
              </div>
          ) : (
            <h2 className="text-lg font-bold text-gray-200 uppercase">{postedBy?.userName[0]}</h2>
          )}
        </div>
        <Link href={`${active ? '/user' : `/artist/${id}`}`} className="text-[13px] lg:text-sm font-bold hover:underline focus:underline active:underline">{postedBy?.userName}</Link>
        <Icon icon="radix-icons:dot-filled" className="text-xs" />
        {/* <Link href="/album/1" className="text-[13px] lg:text-sm font-bold hover:underline focus:underline active:underline">Glory</Link>
        <Icon icon="radix-icons:dot-filled" className="text-xs" /> */}
        <p className="text-[13px] lg:text-sm font-bold">{format(new Date (date),'yyyy')}</p>
        <Icon icon="radix-icons:dot-filled" className="text-xs" />
        <p className="text-[13px] lg:text-sm font-bold">
          {duration.split(':')[0] !== "00" ? `${duration}` : `${duration.slice(3)}`}
        </p>
        <Icon icon="radix-icons:dot-filled" className="text-xs" />
        <p className="text-[13px] lg:text-sm font-bold">{viewCount}</p>
    </div>
  )
}

export default CardInfo