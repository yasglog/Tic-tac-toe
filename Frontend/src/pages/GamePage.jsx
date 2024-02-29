import React, { useRef,useEffect,useState, useContext } from 'react'

import logo from "../assests/code-sync.png"
import "../App.css"

import User from '../components/User'
import { useNavigate, useParams,useLocation } from 'react-router-dom'
import Game_Modal from '../components/Game_Modal'
import toast from 'react-hot-toast'
import { initSocket } from '../socket'
import { MyContext } from '../context/MyContext'
const GamePage = () => {
  const [Clients,SetClients]=useState([]);
    const reactNavigate=useNavigate('/')
    const socketRef=useRef(null);
    const{roomId}=useParams();
    const location=useLocation();
    const{SetOwner,SetOppountes}=useContext(MyContext);
    useEffect(()=>{
      const init=async()=>{
        socketRef.current=await initSocket();
        socketRef.current.on('connect_error',(err)=>handleErrors(err));
        socketRef.current.on('connect_failed',(err)=>handleErrors(err));
        if(socketRef.current){
          console.log("reference come")
        }
        else{
          console.log("No refernece")
        }
    
        function handleErrors(err){
          console.log('Socket_error',err);
          toast.error("coonection failed try again");
          reactNavigate('/');
        }
  
        socketRef.current.emit('join',{
          roomId:roomId,
          username:location.state?.userName
        })

        //lising the event
        socketRef.current.on('joined',({clients,username,socketId,auther})=>{
          if(username!==auther){
            toast.success("Player 2 joined succesfuuly")
            SetOwner(auther);
            SetOppountes(username);
          }
          console.log("username",username ,"auther",auther)
          SetClients(clients);
        });
        //desconnecting
        socketRef.current.on('disconnected',({socketId,username})=>{
          toast.success(`${username} left the room`);
          SetClients((prev)=>{
            return prev.filter(
              (client)=>client.socketId!=socketId
            );
          })
        })
      }
      init();
      return ()=>{
        socketRef.current.disconnect();
        socketRef.current.off('joined');
        socketRef.current.off('disconnected');
        
      }
    },[])

    async function copyRoomId(){
        try {
          await navigator.clipboard.writeText(roomId);
        toast.success("Room Id Copy Suceessfully")
        } catch (error) {
          toast.error("Something Went Wrong")
        }
     }
  
     function leaveRoom(){
          reactNavigate('/');
     }
  return (
    <div className='mainWrap'>
    <div className='aside'>
      <div className='aside_inner'>
        <div className='logo'>
          <img className='logoImage' src={logo}>

          </img>
        </div>
        <h3 className='connect'>Connected</h3>
        <div className='clientList'>
          {
            Clients.map((client,i)=>(
              <User key={client.socketId} username={client.username}/>
            ))
          }
        </div>
      </div>
      <button className='btn copybtn' onClick={copyRoomId}>Copy ROOM ID</button>
      <button className='btn leavebtn' onClick={leaveRoom}>Leave</button>
    </div> <div className='editorWrap'>
        {/* <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
          codeRef.current=code;
        }}/>  */}
        <Game_Modal socketRef={socketRef} roomId={roomId}/>
      </div>
    </div>
  )
}

export default GamePage
