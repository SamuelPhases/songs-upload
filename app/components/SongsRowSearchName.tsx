import { useState, useEffect, Dispatch, SetStateAction } from "react"
import Link from "next/link"
import { DocumentData, doc, getDoc } from "firebase/firestore"
import { useRecoilState } from "recoil"

import { db } from "@/firebase"
import { LoggedInUserProps } from "../utils"


type Props = {
    user: LoggedInUserProps | DocumentData | null,
    owner: string
}

const SongsRowSearchName = ({ user, owner }: Props) => {

    const active = user?.id === owner
    const [name, setName] = useState<string | null>('')

    useEffect(() => {
      const getOwner = async (owner: string) => {
        const docRef = doc(db, "users", owner);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setName(`${docSnap.data().userName}`)
        } else {
          setName(null)
        }
      }
      typeof(owner) === "string" && getOwner(owner)
    },[owner,setName])




  return (
    <Link href={`${active ? '/user' :`/artist/${owner}`}`} className="text-gray-400/50 text-[13px] transition-all hover:text-white focus:text-white active:text-white hover:underline focus:underline active:underline line-clamp-1">
      {name}
    </Link>

  )
}

export default SongsRowSearchName