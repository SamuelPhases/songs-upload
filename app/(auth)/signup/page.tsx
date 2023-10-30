"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

import { auth, db } from '@/firebase'
import AuthLayout from '../layout/AuthLayout'

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
    // {
    //   color: 'text-white',
    //   icon: 'devicon:apple',
    //   name: 'Apple'
    // },
    // {
    //   color: 'text-white',
    //   // icon: 'devicon:phone',
    //   icon: 'fluent:phone-24-filled',
    //   name: 'Phone number'
    // }
  ]
  const months = ['January','february','march','april','may','june','july','august','september','october','november','december']
  const [data, setData] = useState({ email: "", password: "", userName: "", firstName: "", lastName: "", dob: "", gender: "" })

  const handleChange = (e: any) => setData({ ...data, [e.target.name]: e.target.value })

  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      // console.log({data})
      if (data.firstName.trim() === "") return toast.error("First name is required")
      if (data.lastName.trim() === "") return toast.error("Last name is required")
      if (data.userName.trim() === "") return toast.error("Username is required")
      if (data.password.trim() === "") return toast.error("Password is required")
      setLoading(true)
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const user = res.user
      // await updateProfile(auth.currentUser, {displayName: data.userName})
      // const verifyEmail = await sendEmailVerification(auth.currentUser)
      await setDoc(doc(db, 'users', user.uid), {
        email: data.email,
        displayPicture: "",
        description: "",
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        gender: data.gender,
        createdAt: user.metadata.creationTime,
        updatedAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime,
        playlistCount: 0,
        id: user.uid,
        songs: [],
        fbLink: "",
        igLink: "",
        ttLink: "",
      })
      await setDoc(doc(db, 'views', user.uid),{history: []})
      await setDoc(doc(db, 'follow', user.uid),{following: [], followers: []})
      toast.success('Account successfully created')
      router.replace('/login')
      setLoading(false)
    } catch (error: any) {
      toast.error(error.message)
      console.log({error})
      setLoading(false)
      // console.error('Error:', error.message.split('/')[1].split(')')[0].replaceAll('-',' '));
      // console.error('Error Code:', error.code.split('/')[1].replaceAll('-',' '));
    }
  };


  return (
    <AuthLayout>
      <div className="w-[90%] md:w-4/5 lg:w-3/4 xl:w-3/5 2xl:w-[45%] h-full bg-black rounded py-10 px-10 flex flex-col items-center justify-center gap-10 text-white">
        <h1 className="text-5xl font-black w-3/4 text-center mx-auto">Sign up for free to start listening.</h1>
        {/* <div className="grid gap-3 w-3/5 mx-auto">
          {socialAuthLogin.map(({color,icon,name}, index) => (
            <button
              key={index}
              type="button"
              className="rounded-3xl font-medium transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white flex items-center justify-center gap-2 py-2.5 px-7">
                Continue with {name}
            </button>
          ))}
        </div>
        <div className="h-[1px] w-full mx-auto bg-gray-300/50"></div> */}
        <form onSubmit={handleSignUp} className="w-3/5 mx-auto grid gap-5">
          <div className="grid gap-1">
            <label htmlFor="userName" className="text-sm font-bold">What should we call you?</label>
            <input type="text" id="userName" name="userName" onChange={handleChange} placeholder="Enter a profile name." className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
            <p className="text-[13px] text-gray-400">This appears on your profile.</p>
          </div>
          <div className="grid gap-1">
            <label htmlFor="lastName" className="text-sm font-bold">Last name</label>
            <input type="text" id="lastName" name="lastName" onChange={handleChange} placeholder="Enter your last name." className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="firstName" className="text-sm font-bold">First name</label>
            <input type="text" id="firstName" name="firstName" onChange={handleChange} placeholder="Enter your first name." className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-bold">What&apos;s your email?</label>
            <input type="email" id="email" name="email" onChange={handleChange} placeholder="Enter your email." className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="text-sm font-bold">Create a password</label>
            <input type="password" id="password" name="password" onChange={handleChange} placeholder="Create a password." className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
          </div>
          {/* <div className="grid gap-1">
            <p className="text-sm font-bold">What&apos;s your date of birth?</p>
            <div className="flex gap-3 w-full">
              <div className="flex flex-col items-start gap-1 w-[25%]">
                <label htmlFor="day">Day</label>
                <input type="number" id="day" name="day" min={1} max={31} placeholder="DD" className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3 w-full" />
              </div>
              <div className="flex flex-col items-start gap-1 w-[50%]">
                <label htmlFor="month">Month</label>
                <select name="month" id="month" className="bg-gray-900/50 capitalize text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3 w-full">
                  <option value="">Month</option>
                  {months.map((month,index) => (
                    <option key={index} value={month} className="p-1.5">{month}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-start gap-1 w-1/4">
                <label htmlFor="year">Year</label>
                <input type="number" id="year" name="year" min={1980} max={2005} placeholder="YYYY" className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3 w-full" />
              </div>
            </div>
          </div> */}
          {/* <div className="grid gap-1">
            <p className="text-sm font-bold">What&apos;s your gender?</p>
            <div className="flex gap-3">
              <div className="flex items-center gap-1 w-1/2">
                <input type="radio" id="male" name="gender" value="male" onChange={handleChange} className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
                <label htmlFor="male">Male</label>
              </div>
              <div className="flex items-center gap-1 w-1/2">
                <input type="radio" id="female" name="gender" value="female" onChange={handleChange} className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div> */}
          <button
              type="submit"
              disabled={loading}
              className="rounded-3xl font-bold transition-all border-2 border-transparent hover:border-blue-700 focus:border-blue-700 active:border-blue-700 flex items-center justify-center gap-2 py-2.5 px-7 hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-blue-700 focus:text-blue-700 active:text-blue-700
              bg-blue-700 text-white mt-5 disabled:cursor-not-allowed disabled:bg-blue-700 disabled:active:text-white disabled:focus:text-white disabled:hover:text-white"
            >
              { loading ? ( <Icon icon="svg-spinners:eclipse-half" className="text-3xl" /> ) : ( <>Sign up</> )}
            </button>
        </form>
        <div className="h-[1px] w-full mx-auto bg-gray-300/50"></div>
        <div className="flex items-center justify-center flex-wrap gap-2">
          <p className="text-gray-400">Have an account?</p>
          <Link href="/login" className="hover:text-blue-700 focus:text-blue-700 active:text-blue-700 underline hover:no-underline focus:no-underline active:no-underline transition-all font-medium">Log in</Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Page