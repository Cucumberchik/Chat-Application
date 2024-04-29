

import Send from '@mui/icons-material/Send';
import { Avatar, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { listUserMessage, senMessage } from '../firebase/firestore';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import {  db } from '../firebase';
import { logEvent } from 'firebase/analytics';

export default function Chat({type, messanger}) {
    let {authUser} = useAuth();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listUserMessages, setUserMessages] = useState('');


    const onSendMessage = () => {
        if(!message) return;
        const messageObj = {
            displayName: authUser.displayName,
            uid: authUser.uid,
            photoURL: authUser.photoURL,
            contant: message,
            date: new Date()
        }
        senMessage(authUser.uid, messanger.uid, messageObj, setLoading)
    }
    const onMessageSnapshot = async () => {
      // Создаем ссылку на документ с помощью идентификаторов коллекции и документа из массива links
      const docRef = collection(db, "telegram");
  
      const unsubscribe = onSnapshot(docRef, (snapshots) => {
          const list = [];
          snapshots.forEach((doc) => {
              list.push(...doc.data().messages);
          });
          setMessages(list);
      });
      // .sort((a, b) => a?.date?.seconds - b?.date?.seconds)
      return ()=> {
        unsubscribe()
      };
  }
    useEffect(() => {
      listUserMessage(authUser.uid, messanger.uid, setUserMessages);
      onMessageSnapshot()
    }, []);
      console.log(messages);
      
  return (
    <Box display='flex'  flex={3} flexDirection="column">
        <Box display="flex"
            flex={1}
            sx={{ overflow: "scroll"}}
            flexDirection="column"
            maxHeight="85vh"
            padding={1}>
              {messages.length == 0 ? "Здесь пусто" : messages.map((el, id) => {

          if(el.uid !== authUser.uid){
            return <Box key={id} 
            display="flex"
            gap={1}
            alignItems="center"
            boxShadow={1}
            padding={1}
            mb={2}
            sx={{ backgroundColor:  "#ffffff" }}
          >
            <Avatar alt={el?.displayName} src={el?.photoURL} />
            <Typography>{el.contant}</Typography>
          </Box>
          }
          return <Box key={id} 
          display="flex"
          gap={1}
          alignItems="center"
          justifyContent='flex-end'
          boxShadow={1}
          padding={1}
          mb={2}
          sx={{ backgroundColor:  "#bdd2e6"}}
          >
          <Typography>{el.contant}</Typography>
          <Avatar alt={el?.displayName} src={el?.photoURL} />
          </Box>
          })}

        </Box>
        <div id="end"></div>
        <Box display='flex' alignItems='center' >
          <TextField sixe='small' value={message} onChange={(e)=>setMessage(e.target.value)} fullWidth id="outlined-basic" label="Message.." variant="outlined" />
          <Button onClick={onSendMessage} disabled={loading} variant="contained" endIcon={loading ? <CircularProgress /> : <Send />}>
            Send
            </Button>
        </Box>
       </Box>
  )
}
