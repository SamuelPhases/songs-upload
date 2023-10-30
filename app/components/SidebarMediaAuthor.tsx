"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

import { db } from "@/firebase";

interface SidebarMediaAuthorProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  owner: string,
  updatingProfile?: boolean
  // setLoadingName: Dispatch<SetStateAction<boolean>>
}

const SidebarMediaAuthor = ({ owner, updatingProfile, ...props }: SidebarMediaAuthorProps) => {

  const [name, setName] = useState<string | null>('')
  
  
  useEffect(() => {
    const getOwner = async (owner: string) => {
      try {
        const docRef = doc(db, "users", owner);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setName(`${docSnap.data().firstName} ${docSnap.data().lastName}`)
        } else {
          setName(null)
        } 
      } catch (error: any) {
        toast.error(error.message)
      }
    }
    getOwner(owner)
  },[owner,setName,updatingProfile])




  return (
    <p className="font-medium text-sm line-clamp-1">{name}</p>
  )
}

export default SidebarMediaAuthor