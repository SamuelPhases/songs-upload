import Link from "next/link"
import { Icon } from '@iconify/react'


type Props = {}

const CardInfo = (props: Props) => {
  return (
    <div className="flex items-center gap-2 text-white">
        <div className="w-5 h-5 rounded-full bg-blue-900"></div>
        <Link href="/artist/1" className="text-sm font-bold hover:underline focus:underline active:underline">Dunsin Oyekan</Link>
            <Icon icon="radix-icons:dot-filled" className="text-xs" />
        <p className="text-sm font-bold">2023</p>
            <Icon icon="radix-icons:dot-filled" className="text-xs" />
        <p className="text-sm font-bold">10 songs,</p>
        <p className="text-sm font-bold text-gray-500">2hr 24min</p>
    </div>
  )
}

export default CardInfo