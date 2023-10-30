import Link from "next/link"
import { Icon } from '@iconify/react'


type Props = {}

const CardRowItem = (props: Props) => {
  return (
    <div className="flex items-center justify-between gap-3 group hover:bg-gray-900 transition-all rounded-xl px-5 py-3">
        <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 flex items-center justify-center opacity-100 transition-all">
                <p className="text-gray-500 text-[13px]">1</p>
            </div>
            {/* <button type="button" className="w-5 h-5 group-hover:inline-flex items-center justify-center opacity-0 transition-all group-hover:opacity-100 hidden">
                <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
            </button> */}
            <div className="grid gap-0.5">
                <Link href="/track/1" className="text-white text-sm font-bold transition-all hover:underline focus:underline active:underline truncate">
                    My Daddy, My Daddy - Live at AIIIH - As It Is In Heaven
                </Link>
                <Link href="/artist/1" className="text-gray-500 font-bold text-sm transition-all hover:underline focus:underline active:underline truncate">
                    Dunsin Oyekan
                </Link>
            </div>
        </div>
        {/* <p className="w-[20%] group-hover:text-white text-gray-500 text-[13px] transition-all text-right truncate">19,957,095</p> */}
        <div className="flex items-center justify-end gap-5 w-1/4">
            <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all opacity-0 group-hover:opacity-100">
                <Icon icon="line-md:heart" className="text-xl" />
            </button>
            <p className="text-gray-500 text-[13px] text-right truncate">13:55</p>
            <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all opacity-0 group-hover:opacity-100">
                <Icon icon="svg-spinners:3-dots-move" className="text-xl" />
            </button>
        </div>
    </div>
  )
}

export default CardRowItem