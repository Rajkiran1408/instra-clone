import React, { useState } from 'react'
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton'
import { USERS_FOR_RIGHT_PANEL } from '../../utils/db/dummy';
import { Link } from 'react-router-dom';
import {useQuery} from '@tanstack/react-query'
import {baseURL} from "../constant/url"
import useFollow from '../../hooks/useFollow';
import LoadingSpinner from '../skeletons/LoadindSpinner';

const RightPanel = () => {
    const [loadingUserId , setLoadingUserId]=useState(null);
    const {data:suggestedUsers,isLoading}=useQuery({
        queryKey:["suggestedUsers"], 
        queryFn:async()=>{
            try {
                const res=await fetch(`${baseURL}/api/users/suggested`,{
                    method:"GET",
                    credentials:"include",
                    headers:{
                        "Content-type":"application/json"
                    }
                    })
                const data=await res.json()
                if(!res.ok){
                    throw new Error(data.error||"Something went wrong")
                }
                return data
            } catch (error) {
                throw error
            }
        }
    })

    const {follow,isPending}=useFollow()

    if(suggestedUsers?.length==0){
        return (
            <div className='md:w-64 w-0'></div>
        )
    }

    const handleFollow = async (e, userId) => {
		e.preventDefault();
		setLoadingUserId(userId);
		
		
		try {
			 follow(userId); 		
		} catch (error) {
			console.error("Follow error:", error);
		} finally {
			setLoadingUserId(null); 
		}
		
	};
  return (
    <div className='hidden lg:block  my-4 mx-2 ml-0 pl-2 border-l'>
        <div className=' bg-gray-100  p-4 rounded-md sticky top-2'>
            <p className='font-bold'>Who to follow</p>
            <div className='flex flex-col gap-4'>
                {isLoading && (
                    <>
                    <RightPanelSkeleton/>
                    <RightPanelSkeleton/>
                    <RightPanelSkeleton/>
                    <RightPanelSkeleton/>
                    </>
                )}
                {
                    !isLoading && suggestedUsers?.map((user)=>(
                        <Link to={`/profile/${user.username}`} className='flex item-center justify-between gap-4'key={user._id}>
                            <div className='flex gap-2 items-center'>
                                <div className='avatar'>
                                    <div className='w-8 rounded-full overflow-hidden h-8'>
                                        <img className='rounded-full w-full h-full  object-cover object-top' src={user.profileImg || "/avatar-placeholder.png"}/>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-semibold tracking-tight truncate w-28'>{user.fullName}</span>
                                    <span className='text-sm text-slate-500'>@{user.username}</span>
                                </div>
                            </div>
                            <div>
                                <button className='btn bg-blue-500 text-white hover:bg-blue-300 hover:opacity-90 rounded-full p-2 text-sm font-semibold' onClick={(e) =>handleFollow(e,user._id)}
										disabled={loadingUserId===user._id}
                               >{loadingUserId===user._id?<LoadingSpinner size="5"/>:"Follow"}</button>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default RightPanel