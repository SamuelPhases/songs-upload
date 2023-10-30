"use client"

// import { Icon } from "@iconify/react/dist/iconify.js"
import { Icon } from '@iconify/react';
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';


import { auth } from '@/firebase';
import RootLayout from "../layout"
import Card from "../components/Card"
import Nav from "./components/Nav"


type Props = {}

const Page = (props: Props) => {

  const router = useRouter()  
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])



  const newContentTab = ['music','podcast & shows']
  const accountCardList = [
    {
      icon: 'arcticons:songsterr',
      name: 'Manage your plan',
      url: ''
    },
    {
      icon: 'system-uicons:write',
      name: 'Edit profile',
      url: ''
    },
    {
      // icon: 'ri:device-recover-fill',
      icon: 'ic:round-refresh',
      name: 'Recover playlists',
      url: ''
    }
  ]
  const paymentCardList = [
    {
      icon: 'icon-park-solid:transaction-order',
      name: 'Order history',
      url: ''
    },
    {
      icon: 'solar:card-bold',
      name: 'Saved payment cards',
      url: ''
    },
    {
      icon: 'fluent:tag-24-filled',
      name: 'redeem',
      url: ''
    },
  ]
  const privacyList = [
    {
      icon: 'uis:apps',
      name: 'Manage apps',
      url: ''
    },
    {
      icon: 'iconamoon:notification-fill',
      name: 'Notification settings',
      url: ''
    },
    {
      icon: 'material-symbols:privacy-tip-rounded',
      name: 'Privacy settings',
      url: ''
    },
    {
      icon: 'solar:login-3-bold',
      name: 'Login methods',
      url: ''
    },
    {
      icon: 'mdi:password',
      name: 'Set device password',
      url: ''
    },
    {
      icon: 'solar:logout-3-bold',
      name: 'Sign out everywhere',
      url: ''
    },
  ]

  const handlePrivacyList = (name: string) => {
    console.log({name})
    switch (name) {
      case 'Sign out everywhere':
        logout()
        break;
      default:
        break;
    }
  }


  const logout = async () => {
    try {
      await signOut(auth)
      console.log('hello')
      router.replace('/login')
      toast.success('Successfully signed out.')
    } catch (error: any) {
      toast.error(error.message)
    }
  }


  if (!isClient) return null


  return (
    <RootLayout>
      <Nav/>
      <main className="overflow-y-auto py-10 mx-auto w-[90%] md:w-[85%] lg:w-3/4 2xl:w-1/2 2xl:max-w-[800px] flex flex-col gap-7">
        <div className="w-full flex gap-2 h-64">
          <Card className="w-[70%] h-full px-3">
            <button type="button" className="absolute inset-0 bg-transparent before:absolute before:w-0 before:h-0 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#00000030] active:before:w-full focus:before:w-full hover:before:w-full active:before:h-full focus:before:h-full hover:before:h-full group-active:before:w-full group-focus:before:w-full group-hover:before:w-full group-active:before:h-full group-focus:before:h-full group-hover:before:h-full before:origin-center transition-all before:transition-all"></button>
            <div className="flex justify-between flex-col gap-4 h-full z-10">
              <div className="flex justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h6 className="text-white text-xs font-semibold">Your plan</h6>
                  <h2 className="text-gray-400/50 font-bold text-3xl">Songs Free</h2>
                </div>
                <Icon icon="arcticons:songsterr" className="text-3xl text-white" />
              </div>
              <button type="button" className="font-semibold text-white bg-transparent border rounded-xl border-gray-400 transition py-1.5 px-5 w-fit ml-auto text-sm hover:text-gray-900 hover:bg-white focus:text-gray-900 focus:bg-white active:text-gray-900 active:bg-white">Explore plans</button>
            </div>
          </Card>
          <Card className="w-[30%] h-full flex flex-col items-center justify-center gap-2">
            <button type="button" className="absolute inset-0 bg-transparent before:absolute before:w-0 before:h-0 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#00000030] active:before:w-full focus:before:w-full hover:before:w-full active:before:h-full focus:before:h-full hover:before:h-full group-active:before:w-full group-focus:before:w-full group-hover:before:w-full group-active:before:h-full group-focus:before:h-full group-hover:before:h-full before:origin-center transition-all before:transition-all"></button>
            <Icon icon="basil:diamond-outline" className="text-2xl z-10" />
            <h6 className="text-sm font-bold z-10">Join Premium</h6>
          </Card>
        </div>
        <Card className="grid gap-3">
          <h3 className="text-xl font-bold px-3">Account</h3>
          <div className="grid">
            {accountCardList.map(({icon,name,url},index) => (
              <div key={index} className="flex items-center justify-between gap-5 px-3 h-14 relative group/tab rounded-lg overflow-hidden">
                <button type="button" className="p-3 bg-transparent absolute inset-0 rounded-lg before:absolute before:w-0 before:h-0 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#00000030] active:before:w-full focus:before:w-full hover:before:w-full active:before:h-full focus:before:h-full hover:before:h-full group/tab-active:before:w-full group/tab-focus:before:w-full group/tab-hover:before:w-full group/tab-active:before:h-full group/tab-focus:before:h-full group/tab-hover:before:h-full before:origin-center transition-all before:transition-all"></button>
                <div className="flex items-center gap-3 z-10">
                  <div className="w-7 h-7 rounded-lg bg-gray-700/50 flex items-center justify-center">
                    <Icon icon={icon} className="text-xl" />
                  </div>
                  <p>{name}</p>
                </div>
                <button type="button" className="w-7 h-7 z-10 bg-transparent text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center">
                  <Icon icon="fluent:chevron-right-32-filled" className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="grid gap-3">
          <h3 className="text-xl font-bold px-3">Payment</h3>
          <div className="grid">
            {paymentCardList.map(({icon,name,url},index) => (
              <div key={index} className="flex items-center justify-between gap-5 px-3 h-14 relative group/tab rounded-lg overflow-hidden">
                <button type="button" className="p-3 bg-transparent absolute inset-0 rounded-lg before:absolute before:w-0 before:h-0 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#00000030] active:before:w-full focus:before:w-full hover:before:w-full active:before:h-full focus:before:h-full hover:before:h-full group/tab-active:before:w-full group/tab-focus:before:w-full group/tab-hover:before:w-full group/tab-active:before:h-full group/tab-focus:before:h-full group/tab-hover:before:h-full before:origin-center transition-all before:transition-all"></button>
                <div className="flex items-center gap-3 z-10">
                  <div className="w-7 h-7 rounded-lg bg-gray-700/50 flex items-center justify-center">
                    <Icon icon={icon} className="text-xl" />
                  </div>
                  <p>{name}</p>
                </div>
                <button type="button" className="w-7 h-7 z-10 bg-transparent text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center">
                  <Icon icon="fluent:chevron-right-32-filled" className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="grid gap-3">
          <h3 className="text-xl font-bold px-3">Security and Privacy</h3>
          <div className="grid">
            {privacyList.map(({icon,name,url},index) => (
              <div key={index} className="flex items-center justify-between gap-5 px-3 h-14 relative group/tab rounded-lg overflow-hidden">
                <button type="button" onChange={()=>console.log(name)} className="p-3 bg-transparent absolute inset-0 rounded-lg before:absolute before:w-0 before:h-0 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#00000030] active:before:w-full focus:before:w-full hover:before:w-full active:before:h-full focus:before:h-full hover:before:h-full group/tab-active:before:w-full group/tab-focus:before:w-full group/tab-hover:before:w-full group/tab-active:before:h-full group/tab-focus:before:h-full group/tab-hover:before:h-full before:origin-center transition-all before:transition-all"></button>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-700/50 flex items-center justify-center">
                    <Icon icon={icon} className="text-xl" />
                  </div>
                  <p>{name}</p>
                </div>
                <button type="button" onChange={()=>console.log(name)} className="w-7 h-7 z-10 bg-transparent text-gray-400/50 group-focus:text-white transition-all hover:text-white focus:text-white active:text-white flex items-center justify-center">
                  <Icon icon="fluent:chevron-right-32-filled" className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </RootLayout>
  )
}

export default Page