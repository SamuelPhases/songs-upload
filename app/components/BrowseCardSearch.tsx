import Link from "next/link"

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    bgColor?: string,
    imgSrc: string,
    title: string,
    url: string
}

const BrowseCardSearch = ({ bgColor="bg-green-700", imgSrc, className, title, url, ...props }: Props) => {
  return (
    <div className={`rounded-lg h-48 w-full p-5 relative group overflow-hidden ${bgColor}`}>
        <Link href={url} className="p-3 bg-transparent absolute inset-0 rounded-lg before:absolute before:w-0 before:h-0 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#00000020] active:before:w-full focus:before:w-full hover:before:w-full active:before:h-full focus:before:h-full hover:before:h-full group-active:before:w-full group-focus:before:w-full group-hover:before:w-full group-active:before:h-full group-focus:before:h-full group-hover:before:h-full before:origin-center transition-all before:transition-all"></Link>
        <h2 className="text-white font-bold text-xl line-clamp-3">{title}</h2>
        <div className="absolute rotate-45 bg-orange-500 -bottom-3 h-24 w-24 -right-3 overflow-hidden"></div>
    </div>
  )
}

export default BrowseCardSearch