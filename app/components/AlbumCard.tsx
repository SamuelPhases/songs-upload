import { Icon } from '@iconify/react'

type Props = {}

const AlbumCard = (props: Props) => {
  return (
    <div className="rounded-lg group relative h-64 w-full flex flex-col items-center justify-center gap-2">
      <button type="button" className="absolute inset-0 h-full w-full rounded-lg bg-gray-900/50 group-hover:bg-gray-800/50 hover:bg-gray-800/50 focus:bg-gray-800/50 active:bg-gray-800/50 flex flex-col gap-3 text-left"></button>
      <button type="button" className="z-10 w-12 h-12 rounded-full bg-green-500 text-white transition-all flex items-center justify-center absolute right-3 bottom-0 opacity-0 active:opacity-100 group-hover:opacity-100 focus:opacity-100 active:bottom-24 group-hover:bottom-24 focus:bottom-24 hover:bg-transparent border-2 border-green-500 hover:text-green-500">
        <Icon icon="line-md:pause-to-play-filled-transition" className="text-5xl" />
      </button>
      <div className="absolute w-[90%] flex flex-col gap-2">
        <div className="h-40 w-full bg-white rounded-lg overflow-hidden shadow-2xl group-hover:shadow-gray-700 group-focus:shadow-gray-700 group-active:shadow-gray-700"></div>
        <h4 className="text-white font-semibold text-base truncate">Pray and Wait</h4>
        <div className="flex items-center gap-2 text-gray-500">
          <p className="truncate text-sm">2023</p>
          <Icon icon="icon-park-outline:dot" className="text-xs" />
          <p className="truncate text-sm">Album</p>
        </div>
      </div>
    </div>
  )
}

export default AlbumCard