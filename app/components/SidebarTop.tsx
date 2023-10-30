import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from '@iconify/react';
import { useRecoilValue } from "recoil";
import { sideNavState } from "../state/atoms";

type Props = {
  closeMobileSideNav?: () => void
}

const SidebarTop = ({ closeMobileSideNav }: Props) => {

    const pathname = usePathname()
    const appLinks = [
        {
            active: pathname === '/',
            icon: "line-md:home-simple-filled",
            name: "home",
            url: "/"
        },
        {
            active: pathname === "/search",
            icon: "line-md:search-filled",
            name: "search",
            url: "/search"
        }
    ]

    const sideNav = useRecoilValue(sideNavState)


  return (
    <div className="bg-gray-800/40 rounded-xl flex flex-col justify-between items-end w-full gap-2 h-fit px-2">
        {appLinks.map(({active, icon, name, url},index) => (
            <Link href={url} key={index} onClick={closeMobileSideNav} className={`flex items-center gap-4 text-sm lg:text-base p-3 capitalize font-semibold text-gray-400 transition hover:text-white focus:text-white active:text-white ${active && 'text-white'} ${sideNav ? 'md:mx-auto lg:ml-0 mr-auto' : 'mr-auto md:mx-auto lg:ml-auto'}`}>
                <Icon icon={icon} className="text-base md:text-xl" />
                {sideNav && <span className="inline md:hidden lg:inline">{name}</span>}
            </Link>
        ))}
    </div>
  )
}

export default SidebarTop