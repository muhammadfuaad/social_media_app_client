import axios from "axios";
import { useNavigate } from "react-router";
import { Dropdown, notification } from "antd";
import { useEffect, useState } from "react";
import socket from "./socket";

export default function Post({post, loggedUserId, index}) {
  const navigate = useNavigate()
  const [showInput, setShowInput] = useState(false)
  const [comment, setComment] =useState("")
  const [comments, setComments] =useState([])
  const [showComments, setShowComments] =useState(false)
  const [showSubmit, setShowSubmit] = useState(false)

  const token = localStorage.getItem("token")

  // exctracting post data
  const postId = post._id
  // // console.log(loggedUserId);
  // // console.log(post);
  // console.log(postId);

  // post actions
  const editPost = async(post) => {
    // console.log("post:", post);
    localStorage.setItem("post", JSON.stringify(post))
    navigate("/update_post", {state: post})
  }

  const deletePost = (id) => {
    // console.log(id);
    axios.delete(`http://127.0.0.1:3000/delete_post/${id}`).then((response)=>{
      // console.log(response)
      notification.success({message: response.data.message})
    })
    .catch((error)=>{
      // console.log(error);
      notification.error({message: ""})
    })
  }

  // comment actions 
  const addComment =(postId) => {
    // console.log(postId);
    // console.log(comment);
    axios.post(`http://127.0.0.1:3000/add_comment/${postId}`, {content: comment}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response)=>{console.log(response);})
    .catch((error)=>{console.log(error);})
  }

  const deleteComment =(commentId) => {
    console.log(commentId);
    axios.delete(`http://127.0.0.1:3000/delete_comment/${commentId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response)=>{console.log(response);})
    .catch((error)=>{console.log(error);})
  }

  useEffect(() => {
    socket.on('connect', () => {
      // console.log('Connected to server');
    });

    socket.on('new_comment', (comment) => {
      // console.log("comment:", comment);
      // console.log("coment added");
      // const newComments = comments.push(comment)
      // setComments(newComments)
      setComments((prevComments) => [...prevComments, comment]);
    });

    return () => {
      socket.off('new_comment');
    };
  }, []);

  useEffect(()=>{
    axios.get(`http://127.0.0.1:3000/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response)=>{
      // console.log(response);
      setComments(response.data.data)
      
    })
    .catch((error)=>{console.log(error);})
  }, [])

  // useEffect(()=>{
  //   console.log(comments);
  // }, [comments])

  const handleInput = (e) => {
    if (e.target.value !== 0) {
      setShowSubmit(true)
    }
    setComment(e.target.value)
  }

  const postOptions = [
    {
      key: '1',
      label: (
        <a onClick={()=>{editPost(post)}}>
          Edit
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={()=>{deletePost(post._id)}}>
          Delete
        </a>
      ),
    },
  ]

  return (
    <div key={index}>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="p-5">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <img className="w-12 h-12 mb-3 rounded-full shadow-lg" src="./avatar.svg" alt="Bonnie image"/>
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.userId.name}</h5>
              </a>
            
            </div>
            {loggedUserId == post.userId._id && 
            <Dropdown menu = {{items: postOptions}} placement="bottomLeft"><span className="cursor-pointer h-fit">...</span></Dropdown>}
            
          </div>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.content}</p>
          <span className="text-blue-500 text-sm cursor-pointer" onClick={()=>{setShowComments(!showComments)}}>{comments.length} comments</span>
          
          <div className="flex gap-12 text-gray-600 cursor-pointer">
            <span onClick={()=>{setShowInput(!showInput)}}>Comment</span>
            
            <span onClick={()=>{}}>Like</span>
          </div>
          {showInput &&
            (<div className="flex gap-4 justify-center items-center">
              <img className="w-6 h-6 mb-3 rounded-full shadow-lg" src="./avatar.svg" alt="Bonnie image"/>
              <input className="border-gray-600 border block w-full rounded-3xl p-2" onChange={(e)=>{handleInput(e)}}></input>
              {showSubmit && 
              <button className="bg-blue-600 text-white rounded-3xl text-sm font-bold" onClick={()=>{addComment(post._id)}}>
                Submit
              </button>}
            </div>)
          }
        </div>
      </div>
      {showComments && comments.map((comment) => {
        console.log(comment);
        const commentOptions = [
          {
            key: '1',
            label: (
              <a onClick={()=>{
                // setIsEditComment(true);
                axios.put(`http://127.0.0.1:3000/update_comment/${commentId}`, {content: comment}, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }).then((response)=>{console.log(response);})
                .catch((error)=>{console.log(error);})
              }
                }>
                Edit
              </a>
            ),
          },
          {
            key: '2',
            label: (
              <a onClick={()=>{deleteComment(comment._id)}}>
                Delete
              </a>
            ),
          },
        ]
        return (
          <div key={comment._id} className="flex flex-col gap-2">
            <div className="p-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <img className="w-6 h-6 mb-3 rounded-full shadow-lg" src="./avatar.svg" alt="Bonnie image"/>
                  <a href="#">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{comment.userId.name}</h5>
                  </a>
                </div>
                {loggedUserId == comment.userId._id && 
                <Dropdown menu = {{items: commentOptions}} placement="bottomLeft"><span className="cursor-pointer h-fit">...</span></Dropdown>}
              </div>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{comment.content}</p>

            </div>
            <div className="flex gap-4 text-sm"><span>Like</span>|<span>Reply</span></div>
          </div>
        );
      })}
    </div>
  )
}