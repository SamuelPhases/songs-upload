import SectionRow from "@/app/components/SectionRow"
import SongsRowSearch from "@/app/components/SongsRowSearch"
import Title from "@/app/components/Title"
import TopResultCard from "@/app/components/TopResultCard"
import { LoggedInUserProps, PlaylistsProps, SongProps, UserProps } from "@/app/utils"
import { DocumentData } from "firebase/firestore"
import { SetterOrUpdater } from "recoil"




type Props = {
    artistsFound: UserProps[],
    likeLoading: boolean,
    playlistsFound: PlaylistsProps[],
    songsFound: SongProps[],
    user: LoggedInUserProps | DocumentData | null,
    setUser:  SetterOrUpdater<LoggedInUserProps | DocumentData | null>,
    setLikeLoading: SetterOrUpdater<boolean>,
}

const FoundSearchText = ({ artistsFound, playlistsFound, songsFound, user, likeLoading, setLikeLoading, setUser }: Props) => {

    const searchFilter = ['all', 'artists', 'playlists', 'songs', 'albums', 'profiles']
    const artistIds = artistsFound.map(({id}) => id)


  return (
    <>
        {/* <div className="flex items-center gap-4 flex-wrap fixed w-[76%] bg-gray-900 z-20 -mt-7 -ml-5 px-5 pb-3">
            {searchFilter.map((name,index) => (
                <button type="button" key={index} className="transition w-fit px-4 py-1.5 font-medium rounded-xl bg-gray-700 text-sm text-white capitalize hover:bg-gray-800 focus:bg-gray-800 active:bg-gray-800">
                    {name}
                </button>
            ))}
        </div> */}
        {/* <div className="flex flex-col md:flex-row items-start gap-10 py-5 md:py-10"> */}
        <div className="flex flex-col md:flex-row items-start gap-10 py-5">
            <div className="grid gap-7 w-full md:w-2/5 lg:w-[35%] 2xl:w-[30%]">
                <Title title="Top result" />
                {songsFound.length > 0 && (
                    <TopResultCard song={songsFound[0]} user={user} />
                )}
                {playlistsFound.length > 0 && (
                    <TopResultCard playlist={playlistsFound[0]} user={user} />
                )}
                {artistsFound.length > 0 && (
                    <TopResultCard artist={artistsFound[0]} user={user} />
                )}
            </div>
            <div className="grid gap-7 w-full md:flex-1">
                {songsFound.length > 0 && (
                    <>
                        <Title title="Songs" />
                        <div className="grid">
                            {songsFound.map((song) => (
                                <SongsRowSearch key={song.id} song={song} user={user} likeLoading={likeLoading} setLikeLoading={setLikeLoading} setUser={setUser} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
        {((artistsFound.length > 0) || (playlistsFound.length > 0)) && (
            <div className="grid gap-10 py-5">
                {artistsFound.length > 0 && (
                    <div>
                        <SectionRow artist nullActionableTitle title="Artists" artistIds={artistIds} />
                    </div>
                )}
                {playlistsFound.length > 0 && (
                    <div>
                        <SectionRow playlist nullActionableTitle title="Playlists" playlists={playlistsFound} />
                    </div>
                )}
                {/* <div>
                    <SectionRow profile nullActionableTitle title="Profiles" />
                </div> */}
            </div>
        )}
    </>
  )
}

export default FoundSearchText