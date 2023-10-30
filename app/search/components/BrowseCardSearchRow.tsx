import BrowseCardSearch from "@/app/components/BrowseCardSearch"
import { sideNavState } from "@/app/state/atoms"
import { useRecoilValue } from "recoil"

type Props = {}

const BrowseCardSearchRow = (props: Props) => {

    const sideNav = useRecoilValue(sideNavState)

  return (
    <div className={`${sideNav ? 'grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7' : 'grid gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'}`}>
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="/genre/christian" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Trending" imgSrc="" bgColor="bg-pink-700" url="/genre/trending" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-pink-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-purple-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-pink-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-pink-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-purple-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-pink-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-pink-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-purple-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-pink-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-blue-500" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-green-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-pink-700" url="" />
        <BrowseCardSearch title="Christian & Gospel" imgSrc="" bgColor="bg-purple-700" url="" />
    </div>
  )
}

export default BrowseCardSearchRow