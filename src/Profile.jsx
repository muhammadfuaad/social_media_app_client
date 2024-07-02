import axios from "axios"

export default function Profile() {
  const token = localStorage.getItem("token")
  console.log("token:", token);
  axios.post("http://127.0.0.1:3000/profile", token).then((response)=>{console.log("response:", response);})
  .catch((error)=>{console.log("error:", error);})
  return (
    <>

    </>
  )
  
}