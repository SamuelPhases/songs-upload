import { atom } from 'recoil';
import { CurrentSongProps, FollowDataProps, LoggedInUserProps, PlaylistsProps, SongProps, UserProps } from '../utils';
import { DocumentData } from 'firebase/firestore';


export const sideNavState = atom<boolean>({
    key: 'sideNavState',
    default: true
})

export const selectedGenre = atom<string | null>({
    key: 'genre',
    default: null
})

export const selectedGenreBg = atom<string>({
    key: 'genreBg',
    default: 'bg-gray-900'
})

// export const loggedInUser = atom<LoggedInUserProps | any | null>({
// export const loggedInUser = atom<LoggedInUserProps>({
export const loggedInUser = atom<LoggedInUserProps | null | DocumentData>({
    key: 'loggedInUser',
    default: null
    // default: {
    //     createdAt: "",
    //     displayPicture: "",
    //     dob: "",
    //     email: "",
    //     firstName: "",
    //     gender: "",
    //     lastLogin: "",
    //     lastName: "",
    //     userName: "",
    //     id: "",
    //     playlistCount: 0,
    //     songs: []
    // }
})

export const loadingModal = atom<boolean>({
    key: 'loading',
    default: false
})

export const loadingModalText = atom<string>({
    key: 'loadingText',
    default: ''
})

export const personalPlaylistCount = atom<number>({
    key: 'playlistCount',
    default: 0
})

export const userSongs = atom<SongProps[]>({
    key: 'songs',
    default: []
})

export const allSongs = atom<SongProps[]>({
    key: 'songList',
    default: []
})

export const viewTrack = atom<SongProps | null | DocumentData>({
    key: 'track',
    default: null
})

export const userViewHistory = atom<string[] | DocumentData>({
    key: 'viewHistory',
    default: []
})

export const userRefactorViewHistory = atom<string[] | DocumentData>({
    key: 'refactorViewHistory',
    default: []
})

export const otherUsersPlaylists = atom<PlaylistsProps[]>({
    key: 'otherPlaylists',
    default: []
})

export const playlistsItems = atom<PlaylistsProps[]>({
    key: 'playlists',
    default: []
})

export const likedLoading = atom<boolean>({
    key: 'likeLoading',
    default: false
})

export const searchPageTerm = atom<string>({
    key: 'search',
    default: ""
})

export const otherUsers = atom<UserProps[]>({
    key: 'users',
    default: []
})

export const viewingUser = atom<UserProps | null | DocumentData>({
    key: 'artist',
    default: null
})

export const updateProfileLoading = atom<boolean>({
    key: 'updatingProfile',
    default: false
})

export const updateProfilePageModal = atom<boolean>({
    key: 'updateProfileModal',
    default: false
})

export const followingUsers = atom<UserProps[]>({
    key: 'following',
    default: []
})

export const followInformation = atom<FollowDataProps | DocumentData>({
    key: 'followData',
    default: {followers:[], following: []}
})

export const usersFollowers = atom<UserProps[]>({
    key: 'followers',
    default: []
})

export const searchComplete = atom<boolean>({
    key: 'searching',
    default: false
})

export const searchSongResults = atom<SongProps[]>({
    key: 'songsFound',
    default: []
})

export const searchArtistResults = atom<UserProps[]>({
    key: 'artistsFound',
    default: []
})

export const searchPlaylistResults = atom<PlaylistsProps[]>({
    key: 'playlistsFound',
    default: []
})

export const currentPlaying = atom<CurrentSongProps | null>({
    key: 'currentSong',
    default: null
})

// export const recoilSupabaseClient = atom<any>({
//     key: 'recoilSupabaseClient',
//     default: null
// })