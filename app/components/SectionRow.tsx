import { SetterOrUpdater, useRecoilValue } from "recoil"
import { sideNavState } from "../state/atoms"
import ArtistCard from "./ArtistCard"
import Media from "./Media"
import PlaylistCard from "./PlaylistCard"
import ProfileCard from "./ProfileCard"
import AlbumCard from "./AlbumCard"
import { CurrentSongProps, LoggedInUserProps, PlaylistsProps, SongProps, UserProps } from "../utils"
import CurrentUserPlaylistCard from "./CurrentUserPlaylistCard"
import CurrentUserMedia from "./CurrentUserMedia"
import { DocumentData } from "firebase/firestore"
import UserCard from "./UserCard"
import RecentlyPlayedCard from "./RecentlyPlayedCard"

type Props = {
  albums?: boolean,
  artist?: boolean,
  className?: string,
  nullActionableTitle?: boolean,
  playlist?: boolean,
  profile?: boolean,
  title: string,
  playlists?: PlaylistsProps[],
  artistIds?: string[],
  songs?: SongProps[],
  song?: boolean,
  refactorView?: boolean,
  refactorViewHistory?: DocumentData | string[],
  updatingProfile?: boolean,
  user?: LoggedInUserProps | DocumentData | null,
  users?: UserProps[],
  setTrack?: SetterOrUpdater<SongProps | DocumentData | null>,
  profileCardDetails?: UserProps[],
  setCurrentSong?: SetterOrUpdater<CurrentSongProps | null>
}

const SectionRow = ({ albums = false, artist = false, className, nullActionableTitle = true, playlist = false, profile = false, song = false, title, playlists, artistIds, songs, setTrack, updatingProfile, user, users, profileCardDetails, refactorView, refactorViewHistory, setCurrentSong }: Props) => {

  const sideNav = useRecoilValue(sideNavState)

  return (
    <div className={`flex flex-col gap-0 ${className} md:px-0`}>
      <h3 className="text-white text-xl lg:text-2xl font-bold pb-2">{title}</h3>
      {/* <div className="flex gap-5 items-center justify-between">
        {nullActionableTitle ? (
        ) : (
          <>
            <button type="button" className="text-white text-2xl font-bold transition hover:underline focus:underline active:underline">{title}</button>
            <button type="button" className="font-medium text-gray-300/50 transition hover:underline focus:underline active:underline text-sm">Show all</button>
          </>
        )}
      </div> */}
      {/* <div className={`${sideNav ? 'grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7' : 'grid gap-5 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'}`}> */}
      <div className={`${sideNav ? 'grid gap-5 grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8' : 'grid gap-5 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-9'}`}>
        {artist && (
          <>
            {artistIds?.map((id,index) => (
              <ArtistCard key={index} id={id} user={user} />
            ))}
          </>
        )}
        {users && users.map((user,index) => (
          <UserCard key={index} user={user}  />
        ))}
        {profile && profileCardDetails && profileCardDetails.map((profileUser,index) => (
            <ProfileCard key={index} user={profileUser} currentUser={user} />
          )
        )}
        {playlist && (
          <>
            {playlists?.map((playlist: PlaylistsProps) => (
              <>
                {setCurrentSong && <CurrentUserPlaylistCard key={playlist?.id} playlist={playlist} setCurrentSong={setCurrentSong} />}
                {/* {user ? (
                  <>
                    {setCurrentSong && <CurrentUserPlaylistCard key={playlist?.id} playlist={playlist} user={user} setCurrentSong={setCurrentSong} />}
                  </>
                ) : (
                  <>
                    <PlaylistCard key={playlist?.id} playlist={playlist} />
                  </>
                )} */}
              </>
            ))}
          </>
        )}
        {song && (
          <>
            {songs?.map((song: SongProps,index) => (
              <>
              {setCurrentSong && <Media key={index} song={song}  setCurrentSong={setCurrentSong} />}
                {/* {user ? (
                  <>
                    {setCurrentSong && <CurrentUserMedia key={index} song={song} user={user} setCurrentSong={setCurrentSong} />}
                  </>
                ) : (
                  <>
                  {setCurrentSong && <Media key={index} song={song}  setCurrentSong={setCurrentSong} />}
                  </>
                )} */}
              </>
            ))}
          </>
        )}
        {refactorView && (
          <>
            {refactorViewHistory?.map((refactorView: string) => (
              <>
                {setTrack && setCurrentSong && (
                  <RecentlyPlayedCard key={refactorView} id={refactorView} user={user} setTrack={setTrack} setCurrentSong={setCurrentSong} />
                )}
              </>
            ))}
          </>
        )}
        {albums && (
          <>
            <AlbumCard/>
            <AlbumCard/>
            <AlbumCard/>
            <AlbumCard/>
            <AlbumCard/>
            <AlbumCard/>
            <AlbumCard/>
          </>
        )}
        {/* {!artist && !albums && !playlist && !profile && (
          <>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
            <Media/>
          </>
        )} */}
      </div>
    </div>
  )
}

export default SectionRow