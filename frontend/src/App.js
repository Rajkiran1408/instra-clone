import React from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Login from "./pages/auth/login/Login"
import SignUp from "./pages/auth/signup/SignUp"
import HomePage from './pages/home/HomePage'
import CreatePost from './pages/home/CreatePost'
import SideBar from './components/common/SideBar'
import Posts from './components/common/Posts'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import {Toaster} from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import { baseURL } from './components/constant/url'
import LoadingSpinner from './components/skeletons/LoadindSpinner'

const App = () => {
  const {data:authUser,isLoading}=useQuery({
    queryKey:["authUser"],
    queryFn:async()=>{
      try {
        const res=await fetch(`${baseURL}/api/auth/me`,{
          method:"GET",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          }
        })
        const data=await res.json();
        if(data.error){
          return null
        }
        if(!res.ok){
          throw new Error(data.error || "somethin went wrong") 
        }
        return data
      } catch (error) {
        throw error
      }
    },
    retry:false
  })
  if(isLoading){
    return(
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size="7"/>
      </div>
    )
  }
  return (
    <div className="flex mx-auto max-w-6xl">
      {authUser && <SideBar/>}
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> :<Navigate to="/login"/>}/>
        <Route path='/login' element={!authUser ?<Login/> :<Navigate to="/"/>}/>
        <Route path='/signup' element={!authUser?<SignUp/>:<Navigate to="/"/>}/>
        <Route path='/notifications' element={authUser ?<NotificationPage/>:<Navigate to="/login"/>}/>
        <Route path='/profile/:username' element={authUser?<ProfilePage/>:<Navigate to="/login" />}/>
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
    </div>
    
  )
}

export default App