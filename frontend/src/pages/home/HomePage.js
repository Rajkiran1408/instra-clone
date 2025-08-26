import React from 'react'
import CreatePost from './CreatePost'
import Posts from '../../components/common/Posts'

const HomePage = () => {
  return (
    <div className='flex-[4_4_0] mr-auto border-r  border-gray-700 min-h-screen'>
        {/* Story option */}

        {/* create post */}
        <CreatePost/>
        {/* Posts */}
        <Posts/> 
    </div>
  )
}

export default HomePage