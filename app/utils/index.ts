import { DocumentData, doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useEffect, useState } from "react"
import axios from "axios"

export const moreLength = 5

export const handleTitle = (genre: string | null) => {
    if (genre === "christian") {
      return `Christian & Gospel`
    } else {
      return genre
    }
}

export const getColor = (genre: string | null) => {
    let bg = `from-gray-900`
    switch (genre) {
        case 'christian':
            bg = `from-blue-500`
            break;
        case 'trending':
            bg = `from-pink-700`
            break;
        default:
            break;
    }
    return bg
}

export const useDebounce = (text: string, delay: number) => {
    const [debouncedSearch, setDebouncedSearch] = useState<string>('')

    useEffect(() => {
      const debouncedValue = setTimeout(() => setDebouncedSearch(text),delay)
      return () => clearTimeout(debouncedValue)
    }, [text,delay])
    return debouncedSearch
}

export const uploadFile = async (file: File) => {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', `${preset}`)
  let data = ""
  await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`,formData).then((response) => {
    data = response.data["secure_url"]
  })
  return data
}


export interface UserProps {
    id: string,
    createdAt: string,
    displayPicture: string,
    dob: string,
    email: string,
    firstName: string,
    gender: string,
    lastLogin: string,
    lastName: string,
    userName: string,
    playlistCount: number,
    songs: string[],
    description: string, 
    fbLink:  string,
    ttLink: string, 
    igLink: string,
    updatedAt: string,
    // playlistCount: number,
}

export interface LoggedInUserProps {
    createdAt: string,
    displayPicture: string,
    dob: string,
    email: string,
    firstName: string,
    gender: string,
    lastLogin: string,
    lastName: string,
    userName: string,
    id: string,
    playlistCount: number,
    songs: string[],
    description: string, 
    fbLink:  string,
    ttLink: string, 
    igLink: string,
    updatedAt: string,
}

export interface PlaylistsProps {
    id: string,
    owner: string,
    songs: string[],
    name: string,
    createdAt: number,
    genre: string,
    description: string,
    updatedAt: number,
    imgUrl: string,
}

export interface SongProps {
    id: string,
    owner: string,
    ownerId?: string,
    songUrl: string,
    imgUrl: string,
    name: string,
    createdAt: string,
    genre: string,
    description: string,
    updatedAt: string,
    views: number,
    duration: string
}

export interface FollowDataProps {
    following: string[],
    followers: string[]
}

export interface CurrentSongProps {
    playlist: (SongProps | DocumentData)[],
    playlistTitle: string,
    playlistSongOwners: string[],
    song: SongProps | DocumentData | null,
    play: boolean,
}