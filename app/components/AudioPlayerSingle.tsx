import Link from 'next/link';
import { Icon } from '@iconify/react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';

import { CurrentSongProps, PlaylistsProps, SongProps } from "../utils"
import { currentPlaying } from '../state/atoms';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
    // playlist?: PlaylistsProps,
    // song: SongProps | DocumentData | null,
    // next?: boolean,
    // prev?: boolean,
    // play: boolean,
    currentSong: CurrentSongProps | null,
    setCurrentSong: SetterOrUpdater<CurrentSongProps | null>
}

const AudioPlayer = ({ currentSong, setCurrentSong }: Props) => {

    const [sourceUrl, setSourceUrl] = useState<string>(``)
    const [repeatSong, setRepeatSong] = useState<boolean>(false)
    const [playlistItemIndex, setPlaylistItemIndex] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    // const [progress, setProgress] = useState<string>('w-[0%]')
    const [progress, setProgress] = useState<number>(0)
    const [volume, setVolume] = useState<number>(1.0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [seekPosition, setSeekPosition] = useState<number>(0);
    const progressContainerRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null)
    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    const toggleRepeatSong = () => setRepeatSong(!repeatSong)
      // Function to load the current track
    // const loadCurrentTrack = () => {
    //     if (audioRef.current && currentSong && currentSong.playlist && currentSong?.playlist.length > 0) {
    //         audioRef.current.src = currentSong?.playlist[playlistItemIndex]?.songUrl;
    //         audioRef.current.load();
    //     } else if (audioRef.current && currentSong) {
    //         audioRef.current.src = currentSong?.song?.songUrl;
    //         audioRef.current.load();
    //     }
    // };
    const handleNextTrack = () => {
        // Check if there are more tracks in the playlist
        if (currentSong && currentSong.playlist) {
            if (playlistItemIndex < currentSong?.playlist.length - 1) {
              setPlaylistItemIndex(playlistItemIndex + 1);
              loadCurrentTrack();
              setIsPlaying(true);
            }
        }
      };
    
      const handlePrevTrack = () => {
        // Check if there are previous tracks in the playlist
        if (playlistItemIndex > 0) {
          setPlaylistItemIndex(playlistItemIndex - 1);
        //   loadCurrentTrack();
          setIsPlaying(true);
        }
      };
    const playBtn = () => {
        if (currentSong) {
            if (audioRef.current) {
                if (audioRef.current.paused) {
                    audioRef.current.play()
                    setCurrentSong({...currentSong, play:true})
                    setIsPlaying(true)
                } else {
                    audioRef.current.pause()
                    setCurrentSong({...currentSong, play:false})
                    setIsPlaying(false)
                }
            } else {
                toast.error('Something went wrong')
            }
        } else {
            toast.error('Sorry, somthing went wrong, try refreshing the page')
        }
    }
    // const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const newVolume = parseFloat(e.target.value);
    //     if (audioRef.current) {
    //         setVolume(newVolume);
    //     }
    // };
    // const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const newProgress = parseFloat(e.target.value);
    //     const newTime = (newProgress / 100) * duration
    //     if (audioRef.current) {
    //         audioRef.current.currentTime = newTime
    //         setProgress(newProgress);
    //         setCurrentTime(newTime)
    //     }
    // };

    useEffect(()=>playBtn(),[])
    // useEffect(() => {
    //     if (audioRef.current) {
    //         audioRef.current.addEventListener("timeupdate", () => {
    //             if (audioRef.current) {
    //                 setCurrentTime(audioRef.current.currentTime)
    //                 setDuration(audioRef.current.currentTime)
    //                 // const newProgress = ((audioRef.current.currentTime / audioRef.current.duration) * 100).toFixed(2).toString()
    //                 // setProgress(`w-[${newProgress}%]`)
    //                 const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
    //                 setProgress(newProgress)
    //             }
    //         })
    //     }
    // },[])

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value);
        setSeekPosition(newProgress);
      };
    
    //   const handleProgressSeek = (e: React.MouseEvent<HTMLInputElement>) => {
    //     if (audioRef.current) {
    //       const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    //       audioRef.current.currentTime = seekTime;
    //       setSeekPosition(seekTime);
    //     }
    //   };
    const handleProgressSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressContainerRef.current && audioRef.current) {
          const containerRect = progressContainerRef.current.getBoundingClientRect();
          const seekPosition = (e.clientX - containerRect.left) / containerRect.width;  
          const seekTime = seekPosition * duration;
          if (!isNaN(seekTime) && isFinite(seekTime)) {
            audioRef.current.currentTime = seekTime;
            setSeekPosition(seekPosition * 100);
        }
        // audioRef.current.currentTime = seekTime;
        // setSeekPosition(seekPosition * 100);
        }
    };
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
        audioRef.current.volume = newVolume
        setVolume(newVolume);
    }
    };

    const handleSongFinished = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            if (currentSong) {
                if (currentSong.playlist) {
                    if (repeatSong) {
                        setCurrentSong({...currentSong, play:true})
                        audioRef.current.play()
                        console.log('play')
                    } else {
                        handleNextTrack()
                        setCurrentSong({...currentSong, play:true})
                        audioRef.current.pause()
                        console.log('pause')
                    }
                } else {
                    if (repeatSong) {
                        setCurrentSong({...currentSong, play:true})
                        audioRef.current.play()
                        console.log('play')
                    } else {
                        setCurrentSong({...currentSong, play:false})
                        audioRef.current.pause()
                        console.log('pause')
                    }
                }
            }
        }
    }

    // useEffect(() => {
    //     loadCurrentTrack();
    //   }, [playlistItemIndex, currentSong]);
    
    useEffect(() => {
    if (audioRef.current) {
        audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
            setSeekPosition((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
        });
    }
    }, []);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('ended', handleSongFinished)
        }
    },[repeatSong])

    console.log({currentSong})
    useEffect(()=>{
        if (currentSong) {
            if (currentSong.playlist) {
                setSourceUrl(currentSong?.playlist[playlistItemIndex]?.songUrl)
            } else {
                setSourceUrl(currentSong?.song?.songUrl)
            }
        }
    },[currentSong,playlistItemIndex])

    // console.log('hello')
    // console.log({currentTime})
    // console.log({duration})
    // console.log({progress})
    console.log({sourceUrl})

  return (
    <>  
        {/* {sourceUrl.trim() !== "" && (
        <>ba</>
        )} */}
        {currentSong && (
            <div className="w-full h-[8.5%] px-3 flex items-center justify-between gap-10 relative">
                {/* {sourceUrl.trim() !== "" && (
                )} */}
                <audio ref={audioRef}>
                    <source src={currentSong.song?.songUrl} />
                </audio>
                <div className="flex items-center w-[27%] gap-5 h-full">
                    <div className="w-[60px] h-3/4 bg-gray-700 rounded relative grid place-content-center overflow-hidden">
                       {currentSong?.playlist ? (
                        <>
                            {currentSong?.playlist[playlistItemIndex] && currentSong?.playlist[playlistItemIndex]?.imgUrl.trim() !== "" ? (
                                <Image src={currentSong?.playlist[playlistItemIndex]?.imgUrl} alt={`${currentSong?.playlist[playlistItemIndex]?.name} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
                            ) : (
                                <h2 className="text-4xl font-bold uppercase text-gray-300">{currentSong?.playlist[playlistItemIndex]?.name[0]}</h2>
                            )}
                        </>
                       ) : (
                        <>
                           {currentSong?.song && currentSong?.song?.imgUrl.trim() !== "" ? (
                               <Image src={currentSong?.song?.imgUrl} alt={`${currentSong?.song?.name} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
                           ) : (
                               <h2 className="text-4xl font-bold uppercase text-gray-300">{currentSong?.song?.name[0]}</h2>
                           )}
                        </>
                       )} 
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                            <Link href="" className="text-white transition-all hover:underline focus:underline w-fit line-clamp-1 text-sm capitalize">
                                {currentSong?.playlist ? (<>{currentSong?.playlist[playlistItemIndex]?.name}</>) : (<>{currentSong?.song?.name}</>)}
                            </Link>
                            <Icon icon="radix-icons:dot-filled" className="text-white" />
                            <Link href="" className="text-gray-200 uppercase transition-all hover:underline focus:underline w-fit line-clamp-1 text-sm">{currentSong?.playlistTitle}</Link>
                        </div>
                        <Link href="" className="text-gray-500 transition-all hover:underline focus:underline w-fit line-clamp-1 text-[13px]">
                            {currentSong?.playlistSongOwners && currentSong?.playlistSongOwners[playlistItemIndex]}
                        </Link>
                    </div>
                    <button type="button" className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all">
                        <Icon icon="line-md:heart-filled" className="text-xl text-green-500" />
                    </button>
                    {/* <button type="button" disabled={likeLoading} onClick={()=>handleLike(song?.id)} className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all opacity-0 group-hover:opacity-100">
                    {likeLoading ? (
                        <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
                    ) : (
                        <>{liked ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
                        )}
                    </button> */}
                </div>
                <div className="flex-1 h-full">
                    <div className="flex flex-col gap-2 w-4/5 mx-auto h-full">
                        <div className="flex items-center justify-center gap-5">
                            <div className="flex flex-col gap-0.5 relative">
                                <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                                    <Icon icon="ph:shuffle" className="text-xl" />
                                </button>
                                <Icon icon="radix-icons:dot-filled" className="text-white absolute -bottom-3 left-1/2 -translate-x-1/2" />
                            </div>
                            <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all -rotate-180">
                                <Icon icon="fluent:next-48-filled" className="text-xl" />
                            </button>
                            <button type="button" onClick={playBtn} className="w-10 h-10 rounded-full grid place-content-center bg-gray-300 text-gray-900 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200 transition-all">
                                {currentSong.play && <Icon icon="line-md:play-filled-to-pause-transition" className="text-3xl" />}
                                {!currentSong.play && <Icon icon="line-md:pause-to-play-filled-transition" className="text-3xl" />}
                                {/* {isPlaying && <Icon icon="line-md:play-filled-to-pause-transition" className="text-3xl" />}
                                {!isPlaying && <Icon icon="line-md:pause-to-play-filled-transition" className="text-3xl" />} */}
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                                <Icon icon="fluent:next-48-filled" className="text-xl" />
                            </button>
                            <div className="flex flex-col gap-0.5 relative">
                                <button type="button" onClick={toggleRepeatSong} className={`${repeatSong ? 'text-green-500' : 'text-gray-400 hover:text-white focus:text-white active:text-white'} transition-all`}>
                                    {!repeatSong ? <Icon icon="akar-icons:arrow-repeat" className="text-lg" /> : <Icon icon="bi:repeat-1" className="text-xl" />}
                                </button>
                                {repeatSong && <Icon icon="radix-icons:dot-filled" className="text-green-500 absolute -bottom-3.5 left-1/2 -translate-x-1/2" />}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <p className="text-xs text-gray-400">{formatTime(currentTime).split(':')[0] !== "00" ? `${formatTime(currentTime)}` : `${formatTime(currentTime).slice(3)}`}</p>
                            <div
                                ref={progressContainerRef}
                                style={{ width: '100%', cursor: 'pointer', backgroundColor: "#eeeeee" }}
                                onClick={handleProgressSeek}
                            >
                                <div
                                style={{
                                    width: `${isSeeking ? seekPosition : seekPosition}%`,
                                    height: '10px',
                                    backgroundColor: '#0077FF', // Adjust the progress bar color
                                }}
                                />
                            </div>
                            <p className="text-xs text-gray-400">
                                {currentSong?.playlist ? (
                                    <>
                                        {currentSong?.playlist[playlistItemIndex]?.duration === "00:00" ? (
                                            <>{formatTime(duration).split(':')[0] !== "00" ? `${formatTime(duration)}` : `${formatTime(duration).slice(3)}`}</>
                                        ) : (
                                            <>{currentSong?.playlist[playlistItemIndex]?.duration.split(':')[0] !== "00" ? `${currentSong?.playlist[playlistItemIndex]?.duration}` : `${currentSong?.playlist[playlistItemIndex]?.duration.slice(3)}`}</>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {currentSong?.song?.duration === "00:00" ? (
                                            <>{formatTime(duration).split(':')[0] !== "00" ? `${formatTime(duration)}` : `${formatTime(duration).slice(3)}`}</>
                                        ) : (
                                            <>{currentSong?.song?.duration.split(':')[0] !== "00" ? `${currentSong?.song?.duration}` : `${currentSong?.song?.duration.slice(3)}`}</>
                                        )}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-5 items-center justify-between w-1/5 flex-wrap h-full">
                    <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                        <Icon icon="fluent:meet-now-24-filled" className="text-xl" />
                    </button>
                    <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                        <Icon icon="lucide:mic-2" className="text-xl" />
                    </button>
                    <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                        <Icon icon="heroicons:queue-list" className="text-xl" />
                    </button>
                    <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                        <Icon icon="fluent:phone-laptop-16-regular" className="text-xl" />
                    </button>
                    <div className="flex items-center gap-2">
                        <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                            <Icon icon="solar:volume-loud-linear" className="text-xl" />
                            {/* <Icon icon="solar:volume-cross-linear" className="text-xl" /> */}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={isSeeking ? seekPosition : progress}
                            onChange={handleProgressChange}
                            onMouseDown={() => setIsSeeking(true)}
                            onMouseUp={() => setIsSeeking(false)}
                            className="hidden"
                        />
                        <input type="range" max="1" min="0" step="0.01" value={volume} onChange={handleVolumeChange} />
                    </div>
                    <button type="button" className="text-gray-400 hover:text-white focus:text-white active:text-white transition-all">
                        <Icon icon="fluent:picture-in-picture-24-regular" className="text-xl" />
                    </button>
                </div>
            </div>
        )}
    </>
  )
}

export default AudioPlayer