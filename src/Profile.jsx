import { Button, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Profile() {
  const [userPosts, setUserPosts] =useState([])
  const [allPosts, setAllPosts] =useState([])
  const [userId, setUserId] = useState("")

  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    
    axios.get("http://127.0.0.1:3000/user_posts", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log("response:", response);
      setUserPosts(response.data.data)
      setUserId(response.data.user_id)
    })
    .catch((error) => {
      console.log("error:", error);
    });

    axios.get("http://127.0.0.1:3000/all_posts", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log("response:", response);
      setAllPosts(response.data)
    })
    .catch((error) => {
      console.log("error:", error);
    });

  }, []);

  useEffect(()=>{
    console.log("userPosts:", userPosts);
    console.log("allPosts:", allPosts);

  }, [userPosts, allPosts])

  const editPost = (post) => {
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

  const logOut = () => {
    localStorage.clear()
    notification.success({message: "Logged Out Successfully"})
    navigate("/login")
  }
  return (
    <>
    <button onClick={logOut}>Log Out</button>
      <div>
        <p className="text-lg font-bold">Your Posts: {userPosts.length}</p>
        {userPosts.map((post, index)=>{
          const {_id} = post
          return (
            <div className="flex gap-12" key={index}>
              <p>
                {post.content}<span className="text-gray-400">{post.user_name}</span>
                <span className="text-blue-600 cursor-pointer" onClick={()=>{editPost(post)}}>Edit</span>
                <span className="text-red-600 cursor-pointer" onClick={()=>{deletePost(_id)}}>Delete</span>
              </p>
            </div>
          )
        
        })}
        <Button type="primary" onClick={()=>{navigate("/new_post")}}>Add New</Button>
      </div>

      <div>
        <p className="text-lg font-bold">All Posts: {allPosts.length}</p>
        {allPosts.map((post, index)=>{
          const {_id} = post
          return (

          <div key={index} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
            <div className="p-5">
              <div className="flex gap-4">
                <img className="w-12 h-12 mb-3 rounded-full shadow-lg" src="./avatar.svg" alt="Bonnie image"/>
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.user_name}</h5>
                </a>
              </div>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.content}</p>
              <div className="flex gap-4">
                <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white
                  bg-blue-700 rounded-lg"
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
                      onClick={()=>{deletePost(_id)}}
                    >
                      Delete
                    </a>
                  </>
                }
              </div>
            </div>
          </div>


             
          )
        })}

        



      </div>
    </>
  );
}
