"use client"

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase";
import { useRecoilValue } from "recoil";
import { updateProfilePageModal, updateProfileLoading } from "../state/atoms";

interface PlaylistCardInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  owner: string,
  updatingProfile?: boolean,
}

const PlaylistCardInfo = ({ owner, updatingProfile, ...props }: PlaylistCardInfoProps) => {

  const [name, setName] = useState<string | null>('')
  
  
  useEffect(() => {
    const getOwner = async (owner: string) => {
      const docRef = doc(db, "users", owner);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setName(`${docSnap.data().firstName} ${docSnap.data().lastName}`)
      } else {
        setName(null)
      }
    }
    getOwner(owner)
  },[owner,setName,updatingProfile])
  // },[owner,setName,updatingProfile,updateProfileModal])



  return (
    <p className="line-clamp-1 lg:line-clamp-2 text-[13px] md:text-sm font-bold text-gray-500"> By {name}</p>
  )
}

export default PlaylistCardInfo