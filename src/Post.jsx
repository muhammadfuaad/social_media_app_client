import axios from "axios";
import { useNavigate } from "react-router";
import { notification } from "antd";
import { useState } from "react";

export default function Post({post, userId, index}) {
  const navigate = useNavigate()
  const [showInput, setShowInput] = useState(false)
  const [comment, setComment] =useState("")
  const token = localStorage.getItem("token")

  // exctracting post data
  const postId = post._id
  console.log(postId);

  // post actions
  const editPost = async(post) => {
    console.log("post:", post);
    localStorage.setItem("post", JSON.stringify(post))
    navigate("/update_post", {state: post})
  }

  const deletePost = (id) => {
    console.log(id);
    axios.delete(`http://127.0.0.1:3000/delete_post/${id}`).then((response)=>{
      console.log(response)
      notification.success({message: response.data.message})
    })
    .catch((error)=>{
      console.log(error);
      notification.error({message: ""})
    })
  }

  // comment actions 
  const addComment =(postId) => {
    console.log(postId);
    axios.post(`http://127.0.0.1:3000/add_comment/${postId}`, {content: comment}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response)=>{console.log(response);})
    .catch((error)=>{console.log(error);})
  }

  return (
    <div key={index} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <div className="p-5">
        <div className="flex gap-4">
          <img className="w-12 h-12 mb-3 rounded-full shadow-lg" src="./avatar.svg" alt="Bonnie image"/>
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.userId.name}</h5>
          </a>
        </div>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.content}</p>
        <div className="flex gap-4">
          <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white
            bg-blue-700 rounded-lg" onClick={()=>{setShowInput(!showInput)}}
          >
            Comment
          </a>
          
          {userId == post.user_id && 
            <>
              <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white
                bg-blue-700 rounded-lg"
                onClick={()=>{editPost(post)}}
              >
                Edit
              </a>
              <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white
                bg-red-700 rounded-lg"
                onClick={()=>{deletePost(post._id)}}
              >
                Delete
              </a>
            </>
          }
        </div>
        {showInput && 
          (<div className="flex">
            <input className="rounded border-black border block w-full" onChange={(e)=>{setComment(e.target.value)}}></input>
            <button className="bg-blue-600 text-white" onClick={()=>{addComment(post._id)}}>Submit</button>
          </div>)
        }
      </div>
    </div>
  )
}