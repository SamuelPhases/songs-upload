"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"
import { onAuthStateChanged } from "firebase/auth"
import { useRecoilState } from "recoil"

import { auth, db } from "@/firebase"
import { loggedInUser } from "@/app/state/atoms"
import Nav from "../components/Nav"
import { doc, getDoc } from "firebase/firestore"


interface AuthLayoutProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}


const AuthLayout = ({children, ...props}: AuthLayoutProps) => {

  const router = useRouter()
  const [user, setUser] = useRecoilState(loggedInUser)

  // // useEffect(() => {
  // //   onAuthStateChanged(auth, async (user) => {
  // //     if (user) {
  // //       // User is signed in, see docs for a list of available properties
  // //       // https://firebase.google.com/docs/reference/js/auth.user
  // //       const uid = user.uid;
  // //       // ...
  // //       const data = await getDoc(doc(db, "users", uid))
  // //       if (data.exists()) {
  // //         console.log("Document data:", data.data());
  // //       } else {
  // //         // docSnap.data() will be undefined in this case
  // //         console.log("No such document!");
  // //       }
  // //       // console.log({data})
  // //       setUser(user)
  // //     } else {
  // //       setUser(null)
  // //       // User is signed out
  // //       // ...
  // //     }
  // //   })
  // // },[setUser])

  // console.log({user})

  // useEffect(() => {
  //   const checkUser = () => {
  //     onAuthStateChanged(auth, async (user) => {
  //       if (user) {
  //         // User is signed in, see docs for a list of available properties
  //         // https://firebase.google.com/docs/reference/js/auth.user
  //         const uid = user.uid;
  //         // ...
  //         const data = await getDoc(doc(db, "users", uid))
  //         if (data.exists()) {
  //           console.log("Document data:", data.data());
  //         } else {
  //           // docSnap.data() will be undefined in this case
  //           console.log("No such document!");
  //         }
  //         // console.log({data})
  //         setUser(user)
  //       } else {
  //         setUser(null)
  //         // User is signed out
  //         // ...
  //       }
  //     })
  //     // 
  //     onAuthStateChanged(auth, async (user) => {
  //       if (user) {
  //         // User is signed in, see docs for a list of available properties
  //         // https://firebase.google.com/docs/reference/js/auth.user
  //         const uid = user.uid;
  //         // ...
  //         const docRef = doc(db, "users", uid);
  //         const data = await getDoc(docRef)
  //         if (data.exists()) {
  //           console.log("Document data:", data.data());
  //         } else {
  //           // docSnap.data() will be undefined in this case
  //           console.log("No such document!");
  //         }
  //         // console.log({data})
  //         setUser(user)
  //       } else {
  //         setUser(null)
  //         // User is signed out
  //         // ...
  //       }
  //     });
  //   }
  //   checkUser()
  //   // return () => checkUser()
  // },[])

  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])



  if (!isClient) return null



  return (
    <>
      <Toaster/>
      <div className="h-screen w-full overflow-y-auto bg-gray-900">
          <Nav/>
          <div className="py-10 flex items-center justify-center">
            {/* <Auth
            /> */}
            {children}
          </div>
      </div>
    </>
  )
}

export default AuthLayout