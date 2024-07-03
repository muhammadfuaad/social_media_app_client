import axios from "axios";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    
    axios.post("http://127.0.0.1:3000/profile", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log("response:", response);
    })
    .catch((error) => {
      console.log("error:", error);
    });
  }, []);

  return (
    <>
      
    </>
  );
}
