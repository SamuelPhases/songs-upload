import Link from "next/link"
import { Icon } from '@iconify/react'
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"


type Props = {
  active: boolean,
  id: string,
  songsCount: number
}

const CardInfo = ({ active, id, songsCount }: Props) => {
  const [name, setName] = useState<string | null>('')

  useEffect(() => {
    const getOwner = async (id: string) => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setName(`${docSnap.data().userName}`)
      } else {
        setName(null)
      }
    }
    typeof(id) === "string" && getOwner(id)
  },[id,setName])


  return (
    <div className="flex items-center gap-1 text-white">
        {/* <div className="w-5 h-5 rounded-full bg-blue-900"></div> */}
        <Link href={`${active ? '/user' :`/artist/${id}`}`} className="text-sm font-bold hover:underline focus:underline active:underline">{name}</Link>
        {songsCount > 0 && (
          <>
            <Icon icon="radix-icons:dot-filled" className="text-xs" />
            <p className="text-sm font-bold">{songsCount} song{songsCount > 1 && 's'}</p>
          </>
        )}
        {/* <p className="text-sm font-bold">{songsCount} songs,</p> */}
        {/* <p className="text-sm font-bold text-gray-500">about 5hr</p> */}
    </div>
  )
}

export default CardInfo