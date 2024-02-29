import React, { useState } from "react";
// import icon from "../assests/code-sync.png";
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../App.css'

const Home = () => {
  const navigate=useNavigate();
  const[roomId,setRoomId]=useState('');
  const[userName,setUserName]=useState("");
  const createNewRoom=(e)=>{
    e.preventDefault();
    const id=uuidv4();
    setRoomId(id);

    console.log(id)
    toast.success("Room Id Create")

  }
  const handleInputEnter=(e)=>{
        // console.log(e.code)

        if(e.code==='Enter'){
          joinRoom(e);
        }
  }

  const joinRoom=(e)=>{
    e.preventDefault();
    if(!roomId || !userName){
      toast.error("Room Id & UserName is required")
      return;
    }
    navigate(`/gamepage/${roomId}`,{
      state:{
        userName,
      }
    })
  }
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        {/* <img className="homePageLogo" src={icon}></img> */}
        <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
        <div className="inputGroup">
          <input type="text" onChange={(e)=>setRoomId(e.target.value)} value={roomId} className="inputBox"onKeyUp={handleInputEnter} placeholder="ROOM ID" />
          <input type="text" className="inputBox" onChange={(e)=>setUserName(e.target.value)} onKeyUp={handleInputEnter} placeholder="USERNAME" />
          <button className="btn joinBtn" onClick={joinRoom}>Join</button>

          <span className="createInfo">
            It you don't have an invite then create &nbsp;
            <a  href="" className="createNewBtn" onClick={createNewRoom}>
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        Built with 💛&nbsp;by <a href="">Yash Gaikwad</a>
      </footer>
    </div>
  );
};

export default Home;
