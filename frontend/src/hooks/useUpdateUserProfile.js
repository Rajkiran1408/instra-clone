import { useQueryClient,useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { baseURL } from "../components/constant/url"

const useUpdateUserProfile = () => {
    const queryClient=useQueryClient()

  const {mutateAsync:updateProfile,isPending:isUpdatingProfile}=useMutation({
        mutationFn:async(formData)=>{
            try {
                const res=await fetch(`${baseURL}/api/users/update`,{
                    method:"POST",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(formData)
                })
                const data=await res.json()
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong") 
                }
                return data;
            } catch (error) {
                throw error
            }
        },
        onSuccess:(data)=>{
            toast.success("Profile updated successfully")
            Promise.all([
                queryClient.setQueryData(["authUser"], (old) => ({
                ...old,
                ...data,  
                })),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
                queryClient.invalidateQueries({ queryKey: ["posts"] }),
                queryClient.invalidateQueries({ queryKey: ["notifications"] }),
            ])
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })


    return{updateProfile,isUpdatingProfile}
}

export default useUpdateUserProfile