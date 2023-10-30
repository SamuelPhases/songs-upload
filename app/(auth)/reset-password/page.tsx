import React from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'


import AuthLayout from '../layout/AuthLayout'



type Props = {}

const page = (props: Props) => {


  return (
    <AuthLayout>
      <div className="w-[90%] md:w-4/5 lg:w-3/4 xl:w-1/2 2xl:w-[45%] h-full bg-black rounded py-10 px-10 flex flex-col items-center justify-center gap-10 text-white">
        <h1 className="text-5xl font-black w-3/4 text-center mx-auto">Password Reset</h1>
        <p className="w-3/5 mx-auto text-center">
          Enter the <strong>email address</strong> that you used to register. We&apos;ll send you an email with your username and a link to reset your password.
        </p>
        <form action="" className="w-3/5 mx-auto grid gap-5">
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-bold">Email address</label>
            <input type="email" id="email" name="email" placeholder="Email address" className="bg-gray-900/50 text-sm transition-all border border-gray-300/50 hover:border-white focus:border-white active:border-white rounded-md p-3" />
          </div>
          <button
              type="button"
              className="rounded-3xl font-bold transition-all border-2 border-transparent hover:border-blue-700 focus:border-blue-700 active:border-blue-700 flex items-center justify-center gap-2 py-2.5 px-7 hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-blue-700 focus:text-blue-700 active:text-blue-700
              bg-blue-700 text-black mt-5">
                Send
            </button>
        </form>
        {/* <div className="h-[1px] w-full mx-auto bg-gray-300/50"></div>
        <div className="flex items-center justify-center flex-wrap gap-2">
          <p className="text-gray-400">If you still need help, check out</p>
          <Link href="/login" className="hover:text-blue-700 focus:text-blue-700 active:text-blue-700 underline hover:no-underline focus:no-underline active:no-underline transition-all font-medium">Songs Support</Link>
        </div> */}
      </div>
    </AuthLayout>
  )
}

export default page