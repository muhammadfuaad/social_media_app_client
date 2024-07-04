import { Button } from "antd";
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

  return (
    <>
      <p className="text-lg font-bold">Your Posts: {userPosts.length}</p>
      {userPosts.map((post)=>{
        return (
          <>
            <p>{post.content}</p>
          </>
        )
      })}
      <Button type="primary" onClick={()=>{navigate("/new_post")}}>Add New</Button>
    </>
  );
}
