import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import PostForm from "./PostForm";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new_post" element={<PostForm />} />
        <Route path="/update_post" element={<PostForm />} />

      </Routes>
    </BrowserRouter>
  )
  
}