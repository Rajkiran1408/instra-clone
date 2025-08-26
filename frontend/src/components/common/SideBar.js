import React from 'react'
import { Link } from 'react-router-dom'
import instralogo from "../../image/Instagram-Logo.wine.svg"
import { MdHomeFilled } from 'react-icons/md'
import { IoNotifications } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {baseURL} from "../constant/url"
import toast from "react-hot-toast"

const SideBar = () => {
  
  const queryClient =useQueryClient();

  const {data:notifications,isLoading}=useQuery({
          queryKey:["notification"],
          queryFn:async()=>{
              try {
                  const res=await fetch(`${baseURL}/api/notifications`,{
                      method:"GET",
                      credentials:"include",
                      headers:{
                          "Content-type":"application/json"
                      }
                  })
                  const data=await res.json();
                  if(!res.ok){
                      throw new Error(data.error || "Something went wrong")
                  }
                  return data;
              } catch (error) {
                  throw error;
              }
          }
      })

  const {mutate:logout}=useMutation({
    mutationFn:async()=>{
      try {
        const res= await fetch(`${baseURL}/api/auth/logout`,{
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          }
        })
        const data=await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
      } catch (error) {
        throw error
      }
    },
    onSuccess:()=>{
      toast.success("Logout success")
      queryClient.invalidateQueries({
        queryKey:['authUser']
      })
    },
    onError:()=>{
      toast.error("Logout unsuccessful")
    }
  })

  const {data:authUser}=useQuery({queryKey:["authUser"]})

  return (
    <div className='md:flex-[2_2_0] w-18 max-w-52'>
      <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
        <Link to='/' className='flex justify-center md:justify-start'>
          <img src={instralogo}/>
        </Link>
        <ul className='flex flex-col gap-3 mt-4'>
          <li className='flex justify-center md:justify-start'>
            <Link to='/' className='flex gap-3 items-center hover:bg-gray-400 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer'>
              <MdHomeFilled className='w-8 h-8'/>
              <span className='text-lg hidden md:block'>Home</span>
            </Link>
          </li>
          <li className='flex justify-center md:justify-start'>
            
            <Link to="/notifications" className='flex gap-3 items-center hover:bg-gray-400 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer' >
              <div className="relative">
                <IoNotifications className="w-6 h-6" />
                {notifications?.some((n) => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
                {notifications?.some((n)=>n.read) && " "}
              </div>
              <span className='text-lg hidden md:block'>Notifications</span>
            </Link>
            
          </li>
          <li className='flex justify-center md:justify-start'>
            <Link to={`/profile/${authUser.username}`} className='flex gap-3 items-center hover:bg-gray-400 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer'>
              <FaUser className='w-6 h-6'/>
              <span className='text-lg hidden md:block'>Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link to={`profile/${authUser.username}`} className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-gray-400 hover:text-white py-2 md:px-4 justify-center  rounded-full w-fit px-0 mx-auto'>
            <div className='avatar hidden md:inline-flex'>
              <div className='w-8 rounded-full overflow-hidden h-8'>
                <img className='w-full h-full object-cover object-top' src={authUser?.profileImg || '/avatar-placeholder.png'} alt='profileImage'/>
              </div>
            </div>
            <div className='flex justify-between flex-1'>
              <div className='hidden md:block'>
                <p className=' font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
                <p className=' text-sm'>@{authUser?.username}</p>
              </div>
            </div>
            <BiLogOut className='w-5 h-5 mr-2 curser-pointer' 
              onClick={(e)=>{
                e.preventDefault();
                logout();
              }}
            />
          </Link>
        )}
      </div>
    </div>
  )
}

export default SideBar