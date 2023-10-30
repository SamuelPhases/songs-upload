"use client"

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase";

interface PlaylistFooterInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  owner: string,
  year: string
}

const PlaylistFooterInfo = ({ owner, year, ...props }: PlaylistFooterInfoProps) => {

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
  },[owner,setName])



  return (
    <p className="line-clamp-2 text-xs font-bold text-gray-500">&copy; {year} {name}</p>
  )
}

export default PlaylistFooterInfo