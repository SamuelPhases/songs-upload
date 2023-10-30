"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '@/firebase'
import AuthLayout from "../layout/AuthLayout"



type Props = {}

const Page = (props: Props) => {

  const router = useRouter()

  const socialAuthLogin = [
    {
      color: '',
      icon: 'devicon:google',
      // icon: 'flat-color-icons:google',
      name: 'Google'
    },
    {
      color: '',
      icon: 'devicon:facebook',
      name: 'Facebook'
    },
    {
      color: 'text-white',
      icon: 'devicon:apple',
      name: 'Apple'
    },
    {
      color: 'text-white',
      // icon: 'devicon:phone',
      icon: 'fluent:phone-24-filled',
      name: 'Phone number'
    }
  ]

  const [data, setData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => setData({ ...data, [e.target.name]: e.target.value }) 

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      // console.log({data})
      if (data.email.trim() === "") return toast.error("Email is required")
      if (data.password.trim() === "") return toast.error("Password is required")
      setLoading(true)
      await signInWithEmailAndPassword(auth, data.email, data.password)
      toast.success('Login successfully')
      router.replace('/')
      setLoading(false)
    } catch (error: any) {
      toast.error(error.message)
      console.log({error})
      setLoading(false)
      // console.error('Error:', error.message.split('/')[1].split(')')[0].replaceAll('-',' '));
      // console.error('Error Code:', error.code.split('/')[1].replaceAll('-',' '));
    }
  }


  return (
    <AuthLayout>
      <div className="w-[90%] md:w-4/5 lg:w-3/4 xl:w-1/2 2xl:w-2/5 h-full bg-black rounded py-10 px-10 flex flex-col items-center justify-center gap-10 text-white">
        <h1 className="text-5xl font-black w-3/4 text-center mx-auto">Log in to Songs</h1>
        {/* <div className="grid gap-3 w-3/5 mx-auto">
          {socialAuthLogin.map(({color,icon,name}, index) => (
            <button
              key={index}
              type="button"
              className="rounded-3xl font-medium transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white flex items-center justify-center gap-2 py-2.5 px-7">
                Continue with {name}
            </button>
          ))}
        </div> */}
        {/* <div className="h-[1px] w-full mx-auto bg-gray-300/50"></div> */}
        <form onSubmit={handleSignIn} className="w-3/5 mx-auto grid gap-5">
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-bold">Email address</label>
            <input type="email" id="email" name="email" onChange={handleChange} value={data.email} placeholder="Email address" className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="text-sm font-bold">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} value={data.password} placeholder="Password" className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-3xl font-bold transition-all border-2 border-transparent hover:border-blue-700 focus:border-blue-700 active:border-blue-700 flex items-center justify-center gap-2 py-2.5 px-7 hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-blue-700 focus:text-blue-700 active:text-blue-700
            bg-blue-700 text-white mt-5 disabled:cursor-not-allowed disabled:bg-blue-700 disabled:active:text-white disabled:focus:text-white disabled:hover:text-white"
          >
            { loading ? ( <Icon icon="svg-spinners:eclipse-half" className="text-3xl" /> ) : ( <>Log In</> )}
          </button>
        </form>
        {/* <Link href="/reset-password" className="hover:text-blue-700 focus:text-blue-700 active:text-blue-700 underline hover:no-underline focus:no-underline active:no-underline transition-all font-medium">Forgot your password?</Link> */}
        <div className="h-[1px] w-full mx-auto bg-gray-300/50"></div>
        <div className="flex items-center justify-center flex-wrap gap-2">
          <p className="text-gray-400">Don&apos;t have an account?</p>
          <Link href="/signup" className="hover:text-blue-700 focus:text-blue-700 active:text-blue-700 underline hover:no-underline focus:no-underline active:no-underline transition-all font-medium">Sign up for Songs</Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Page