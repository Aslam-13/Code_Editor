import React from 'react'
import './home.css'
import {v4 as uuidv4} from 'uuid'
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
   
 
const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e)=>{
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Created a new room');
  }
  const joinRoom = ()=>{
    if(!roomId || !username){
      toast.error('ROOM ID & username is required');
      return;
    }
      navigate(`/editor/${roomId}`, {
      state: {
        username,
      }
    })
    }
  const handleEnter = (e)=>{
    if(e.code === 'Enter'){
      joinRoom();
    }
  }
  return (
    <>
    <div className="container">
      <div className="contains">
        <div className="main">
          <div className="leftImg">
            <img src="homeImg.png" alt="Not Found" />
          </div>
          <div className="rightName">
            <div className="name">
              <p>Code Club</p>
            </div> 
          </div>
        </div>
        <div className="details">
          <p>Paste invitation ROOM ID</p>
        </div>
        <div className="inputs">
          <input type="text" placeholder='ROOM ID'value={roomId} onChange={(e)=> setRoomId(e.target.value)}/>
          <input type="text" placeholder='USERNAME' onChange={(e)=>{setUsername(e.target.value )}} onKeyUp={handleEnter}/>
        </div>
        <div className="join">
          <button className='btn btnJoin' onClick={joinRoom}>JOIN</button>
        </div>
        <div className="newRoom">
          <p>If you don't have an invite then create <a href="" onClick={createNewRoom}>new room</a></p>
        </div>
       </div>
    </div> 
    </>
    )
}

export default Home