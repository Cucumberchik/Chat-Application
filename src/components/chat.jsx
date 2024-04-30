

import Send from '@mui/icons-material/Send';
import { Avatar, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import {  listUserMessage, sendMessage } from '../firebase/firestore';
import { collection,  onSnapshot } from 'firebase/firestore';
import {  db } from '../firebase';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Chat({ messanger}) {
  let navigate = useNavigate()
  
    let {authUser} = useAuth();
    
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState('')

  
    const onSendMessage = () => {
        if(!message) return;
        const messageObj = {
            displayName: authUser.displayName,
            uid: authUser.uid,
            photoURL: authUser.photoURL,
            contant: message,
            date: new Date()
        }
        sendMessage(authUser.uid, messanger.uid, messageObj, setLoading)
        setMessage('')
    }
    
    const onMessageSnapshot = async () => {
      const docRef = collection(db, "telegram");
  
      const unsubscribe = onSnapshot(docRef, (snapshots) => {
          const list = [];
          snapshots.forEach((doc) => {
            if(doc.id == links) {
            list.push(...doc.data().messages);
          };
          });
          setMessages(list.sort((a, b) => a?.date?.seconds - b?.date?.seconds));
      });
      return ()=> {
        unsubscribe()
      };
  }
  useEffect(()=>{
    listUserMessage(authUser.uid, messanger.uid, setLinks)
    onMessageSnapshot();
    navigate("#end")

  },[messanger, links]);

  useEffect(() => {
    onMessageSnapshot()
    listUserMessage(authUser.uid, messanger.uid, setLinks)
    navigate("#end")
  }, []);
    
  return (
    <Box display='flex'  flex={3} flexDirection="column" >
      <Box display='flex'  position="fixed" sx={{bgcolor: '#222222', width: "100%", p: "10px 15px", zIndex: "100"}}>
      <Typography>{messanger.displayName}</Typography>
      </Box>
        <Box display="flex"
            flex={1}
            sx={{ overflow: "scroll", p: "2em 0"}}
            flexDirection="column"
            maxHeight="85vh"

            >
        
              {messages.length == 0 ? "Здесь пусто" : messages.map((el, id) => {

          if(el.uid !== authUser.uid){
            return <Box key={id} 
            display="flex"
            gap={1}
            flexDirection='column'
            boxShadow={1}
            padding={2}
            mb={1}
            sx={{ bgcolor:  "none", boxShadow: "none" }}
          >
              <Box display="flex" gap={2}>
                <Avatar alt={el?.displayName} src={el?.photoURL} />
                <Typography variant="subtitle1" color="#67A5EB" sx={{cursor:"pointer"}} >{el.displayName}</Typography>
              </Box>
            <Typography sx={{p:"0px 45px"}}>{el.contant}</Typography>
          </Box>
          }
          return <Box key={id} 
          display="flex"
          gap={1}
          flexDirection='column'
          justifyContent='flex-end'
          boxShadow={1}
          padding={2}
          mb={1}
          sx={{ bgcolor:  "none", boxShadow: "none"}}
          >
            <Box display="flex" gap={2}>
              <Avatar alt={el?.displayName} src={el?.photoURL} />
              <Typography variant="subtitle1" color="#67A5EB" sx={{cursor:"pointer"}} >{el.displayName}</Typography>
            </Box>
          <Typography sx={{p:"0px 45px"}}>{el.contant}</Typography>
          
          </Box>
          })}

        </Box>
        <div id="end"></div>
        <Box display='flex' alignItems='center' >
          <TextField  sixe='small' value={message} onChange={(e)=>setMessage(e.target.value)} fullWidth id="outlined-basic" label="Message.." variant="outlined" />
          <Button onClick={onSendMessage} disabled={loading} variant="contained" endIcon={loading ? <CircularProgress /> : <Send />}>
            Send
            </Button>
        </Box>
       </Box>
  )
}
