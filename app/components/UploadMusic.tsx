import { useState } from "react"
import { Icon } from '@iconify/react';
import toast from "react-hot-toast"
import Modal from "./Modal"
import { LoggedInUserProps, SongProps, uploadFile } from "../utils";
import { db } from "@/firebase";
import { DocumentData, addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userSongs } from "../state/atoms";

type Props = {
    toggleModal: () => void,
    user: LoggedInUserProps | DocumentData | null
}

const UploadMusic = ({ toggleModal, user }: Props) => {

    const [songs, setSongs] = useRecoilState(userSongs)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({imgUrl: "", songUrl: "", name: "", description: "", genre:  "", duration: ""})
    const handleData = (e: any) => setData({...data, [e.target.name]: e.target.value})
    const [uploadingFile, setUploadingFile] = useState<boolean>(false)
    const [image, setImage] = useState("")
    const maximumFileSize = 2
    const expectedImgFileTypes = ['png','jpeg','jpg']
    const handleImgUpload = async (e: any) => {
      const file = e.target.files[0]
      const validFileType = expectedImgFileTypes.includes(file.type.split('/')[1])
      const validSize = Math.ceil(file.size / 1048576)
      if (file) {
        if (validFileType) {
          if (validSize <= maximumFileSize) {
            setUploadingFile(true)
            try {
              setImage(URL.createObjectURL(file))
              const res = await uploadFile(file)
              if (res.trim() !== '') {
                setData({...data, imgUrl:res})
              } else {
                toast.error('Something went wrong')
              } 
            } catch (error: any) {
              toast.error(error.message)
            } finally {
              setUploadingFile(false)
            }
          } else {
            toast.error('File Size has exceeded the expected file size of 2MB.')
          }
        } else {
          toast.error(`Only images with these extensions are expected - "png, jpeg or jpg".`)
        }
      } else {
        // toast.error('You need to choose a file to upload')
        toast.error('No file selected')
      }
    } 
    const [uploadingAudioFile, setUploadingAudioFile] = useState<boolean>(false)
    const [audio, setAudio] = useState("")
    // const [duration, setDuration] = useState<null | { hours: number; minutes: number; seconds: number }>(null);
    const [duration, setDuration] = useState<string>('0');
    const maximumAudioFileSize = 5
    const expectedAudioFileTypes = ['mpeg','mp3']
    const formatTime = (time: number) => {
      return time < 10 ? `0${time}` : time.toString();
    };
    const songUpload = async (e: any) => {
      const file = e.target.files[0]
      console.log({file})
      const validFileType = expectedAudioFileTypes.includes(file.type.split('/')[1])
      const validSize = Math.ceil(file.size / 1048576)
      if (file) {
        if (validFileType) {
          if (validSize <= maximumAudioFileSize) {
            setUploadingAudioFile(true)
            try {
                const audioSong = new Audio();
                audioSong.src = URL.createObjectURL(file);
                setAudio(URL.createObjectURL(file))
                audioSong.addEventListener('loadedmetadata', () => {
                  // setDuration(audioSong.duration.toFixed(2));
                  const totalSeconds = audioSong.duration;
                  const hours = Math.floor(totalSeconds / 3600);
                  const minutes = Math.floor((totalSeconds % 3600) / 60);
                  const seconds = Math.floor(totalSeconds % 60);
          
                  // setDuration({ hours, minutes, seconds });
                  const formattedDuration = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
                  setDuration(formattedDuration);
                  URL.revokeObjectURL(audioSong.src); // Clean up
                });
                // console.log({data})
                const res = await uploadFile(file)
                if (res.trim() !== '') {
                  setData({...data, songUrl:res})
                } else {
                  toast.error('Something went wrong')
                } 
            } catch (error: any) {
              toast.error(error.message)
            } finally {
              setUploadingAudioFile(false)
            }
          } else {
            toast.error('File Size has exceeded the expected file size of 10MB.')
          }
        } else {
          toast.error(`Only images with these extensions are expected - "mpeg or mp4".`)
        }
      } else {
        // toast.error('You need to choose a file to upload')
        toast.error('No file selected')
      }
    } 
    // console.log({duration})
    console.log({audio})
    const handleSongUpload = async (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (data.name.trim() === "") return toast.error('Name field is required.')
      if (data.songUrl.trim() === "") return toast.error('You need choose a song to upload.')
      setLoading(true)
    //   if (typeof(id) === "string") {
    // }
    if (user) {
        try {
          const newSong = {
            name: data.name.toLowerCase(),
            songUrl: data.songUrl,
            imgUrl: data.imgUrl,
            genre: data.genre.toLowerCase(),
            description: data.description,
            owner: user.id,
            duration: duration,
            createdAt: Date.now(),
            updatedAt: "",
            views: 0
          }
          const res = await addDoc(collection(db, "songs"), newSong);
          const newSongList: SongProps[] | any[] = [...songs, {id: res.id, ...newSong}]
          setSongs(newSongList)
          // console.log(res.data())
          // console.log(res.id)
          setLoading(false)
          toggleModal()
          toast.success('Song uploaded successfully')
        } catch (error: any) {
        console.log({error})
        setLoading(false)
        toast.error(error?.message)
        } finally {
            setLoading(false)
        }
    }
    }

  return (
    <div className="fixed inset-0 bg-gray-700/20 text-white z-50 flex items-center justify-center">
        <div className="w-11/12 h-full max-h-[650px] lg:h-10/12 max-w-[500px] p-4 lg:p-7 flex items-center justify-center gap-5 flex-col bg-gray-900 rounded-lg overflow-y-auto">
            <div className="flex items-center justify-between gap-5 w-full">
                <h3 className="text-xl lg:text-3xl font-bold">Upload Song</h3>
                <button type="button" onClick={toggleModal} className="w-10 h-10 grid place-items-center hover:bg-gray-700 focus:bg-gray-700 transition-all rounded-full">
                  <Icon icon="line-md:remove" className="text-3xl" />
                </button>
            </div>
            <form onSubmit={handleSongUpload} className="w-full flex items-center justify-center gap-5 flex-col">
                <div className="flex items-start justify-between gap-5 w-full">
                    <div className="w-full lg:w-1/2 h-[150px] md:h-[180px] lg:h-[200px] bg-gray-800 relative group overflow-hidden">
                        {audio.trim() !== "" && (
                            <div className="absolute inset-0 cursor-pointer transition-all">
                              <audio controls autoPlay={false} preload="metadata" className="w-full h-[100px] rounded-none z-10 absolute bottom-0 left-0 bg-blue">
                                <source src={audio}/>
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                        )}
                        <label htmlFor="songUrl" className="absolute inset-0 cursor-pointer grid place-items-center place-content-center transition-all disabled:cursor-not-allowed">
                            <Icon icon="carbon:music" className="text-3xl md:text-5xl xl:text-8xl opacity-100  group-hover:opacity-0 group-hover:hidden group-focus:hidden group-focus:opacity-0 transition-all" />
                            <Icon icon="cil:pencil" className="text-3xl md:text-5xl xl:text-8xl opacity-0 hidden group-hover:opacity-100 group-hover:block group-focus:block group-focus:opacity-100 transition-all" />
                        </label>
                        <input type="file" name="songUrl" disabled={loading || uploadingAudioFile || uploadingFile} id="songUrl" accept="audio/*" onChange={songUpload} className="hidden absolute inset-0" />
                    </div>
                    <div className="w-full lg:w-1/2 h-[150px] md:h-[180px] lg:h-[200px] bg-gray-800 relative group overflow-hidden">
                        {image.trim() !== "" && (
                            <div className="absolute inset-0 cursor-pointer transition-all">
                                <Image src={image} alt="Selected file" layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
                            </div>
                        )}
                        <label htmlFor="imgUrl" className="absolute inset-0 cursor-pointer grid place-items-center place-content-center transition-all disabled:cursor-not-allowed">
                            <Icon icon="mdi:picture" className="text-3xl md:text-5xl xl:text-8xl opacity-100  group-hover:opacity-0 group-hover:hidden group-focus:hidden group-focus:opacity-0 transition-all" />
                            <Icon icon="cil:pencil" className="text-3xl md:text-5xl xl:text-8xl opacity-0 hidden group-hover:opacity-100 group-hover:block group-focus:block group-focus:opacity-100 transition-all" />
                        </label>
                        <input type="file" name="imgUrl" disabled={loading || uploadingFile || uploadingAudioFile} id="imgUrl" accept="image/*" onChange={handleImgUpload} className="hidden absolute inset-0" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 justify-between w-full h-full">
                    <input type="text" name="name" disabled={loading} onChange={handleData} maxLength={50} value={data.name} placeholder="Song Title" className="p-2 disabled:cursor-not-allowed disabled:bg-gray-700 rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
                    <input type="text" name="genre" disabled={loading} onChange={handleData} value={data.genre} placeholder="Genre" className="p-2 disabled:cursor-not-allowed disabled:bg-gray-700 rounded h-[40px] w-full border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
                    <textarea name="description" disabled={loading} onChange={handleData} maxLength={150} value={data.description} placeholder="Add an optional description" className="p-2 disabled:cursor-not-allowed disabled:bg-gray-700 h-[150px] rounded resize-none border border-transparent focus:border-white transition-all text-sm bg-gray-800"/>
                </div>
                <button type="submit" disabled={loading || uploadingFile || uploadingAudioFile} className="w-full p-3 disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-900 bg-white text-gray-900 transition-all focus:bg-gray-900 focus:text-white hover:bg-gray-900 hover:text-white active:bg-gray-900 active:text-white font-extrabold text-base uppercase border border-white
                grid place-items-center"
                >
                    {(uploadingFile || uploadingAudioFile) ? (
                        <>Uploading File</>
                    ) : (
                        <>
                        { loading ? ( <Icon icon="svg-spinners:eclipse-half" className="text-3xl" /> ) : ( <>Upload music</> )}
                        </>
                    )}
                </button>
            </form>
        </div>
    </div>
  )
}

export default UploadMusic