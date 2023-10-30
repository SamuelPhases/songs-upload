import { Icon } from '@iconify/react'
import { LoggedInUserProps, UserProps } from '../utils'
import Image from 'next/image'
import { DocumentData } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  currentUser?: LoggedInUserProps | DocumentData | null,
  user: UserProps
}

const ProfileCard = ({ currentUser, user }: Props) => {

  const active = currentUser?.id === user?.id
  const router = useRouter()


  return (
    <div className="">
      {/* <Link href={`${active ? '/user' : `/artist/${user?.id}`}`} className="rounded-lg group relative h-56 md:h-64 w-full bg-gray-900 group-hover:bg-gray-800/50 hover:bg-gray-800/50 focus:bg-gray-800/50 active:bg-gray-800/50 flex flex-col items-center p-2 xl:p-3 text-left"> */}
      <Link href={`${active ? '/user' : `/artist/${user?.id}`}`} className="rounded-lg group relative h-52 lg:h-56 xl:h-60 w-full bg-gray-900 group-hover:bg-gray-800/50 hover:bg-gray-800/50 focus:bg-gray-800/50 active:bg-gray-800/50 flex flex-col items-center p-2 xl:p-3 text-left">
        <button type="button" onClick={()=>router.push(`${active ? 'user' : `/artist/${user?.id}`}`)} className="z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 text-white transition-all flex items-center justify-center absolute right-3 bottom-0 opacity-0 active:opacity-100 group-hover:opacity-100 focus:opacity-100 active:bottom-24 group-hover:bottom-24 focus:bottom-24 hover:bg-transparent border-2 border-green-500 hover:text-green-500">
          <Icon icon="line-md:watch-twotone-loop" className="text-xl md:text-3xl" />
        </button>
        <div className="absolute w-full px-2 xl:px-3 flex flex-col gap-1 md:gap-2">
          <div className="h-32 w-32 xl:h-[137px] xl:w-[137px] mx-auto bg-gray-700 rounded-full overflow-hidden shadow-2xl group-hover:shadow-gray-700 group-focus:shadow-gray-700 group-active:shadow-gray-700 relative grid place-content-center">
            {user && user?.displayPicture.trim() !== "" ? (
              <Image src={user?.displayPicture} alt={`${user?.userName} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
            ) : (
              <h2 className="text-8xl font-bold text-gray-900 uppercase">{user?.userName[0]}</h2>
            )}
          </div>
          <h4 className="text-white font-semibold text-sm md:text-base line-clamp-1 group-hover:underline group-focus:">{user?.userName}</h4>
          <h4 className="text-gray-500 font-semibold text-[13px] md:text-sm line-clamp-1">{user?.playlistCount} playlist{user?.playlistCount > 1 && 's'}</h4>
          <p className="line-clamp-1 text-[13px] md:text-sm text-gray-300/50">Profile</p>
        </div>
      </Link>
    </div>
  )
}

export default ProfileCard