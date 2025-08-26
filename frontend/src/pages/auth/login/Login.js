import React, { useState } from 'react'

import instralogo from "../../../image/Instagram-Logo.wine.svg"

import { FaUserCircle,FaLock } from 'react-icons/fa'

import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { baseURL } from '../../../components/constant/url'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../components/skeletons/LoadindSpinner'

const Login = () => {
  const [formData,setFormData]=useState({
    username:"",
    password:""
  })

  const queryClient = useQueryClient();


  const {mutate:login,isPending,isError,error}=useMutation({
    mutationFn:async ({username,password})=>{
      try {
        const res=await fetch(`${baseURL}/api/auth/login`,{
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({username,password})
        })

        const data=await res.json();
        if(!res.ok){
          throw new Error(data.error||"Something went wrong")
        }
      } catch (error) {
        throw error
      }
    },
    onSuccess:()=>{
    toast("✅Login successfully")
    queryClient.invalidateQueries({
      queryKey:["authUser"]
    })
   }
  })
  const handleSubmit=(e)=>{
    e.preventDefault();
    login(formData)
    
  }
  const handleInputChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  return (
    <div className='flex mx-auto h-screen max-w-screen-x1 bg-white justify-center items-center flex-col'>
      <div className='bg-white shadow-lg p-7 '>
          <img className='w-40 mx-auto h-20' src={instralogo}/>
        <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
          
           <div className="flex items-center border p-2 rounded-md focus-within:ring-2 focus-within:ring-gray-200">
            <FaUserCircle className="text-gray-500 mr-2" />
            <input
                type="text"
                className="outline-none flex-1 text-xl"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
            />
          </div>
          <div className='flex items-center border p-2 rounded-md focus-within:ring-2 focus-within:ring-gray-200'>
            <FaLock className='text-gray-500 mr-2'/>
            <input 
              type='password'
              className='outline-none flex-1 text-xl'
              placeholder='Password'
              name='password'
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>
           <button type='submit' className='bg-blue-400 text-white font-bold p-1'>{isPending?<LoadingSpinner size="5"/>:"Login"}</button>
           {isError && <p className='text-red-500'>{error.message}</p>}

           <button className='text-blue-300 text-center'>Forgot Password?</button>
        </form>
      </div>
      <div className='bg-white shadow-lg p-6 mt-7 flex'>
        <p className='text-xl'>Don't have an account?</p>
        <Link to="/signup">
          <button className="text-blue-400 ml-2">Sign up</button>
        </Link>
        
      </div>
    </div>
  )
}

export default Login