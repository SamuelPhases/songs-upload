import { useState, useEffect, Dispatch, SetStateAction } from "react"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { useRecoilState } from "recoil"

import { db } from "@/firebase"


type Props = {
  active: boolean,
  owner: string
}

const CardItemName = ({ active, owner }: Props) => {
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
    <Link href={`${active ? '/user' :`/artist/${owner}`}`} className="text-gray-500 font-bold text-sm transition-all hover:underline focus:underline active:underline truncate">
      {name}
    </Link>
  )
}

export default CardItemName