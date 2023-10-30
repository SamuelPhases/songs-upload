import Link from "next/link"
import { Icon } from '@iconify/react'
import { DocumentData } from "firebase/firestore"
import { format } from "date-fns"

import { FollowDataProps, LoggedInUserProps } from "@/app/utils"


interface CardInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  followData: DocumentData | FollowDataProps,
  playlistCount: number,
  songsCount: number,
  user: LoggedInUserProps | null | DocumentData
}

const CardInfo = ({ followData, playlistCount, songsCount, user, ...props }: CardInfoProps) => {
  // console.log({user})
  return (
    <div className="flex flex-col lg:flex-wrap items-start gap-1 justify-between md:flex-row md:items-center md:gap-5 text-white">
      <div {...props} className="flex gap-0.5 flex-row items-center">
        {/* <div className="w-5 h-5 rounded-full bg-blue-900"></div>
        <Link href="/artist/1" className="text-sm font-bold hover:underline focus:underline active:underline">Dunsin Oyekan</Link>
          <Icon icon="radix-icons:dot-filled" className="text-xs" /> */}
        {playlistCount > 0 && (
          <>
            <p className="text-[13px] lg:text-sm font-bold truncate">{playlistCount} playlist{playlistCount > 1 && 's'}</p>
            <Icon icon="radix-icons:dot-filled" className="text-xs" />
          </>
        )}
        {songsCount > 0 && (
          <>
            <p className="text-[13px] lg:text-sm font-bold truncate">{songsCount} song{songsCount > 1 && 's'}</p>
            <Icon icon="radix-icons:dot-filled" className="text-xs" />
          </>
        )}
        <p className="text-[13px] lg:text-sm font-bold truncate">{followData.following.length} Following</p>
        <Icon icon="radix-icons:dot-filled" className="text-xs" />
        <p className="text-[13px] lg:text-sm font-bold truncate">{followData.followers.length} Follower{followData.followers.length > 1 && 's'}</p>
      </div>
      {user && <p className="text-[13px] lg:text-sm font-bold truncate">Joined: {user.createdAt && <>{format(new Date(user.createdAt), 'PPP')}</>}</p>}
    </div>
  )
}

export default CardInfo