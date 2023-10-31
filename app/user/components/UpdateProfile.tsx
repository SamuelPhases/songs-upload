import { useState } from "react"
import { Icon } from '@iconify/react';
import toast from "react-hot-toast"
import { DocumentData, addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

import { db } from "@/firebase";
import { LoggedInUserProps, uploadFile } from "@/app/utils";
import { loggedInUser, updateProfileLoading } from "@/app/state/atoms";
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from "recoil";
import Image from "next/image";

type Props = {
    toggleModal: () => void,
    updatingProfile: boolean,
    user: LoggedInUserProps | DocumentData,
    setUpdatingProfile: SetterOrUpdater<boolean>,
}

const UploadProfile = ({ toggleModal, updatingProfile, user, setUpdatingProfile }: Props) => {


    const [image, setImage] = useState<string>("")
    const [uploadingFile, setUploadingFile] = useState<boolean>(false)
    const setUser = useSetRecoilState(loggedInUser)
    const [data, setData] = useState({
        displayPicture: `${user.displayPicture}`,
        firstName: `${user.firstName}`, 
        lastName: `${user.lastName}`, 
        description: `${user.description}`, 
        fbLink:  `${user.fbLink}`,
        ttLink: `${user.ttLink}`, 
        igLink: `${user.igLink}`,
        email: `${user.email}`,
        userName: `${user.userName}`,
        dob: `${user.dob}`,
        gender: `${user.gender}`,
    })
    const handleData = (e: any) => setData({...data, [e.target.name]: e.target.value})

    const maximumFileSize = 2
    const expectedFileTypes = ['png','jpeg','jpg']
    const handleImgUpload = async (e: any) => {
      const file = e.target.files[0]
      const validFileType = expectedFileTypes.includes(file.type.split('/')[1])
      const validSize = Math.ceil(file.size / 1048576)
      if (file) {
        if (validFileType) {
          if (validSize <= maximumFileSize) {
            setUploadingFile(true)
            try {
              setImage(URL.createObjectURL(file))
              const res = await uploadFile(file)
              if (res.trim() !== '') {
                setData({...data, displayPicture:res})
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

    const handleUpdateProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (data.userName.trim() === "") return toast.error('Username field is required.')
        setUpdatingProfile(true)
        const newUserData = {
            ...user,
            userName: data.userName,
            displayPicture: data.displayPicture,
            description: data.description,
            fbLink: data.fbLink,
            ttLink: data.ttLink,
            igLink: data.igLink,
            updatedAt: Date.now()
        }
        if (user) {
            if (data.userName !== user.userName) {
                const q = query(collection(db, "users"), where("userName", "==", data.userName));
                const users = []
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                users.push(doc.data().userName)
                });
                if (users.length === 0) {
                    try {
                        await updateDoc(doc(db, "users", user.id), newUserData);
                        setUser(newUserData)
                        setUpdatingProfile(false)
                        toggleModal()
                        toast.success('Profile updated successfully')
                    } catch (error: any) {
                    setUpdatingProfile(false)
                    toast.error(error?.message)
                    } finally {
                        setUpdatingProfile(false)
                    }
                } else {
                    toast.error('Sorry, this Username is already taken')
                    setUpdatingProfile(false)

                }
            } else {
                try {
                    await updateDoc(doc(db, "users", user.id), newUserData);
                    setUser(newUserData)
                    setUpdatingProfile(false)
                    toggleModal()
                    toast.success('Profile updated successfully')
                } catch (error: any) {
                setUpdatingProfile(false)
                toast.error(error?.message)
                } finally {
                    setUpdatingProfile(false)
                }
            }

        }
    }

  return (
    <div className="fixed inset-0 bg-gray-700/20 text-white z-70 flex items-center justify-center">
        <div className="w-11/12 h-10/12 max-w-[600px] p-7 flex items-center justify-center gap-5 flex-col bg-gray-900 rounded-lg overflow-y-auto">
            <form onSubmit={handleUpdateProfile} className="w-full flex items-center justify-center gap-5 flex-col">
                <div className="flex items-center justify-between gap-5 w-full">
                    <h3 className="text-3xl font-bold">Profile</h3>
                    <button type="button" disabled={updatingProfile} onClick={toggleModal} className="w-10 h-10 grid place-items-center hover:bg-gray-700 focus:bg-gray-700 transition-all rounded-full">
                        <Icon icon="line-md:remove" className="text-3xl" />
                    </button>
                </div>
                <div className="flex items-start justify-center gap-5 w-full">
                    <div className="w-[200px] h-[200px] rounded-full bg-gray-800 relative group overflow-hidden">
                        <label htmlFor="displayPicture" className="absolute inset-0 cursor-pointer grid place-items-center place-content-center transition-all">
                            <Icon icon="line-md:account" className="text-8xl opacity-100  group-hover:opacity-0 group-hover:hidden group-focus:hidden group-focus:opacity-0 transition-all" />
                            <Icon icon="cil:pencil" className="text-8xl opacity-0 hidden group-hover:opacity-100 group-hover:block group-focus:block group-focus:opacity-100 transition-all" />
                        </label>
                        {((user.displayPicture && user.displayPicture.trim() !== "") || (image && image.trim() !== "")) && (
                            <div className="absolute inset-0 cursor-pointer transition-all bg-gray-700">
                                <Image src={image || data.displayPicture} alt="Selected file" layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
                            </div>
                        )}
                        <input type="file" name="displayPicture" id="displayPicture" disabled={updatingProfile || uploadingFile} accept="image/*" onChange={handleImgUpload} className="disabled:cursor-not-allowed hidden absolute inset-0" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 justify-between w-full h-full">
                    <div className="flex items-center gap-3">
                        <p className="p-2 rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800 disabled:bg-gray-800/50 w-1/2">
                            {user.firstName}
                        </p>
                        <p className="p-2 rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800 disabled:bg-gray-800/50 w-1/2">
                            {user.lastName} 
                        </p>
                    </div>
                    <input type="text" name="userName" placeholder="Username" disabled={updatingProfile} onChange={handleData} value={data.userName} className="p-2 disabled:cursor-not-allowed rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
                    <textarea name="description" onChange={handleData} disabled={updatingProfile} maxLength={500} value={data.description} placeholder="Add an optional description" className="p-2 disabled:cursor-not-allowed h-[150px] rounded resize-none border border-transparent focus:border-white transition-all text-sm bg-gray-800"/>
                    <input type="url" name="fbLink" onChange={handleData} disabled={updatingProfile} maxLength={50} value={data.fbLink} placeholder={`https://facebook.com/${user.userName}`} className="p-2 disabled:cursor-not-allowed rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
                    <input type="url" name="ttLink" onChange={handleData} disabled={updatingProfile} maxLength={50} value={data.ttLink} placeholder={`https://twitter.com/${user.userName}`} className="p-2 disabled:cursor-not-allowed rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
                    <input type="url" name="igLink" onChange={handleData} disabled={updatingProfile} maxLength={50} value={data.igLink} placeholder={`https://instagram.com/${user.userName}`} className="p-2 disabled:cursor-not-allowed rounded h-[40px] border border-transparent focus:border-white transition-all text-sm bg-gray-800" />
                </div>
                <button type="submit" disabled={updatingProfile || uploadingFile} className="w-full p-3 disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-900 bg-white text-gray-900 transition-all focus:bg-gray-900 focus:text-white hover:bg-gray-900 hover:text-white active:bg-gray-900 active:text-white font-extrabold text-base uppercase border border-white
                grid place-items-center"
                >
                    {uploadingFile ? (
                        <>Uploading File</>
                    ) : (
                        <>
                            { updatingProfile ? ( <Icon icon="svg-spinners:eclipse-half" className="text-3xl" /> ) : ( <>Update Profile</> )}
                        </>
                    )}
                </button>
            </form>
        </div>
    </div>
  )
}

export default UploadProfile