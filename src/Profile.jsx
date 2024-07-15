import { Button, notification, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Post from "./Post";

export default function Profile() {
  const [userPosts, setUserPosts] =useState([])
  const [allPosts, setAllPosts] =useState([])
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("token:", token);
    
    axios.get("http://127.0.0.1:3000/user_posts", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log("response:", response);
      setUserPosts(response.data.data)
      console.log("response.data.userId:", response.data.userId);
      console.log("typeof response.data.userId:", typeof response.data.userId);
      // setUserId(response.data.userId)
      // question: why isn;t this working?
      const id = response.data.userId
      setUserId(id)
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
    console.log("userId:", userId);
  }, [userPosts, allPosts, userId])

  const addPost = () => {
    navigate("/new_post")
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