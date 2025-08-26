import React, { useEffect } from 'react'
import PostSkeleton from '../skeletons/PostSkeleton'
import { POSTS } from '../../utils/db/dummy';
import Post from './Post';
import {useQuery} from "@tanstack/react-query"
import {baseURL} from "../constant/url"

const Posts = ({feedType,username,userId,onPostCount}) => {

  const getPostUrl=()=>{
    switch(feedType){
    case "posts":
      return `${baseURL}/api/posts/user/${username}`
    case "likes":
      return `${baseURL}/api/posts/likes/${userId}`
    default :
      return `${baseURL}/api/posts/all`;
    }
  }
  
  const {data:posts,isLoading}=useQuery({
    queryKey:["posts",feedType,username,userId],
    queryFn:async()=>{
      try {
        const res=await fetch(getPostUrl(),{
          method:"GET",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          }
        })
        const data=await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something wen wrong")
        }
        return data
      } catch (error) {
        throw error
      }
    }
  })

  useEffect(()=>{
    if(posts && onPostCount){
      onPostCount(posts.length)
    }
  },[posts,onPostCount])
  
  

  return (
    <>
      {isLoading && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton/> 
          <PostSkeleton/>
          <PostSkeleton/>
        </div>
      )}
      {!isLoading && posts?.length === 0 && <p className='text-center my-4'>No Posts in this tab. Switch</p>}

      {!isLoading && posts && (
        <div>
          {posts.map((post,index)=>(
            <Post key={index} post={post}/>
          ))}
        </div>
      )}
    </>
  )
}

export default Posts