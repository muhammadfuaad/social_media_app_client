import { Button, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Profile() {
  const [userPosts, setUserPosts] =useState([])
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
      setUserPosts(response.data)
    })
    .catch((error) => {
      console.log("error:", error);
    });
  }, []);

  const editComment = (post) => {
    navigate("/update_post", {state: post})
  }

  const deleteComment = (id) => {
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
  return (
    <>
      <p className="text-lg font-bold">Your Posts: {userPosts.length}</p>
      {userPosts.map((post, index)=>{
        const {_id} = post
        return (
          <div className="flex gap-12" key={index}>
            <p>
              {index}{post.content}
              <span className="text-blue-600 cursor-pointer" onClick={()=>{editComment(post)}}>Edit</span>
              <span className="text-red-600 cursor-pointer" onClick={()=>{deleteComment(_id)}}>Delete</span>
            </p>
          </div>
        )
      })}
      <Button type="primary" onClick={()=>{navigate("/new_post")}}>Add New</Button>
    </>
  );
}
