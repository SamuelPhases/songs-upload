import { useState, useEffect, Dispatch, SetStateAction } from "react"
import Link from "next/link"
import { DocumentData, doc, getDoc } from "firebase/firestore"
import { useRecoilState } from "recoil"

import { db } from "@/firebase"
import { LoggedInUserProps } from "@/app/utils"


type Props = {
  owner: string,
  user: DocumentData | LoggedInUserProps | null,
}

const CardItemName = ({ owner, user }: Props) => {
    const [name, setName] = useState<string | null>('')

    const active = owner === user?.id

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
    <Link href={`${active ? '/user' : `/artist/${owner}`}`} className="text-gray-500 font-bold text-sm transition-all hover:underline focus:underline active:underline truncate">
      {name}
    </Link>
  )
}

export default CardItemName