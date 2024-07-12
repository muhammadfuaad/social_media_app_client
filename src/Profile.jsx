import { Button, notification, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Post from "./Post";
import socket from "./socket";

export default function Profile() {
  const [userPosts, setUserPosts] =useState([])
  const [allPosts, setAllPosts] =useState([])
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('new_comment', (comment) => {
      console.log("comment:", comment);
      console.log("coment added");
    });

    return () => {
      socket.off('new_comment');
    };
  }, []);

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
      setLoading(false)
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
      setLoading(false)
    })
    .catch((error) => {
      console.log("error:", error);
    });
  }, []);

  useEffect(()=>{
    console.log("userPosts:", userPosts);
    console.log("allPosts:", allPosts);
  }, [userPosts, allPosts])

  const addPost = () => {
    navigate("/new_post")
  }

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

  if (loading) {
    return <Spin size="large" gap="middle" />
  } else {
    return (
      <>
        <button onClick={logOut}>Log Out</button>
        <div>
          <p className="text-lg font-bold">Your Posts: {userPosts.length}</p>
          {userPosts.map((post, index)=>{
            return (
              <Post post = {post} key={index} userId = {userId} />
            )
          })}
          <Button type="primary" onClick={addPost}>Add New</Button>
        </div>

        <div>
          <p className="text-lg font-bold">All Posts: {allPosts.length}</p>
          {allPosts.map((post, index)=>{
            return (
              <Post post = {post} key={index} userId = {userId} />
            )
          })}
        </div>
      </>
    );
  }
}