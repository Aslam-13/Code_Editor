import React, { useState , useRef, useEffect} from 'react'
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams ,  } from 'react-router-dom';
import ACTIONS from   '../../Actions'; 
import Client from '../../components/Client/Client';
import Editor from '../../components/Editor/Editor'
import { initSocket } from '../../socket';
import './editorPage.css'
     
const EditorPage = ()=> {
  const [clients, setClients] = useState([]); 
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const codeRef = useRef(null);
  useEffect(()=>{
    const init = async ()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err)=>handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));
      function handleErrors(e){
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later. ')
        reactNavigator('/'); 
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username
         });
          socketRef.current.on(
           ACTIONS.JOINED,
           ({clients, username, socketId})=>{ 
             if(username!==location.state?.username){
               toast.success(`${username} joined the room `)
              }
              setClients(clients);
              socketRef.current.emit(ACTIONS.SYNC_CODE,{
                code: codeRef.current,
                socketId,
              }) 
            }
          )
            socketRef.current.on(
              ACTIONS.DISCONNECTED,
              ({socketId, username})=>{
                toast.success(`${username} left the room`);
                setClients((prev)=>{
                  return prev.filter(
                    (client)=> client.socketId !== socketId
                  )
                })
              }
            )
    };
    init();
  return ()=> {
    socketRef.current.off(ACTIONS.JOINED);
    socketRef.current.off(ACTIONS.DISCONNECTED);
    socketRef.current.disconnect();
    } 
  },  []);
 
  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id has been copied');
    }catch(e){ 
      toast.error("Something went wrong");
    }
  }
  function leaveRoom(){
    reactNavigator('/');
  }
  if(!location.state){
    return <Navigate to="/"/>
  }
  return (
       <>
    <div className="mainwrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/homeImg.png" alt="Not Found" />
             <p>Code Club</p>
          </div>
          <p>Connected</p>
          <div className="clientsList">
            {
              clients.map((cli)=>{
                return <Client key={cli.socketId} username={cli.username}/>
              })
            } 
          </div>
        </div>
        <button className='btn btnCopy' onClick={copyRoomId}>Copy ROOM ID</button>
        <button className='btn btnLeave' onClick={leaveRoom}>Leave</button>
       </div>
       <div className="editorwrap">
          <Editor socketRef={socketRef} roomId= {roomId} onCodeChange={(code)=>{ codeRef.current = code}}/>
       </div>
    </div>
    </> 
   )
}

export default EditorPage