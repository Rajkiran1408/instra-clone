import React from 'react'
import { IoSettingsOutline } from 'react-icons/io5';
import LoadingSpinner from '../../components/skeletons/LoadindSpinner';
import { FaHeart, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {baseURL} from "../../components/constant/url"
import toast from "react-hot-toast"
import { formatPostDate } from '../../utils/date';

const NotificationPage = () => {

    const queryClient=useQueryClient()
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

    const {mutate:deleteNotification}=useMutation({
        mutationFn:async()=>{
            try {
                const res=await fetch(`${baseURL}/api/notifications`,{
                    method:"DELETE",
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
                throw error
            }
        },
        onSuccess:()=>{
            toast.success("all notification deleted")
            queryClient.invalidateQueries({
                queryKey:["notification"]
            })
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })

    const deleteNotifications=()=>{
        deleteNotification()
    }
  return (
    <div className='flex-[4_4_0] border-1 border-r border-gray-700 min-h-screen'>
        <div className='flex justify-between items-center p-4 border-b border-gray-700'>
            <p className='font-bold'>Notifications</p>
            <div className='dropdown'>
                <div tabIndex={0} role='button' className='m-1'>
                    <IoSettingsOutline className='w-4'/>
                </div>
                <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 cursor-pointer'>
                    <li><a onClick={deleteNotifications}>Delete all notification</a></li>
                </ul>
            </div>
        </div>
        {isLoading && (
            <div className='flex justify-center h-full items-center'>
                <LoadingSpinner size="lg"/>
            </div>
        )}
        {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notification😊</div>}
        {notifications?.map((notification)=>(
            <div className='border-b border-gray-700' key={notification._id}>
                <div className='flex gap-2 p-4'>
                    {notification.type==="follow" && <FaUser className='w-7 h-7 text-primary'/>}
                    {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500'/>}
                    <Link to={`/profile/${notification.from.username}`}>
                        <div className='avatar'>
                            <div className='w-fit rounded-full h-8 flex overflow-hidden '>
                                <img className='rounded-full w-8 h-full  object-cover object-top ' src={notification.from.profileImg || "/avatar-placeholder.png"}/>
                                <span className='ml-7 font-bold  text-gray-500'>.{formatPostDate(notification.createdAt)}</span>
                                
                            </div>
                            
                        </div>
                        
                        <div className='flex gap-1'>
                            <span className='font-bold'>@{notification.from.username}</span>{" "}{notification.type === "follow"?"followed you":"liked your post"}
                        </div>
                    </Link>
                    {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-4 "></span>
                    )}
                </div>
            </div>
        ))}
    </div>
  )
}

export default NotificationPage