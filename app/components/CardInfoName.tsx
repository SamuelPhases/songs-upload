"use client"

import { useEffect, useState } from "react";
import { DocumentData, doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase";
import { useRecoilValue } from "recoil";
import { updateProfilePageModal, updateProfileLoading } from "../state/atoms";
import Link from "next/link";
import { LoggedInUserProps } from "../utils";

interface PlaylistCardInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  owner: string,
  user?: LoggedInUserProps | DocumentData | null,
}

const CardInfoName = ({ owner, user }: PlaylistCardInfoProps) => {

  const [name, setName] = useState<string | null>('')
  const active = owner === user?.id
  
  
  useEffect(() => {
    const getOwner = async (owner: string) => {
      const docRef = doc(db, "users", owner);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        // setName(`${docSnap.data().firstName} ${docSnap.data().lastName}`)
        setName(`${docSnap.data().userName}`)
      } else {
        setName(null)
      }
    }
    getOwner(owner)
  },[owner,setName])
  // },[owner,setName,updatingProfile,updateProfileModal])




  return (
    <Link href={`${active ? '/user' : `/artist/${owner}`}`} className="line-clamp-2 text-sm font-bold text-gray-500 transition-all hover:text-white focus:text-white"> By {name}</Link>
  )
}

export default CardInfoName