import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { Icon } from '@iconify/react'
import { signOut } from 'firebase/auth'
import toast from 'react-hot-toast'

import { auth } from '@/firebase'
import { loadingModal, loggedInUser } from "../state/atoms"
import { LoggedInUserProps } from "../utils"
import { DocumentData } from "firebase/firestore"



type Props = {
    user: LoggedInUserProps | null | DocumentData
}

const Footer = ({ user }: Props) => {

    const router = useRouter()

    const links = [
        {
            name: 'about',
            url: '/about'
        },
        {
            name: 'mail app',
            url: '/'
        },
        {
            name: 'videos app',
            url: '/'
        },
    ]
    const socialLinks = [
        {
            icon: 'line-md:document-code-twotone',
            name: 'Github',
            url: ''
        },
        {
            icon: 'line-md:linkedin',
            name: 'Linked In',
            url: ''
        },
        {
            icon: 'line-md:instagram',
            name: 'Instagram',
            url: ''
        }
    ]

    const setLoading = useSetRecoilState(loadingModal)
    const logout = async () => {
        setLoading(true)
        try {
          await signOut(auth)
          setLoading(false)
          toast.success('Successfully signed out.')
        //   router.replace('/login')
        } catch (error: any) {
            setLoading(false)
            toast.error(error.message)
        }
    }


  return (
    <footer className="w-full flex flex-col py-5">
        <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-5 py-4">
            <div className="flex flex-col gap-2">
                <h5 className="text-white font-bold text-base">Useful Links</h5>
                <div className="flex flex-col gap-2">
                    {links.map(({name,url},index) => (
                        <Link href={url} key={index} className="text-gray-400/50 text-base capitalize transition-all hover:text-white focus:text-white active:text-white">{name}</Link>
                    ))}
                </div>
            </div>
            <div className="flex gap-7">
                {socialLinks.map(({icon,name,url},index) => (
                    <Link href={url} key={index} className="text-white w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-700 flex items-center justify-center">
                        <Icon icon={icon} className="text-xl" />
                    </Link>
                ))}
            </div>
        </div>
        { user && <button type="button" onClick={logout} className="text-gray-400/50 text-base capitalize transition-all w-fit mr-auto hover:text-red-600 focus:text-red-600 active:text-white">Log out</button> }
        <div className="my-5 border-b-[1px] border-b-gray-400/50"></div>
        <p className="text-base py-4 text-gray-400/50">&copy; 2023 Songs App</p>
    </footer>
  )
}

export default Footer