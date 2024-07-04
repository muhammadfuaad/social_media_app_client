import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const [userPosts, setUserPosts] =useState([])
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
    </>
  );
}
