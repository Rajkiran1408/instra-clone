import React, { useState } from 'react'
import instralogo from "../../../image/Instagram-Logo.wine.svg"
import { Link } from 'react-router-dom'
import { FaUser,FaLock,FaUserCircle } from 'react-icons/fa'
import {MdEmail} from 'react-icons/md'
import {useMutation} from '@tanstack/react-query'
import {baseURL} from "../../../components/constant/url"
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../components/skeletons/LoadindSpinner'

const SignUp = () => {
  const [formData,setFormData]=useState({
    email:"",
    username:"",
    fullName:"",
    password:""
  })

  const {mutate:signUp,isPending,isError,error} = useMutation({
   mutationFn:async({email,username,fullName,password})=>{
    try {
      const res=await fetch(`${baseURL}/api/auth/signup`,{
        method:"POST", 
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body:JSON.stringify({email,username,fullName,password})
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
    toast("✅User created successfully")
   }
  });

  const handleSubmit=(e)=>{
    e.preventDefault();
    signUp(formData)
  }
  const handleInputChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }


  return (
    <div className='flex mx-auto h-screen max-w-screen-x1 bg-white justify-center items-center flex-col'>
      <div className='bg-white shadow-lg p-7 '>
          <img className='w-40 mx-auto h-20' src={instralogo}/>
        <form className='flex flex-col gap-3' onSubmit={handleSubmit} >
            <div className="flex items-center border p-2 rounded-md focus-within:ring-2 focus-within:ring-gray-200">
            <MdEmail className='text-gray-500 mr-2'/>
            <input
                type="email"
                className="outline-none flex-1 text-xl"
                placeholder="Email" 
                name='email'
                onChange={handleInputChange} 
                value={formData.email}
            />
          </div>

          <div className="flex items-center border p-2 rounded-md focus-within:ring-2 focus-within:ring-gray-200">
           <FaUser className='text-gray-500 mr-2'/>
            <input
                type="text"
                className="outline-none flex-1 text-xl"
                placeholder="Fullname"
                name='fullName'
                onChange={handleInputChange}
                value={formData.fullName}
            />
          </div>
          
           <div className="flex items-center border p-2 rounded-md focus-within:ring-2 focus-within:ring-gray-200">
           <FaUserCircle className='text-gray-500 mr-2'/>
            <input
                type="text"
                className="outline-none flex-1 text-xl"
                placeholder="Username"
                name='username'
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
           <button type='submit' className='bg-blue-400 text-white font-bold p-1'>{isPending?<LoadingSpinner size="5"/>:"Sign Up"}</button>
           {isError && <p className='text-red-500'>{error.message}</p>}
            <div className='bg-white flex'>
                <p className='text-md'>Already i have an account?</p>
                <Link to="/login">
                    <button className="text-blue-400 ml-2">Log in</button>
                </Link>   
            </div>
        </form>
      </div>
      
    </div>
  )
}

export default SignUp