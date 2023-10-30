import { useRecoilValue } from "recoil"

import Media from "@/app/components/Media"
import { sideNavState } from "@/app/state/atoms"



type Props = {}

const Discography = (props: Props) => {

    const sideNav = useRecoilValue(sideNavState)
    const discographyTab = ['Popular','Singles','EP']

  return (
    <div className="grid gap-3">
        <div className="flex gap-5 items-center justify-between">
            <button type="button" className="text-white text-2xl font-bold transition hover:underline focus:underline active:underline">Discography</button>
            <button type="button" className="font-medium text-gray-300/50 transition hover:underline focus:underline active:underline text-sm">Show all</button>
        </div>
        <div className="flex gap-3 items-center my-2">
            {discographyTab.map((item,index) => (
                <button type="button" key={index} className="flex items-center gap-4 w-fit px-4 py-1.5 font-medium rounded-xl bg-gray-700 text-sm text-white capitalize hover:bg-gray-800 focus:bg-gray-800 active:bg-gray-800 transition-all">{item}</button>
            ))}
        </div>
        <div className={`${sideNav ? 'grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7' : 'grid gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'}`}>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
        </div>
    </div>
  )
}

export default Discography