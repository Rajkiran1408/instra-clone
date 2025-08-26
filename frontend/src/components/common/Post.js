import React, { useState } from 'react'
import { FaRegBookmark, FaRegComment, FaRegHeart,FaHeart, FaTrash } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';
import LoadingSpinner from '../skeletons/LoadindSpinner';
import { BiRepost } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { baseURL } from '../constant/url';
import toast from "react-hot-toast"
import { formatPostDate } from '../../utils/date';

const Post = ({post}) => {
    const [comment,setComment]=useState("");
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    const {data:authUser}=useQuery({queryKey:["authUser"]})
    const queryClient=useQueryClient();
    const {mutate:deletePost,isPending:isDeleteing}=useMutation({
      mutationFn:async()=>{
        try {
          const res=await fetch(`${baseURL}/api/posts/${post._id}`,{
            method:"DELETE",
            credentials:"include",
            headers:{
              "Content-Type":"application/json"
            }
          })
            const data=await res.json();
            if(!res.ok){
              throw new Error(data.error || "Something went wrong")
            }
            return data
            } catch (error) {
              throw error
          }
        
      },
      onSuccess:()=>{
        toast.success("Post deleted successfully")
        queryClient.invalidateQueries({
          queryKey:["posts"]
        })
      }
    })

    
    const { mutate: deleteComment, isPending: isComDeleteing } = useMutation({
  mutationFn: async (commentId) => {
    const res = await fetch(
      `${baseURL}/api/posts/deletecomment/${post._id}/${commentId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    return data; 
  },

  onSuccess: (data) => {
    toast.success("Comment deleted ✅");
    queryClient.invalidateQueries({
          queryKey:["posts"]
        })
  queryClient.setQueryData(["posts"], (oldData) => {
    if (!oldData) return [];
    return oldData.map((p) =>
      p._id === post._id ? { ...p, comments: data } : p
    );
  });
 
    setDeletingCommentId(null);
  },

  onError: (error) => {
    toast.error(error.message);
    setDeletingCommentId(null);
  },
});



//   const { mutate: deleteComment, isPending: isComDeleteing } = useMutation({
//   mutationFn: async (commentId) => {
//     const res = await fetch(
//       `${baseURL}/api/posts/deletecomment/${post._id}/${commentId}`,
//       {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || "Something went wrong");
//     return data;
//   },

//   onSuccess: () => {
//     toast.success("Comment deleted ✅");
//     setDeletingCommentId(null); // reset spinner state
//     queryClient.invalidateQueries({ queryKey: ["posts"] }); // refetch posts
//   },

//   onError: (error) => {
//     toast.error(error.message);
//     setDeletingCommentId(null);
//   },
// });

    

    const { mutate: likePost, isPending: isLiking } = useMutation({
  mutationFn: async () => {
    try {
      const res = await fetch(`${baseURL}/api/posts/like/${post._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data; 
    } catch (error) {
      throw error;
    }
  },


onSuccess: (updatedLikes) => {
  toast.success("Post liked");
  queryClient.invalidateQueries({
          queryKey:["posts"]
        })
  queryClient.setQueryData(["posts"], (oldData) => {
    if (!oldData) return [];
    return oldData.map((p) =>
      p._id === post._id ? { ...p, likes: updatedLikes } : p
    );
  });
},




  onError: (error) => {
    toast.error(error.message);
  },
});

    const {mutate:commentPost,isPending:isCommenting}=useMutation({
      mutationFn:async()=>{
        try {
          const res=await fetch(`${baseURL}/api/posts/comment/${post._id}`,{
            method:"POST",
            credentials:"include",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({text:comment})
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
        toast.success("comment successfully")
        setComment("")
        queryClient.invalidateQueries({queryKey:["posts"]})
      },
      onError:(error)=>{
        toast.error(error.message)
      }
    })

    const postOwner=post.user;
    const isLiked=post.likes?.includes(authUser?._id);

    const isMyPost=authUser?._id===post?.user?._id;
    const formattedDate=formatPostDate(post.createdAt)

    
    // const isMyComment=authUser._id===comment.user._id;
   
   

    const handleDeletePost=()=>{
      
      deletePost();
    };

    const handlePostComment=(e)=>{
        e.preventDefault()
        if(isCommenting) return;
        commentPost()
    }

    const handleLikePost=()=>{
      if(isLiking) return;
      likePost()
    }
    const handleDeleteComment=(commentId)=>{
      setDeletingCommentId(commentId);
      deleteComment(commentId)
    }

  return (
    <>
        <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
          <div className='avatar w-8 rounded-full overflow-hidden h-8'>
            <Link to={`/profile/${postOwner?.username}`} className='w-8 rounded-full overflow-hidden h-8'>
              <img className='rounded-full w-full h-full  object-cover object-top' src={postOwner?.profileImg || "/avatar-placeholder.png"} alt='user avatar'/>
            </Link>
          </div>
          <div className='flex flex-col flex-1'>
            <div className='flex gap-2 items-center'>
              <Link to={`/profile/${postOwner?.username}`} className='font-bold'>
                {postOwner?.fullName}
              </Link>
              <span className='text-gray-700 flex gap-1 text-sm'>
                <Link to={`/profile/${postOwner?.username}`}>
                  @{postOwner?.username}
                </Link>
                <span>.</span>
                <span>{formattedDate}</span>
              </span>
              {isMyPost && (
                <span className='flex justify-end flex-1'>
                  {!isDeleteing && (<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost}/>)}
                  {isDeleteing && (<LoadingSpinner size='5'/>)}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-3 overflow-hidden'>
					    <span>{post.text}</span>
					    {post.img && (
						    <img
							    src={post.img}
							    className='h-80 object-contain rounded-lg border border-gray-700'
							    alt='Post Image'
						    />
					    )}
				    </div>

            <div className='flex justify-between mt-3'>
              <div className='flex gap-4 items-center w-2/3 justify-between'>
                <div className='flex gap-1 items-center cursor-pointer group' onClick={()=>document.getElementById("comments_modal"+post._id)?.showModal()}>
                  <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sk y-400'/>
                  <span className='text-sm text-slate-500 group-hover:text-sk y-400'>
                    {post.comments?.length || 0}
                  </span>
                </div>

                <dialog id={`comments_modal${post._id}`} className='model border-none outline-none w-2/4'>
                  <div className='model-box rounded border border-gray-600 m-10 p-5'>
                    <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                    <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                      {post.comments?.length === 0 && (<p className='text-sm text-slate-500'>No comments yet, Be the first one</p>)}
                      {post.comments?.map((comment)=>(

                          <div key={comment._id} className='flex gap-2 items-start'>
                            <div className='avatar'>
                              <div className='w-8 rounded-full overflow-hidden h-8'>
                                <img className='rounded-full w-full h-full  object-cover object-top' src={comment.user?.profileImg ||"/avatar-placeholder.png"} alt='comment avatar'/>
                              </div>
                            </div>
                            <div className='flex flex-col'>
                              <div className='flex items-center gap-1'>
                                <span className='font-bold'>{comment.user?.fullName}</span>
                                <span className='text-gray-700 text-sm'>@{comment.user?.username}</span>
                                <span>.</span>
                                <span>{formatPostDate(comment.createdAt)}</span> 
                                {comment.user?._id===authUser._id && ( 
                                <span className='flex justify-end flex-1'>
                                  
                                  {isComDeleteing && comment._id===deletingCommentId ? (<LoadingSpinner size='5'/>): (<FaTrash className='cursor-pointer hover:text-red-500' onClick={()=>handleDeleteComment(comment._id)}/>)}
                                </span>
                              )}  
                              </div>
                              <div className='text-sm'>{comment.text}</div>
                              
                            </div>
                          </div>
                          
                      ))}
                      
                    </div>

                    <form className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2' onSubmit={handlePostComment}>
                      <textarea className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800' placeholder='Add a comment...' value={comment} onChange={(e)=>setComment(e.target.value)}>
                      </textarea>
                      <button className='bg-blue-500 rounded-full text-white px-4 py-1'>{isCommenting?(
                        <LoadingSpinner size='5'/>
                      ):(
                        "Add"
                      )}</button>
                    </form>
                  </div>
         
                    <button className='outline-none bg-red-500 m-1' onClick={(e) => e.target.closest("dialog").close()}><IoClose size='20'/></button>
                
                </dialog>
                
                <div className='flex gap-1 items-center group cursor-pointer'>
                  <BiRepost className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
                  <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                </div>

                <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                  {isLiking && <LoadingSpinner size="4"/>}
                  {!isLiked && !isLiking && (
                    <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500'/>
                  )}
                  {isLiked && !isLiking && (
                    <FaHeart className='w-4 h-4 cursor-pointer text-pink-500'/>
                  )}
                  <span className={`text-sm group-hover:text-pink-500 ${isLiked?"text-pink-500":"text-slate-500"}`}>
                    {post.likes?.length || 0}
                  </span>
                </div>

                <div className='flex w-1/4 justify-end gap-2 items-center'>
                  <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer'/>
                </div>

              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Post