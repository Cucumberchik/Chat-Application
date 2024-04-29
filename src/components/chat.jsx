

import Send from '@mui/icons-material/Send';
import { Avatar, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { listUserMessage, senMessage } from '../firebase/firestore';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import {  db } from '../firebase';

export default function Chat({type, messanger}) {
    let {authUser} = useAuth();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listUserMessages, setUserMessages] = useState({});



    

    const onSendMessage = () => {
        if(!message) return;
        const messageObj = {
            displayName: authUser.displayName,
            uid: authUser.uid,
            photoURL: authUser.photoURL,
            contant: message,
            date: new Date()
        }
        senMessage(authUser.uid, messanger.uid, messageObj)
    }
    const fetchData = async () => {


        // if (messageMap) {
        //   const val = doc(db, "user_messanger", messageMap?.communication);
        //   const collectionMessage = collection(val, "messages");
    
        //   const unsubscribe = onSnapshot(collectionMessage, (snapshots) => {
        //     const list = [];
        //     snapshots.forEach((doc) => {
        //       const message = doc.data();
        //       list.push(message);
        //     });
        //     console.log(list);
        //     setMessages(list.sort((a, b) => a?.date?.seconds - b?.date?.seconds));
            
        //   });
        //   return () => {
        //     unsubscribe();
        //   };
        // }
        console.log(listUserMessages);

      };

    useEffect(() => {
        listUserMessage(authUser.uid, messanger?.uid, setUserMessages)
        
          fetchData()
    }, []);
      
      
  return (
    <Box display='flex'  flex={3} flexDirection="column">
        <Box display="flex"
            flex={1}
            sx={{ overflow: "scroll"}}
            flexDirection="column"
            maxHeight="85vh"
            padding={1}>
              {messages.map((el, id) => {

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
                <Typography>{el.content.slice(0, 40)}</Typography>
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
              <Typography>{el.content.slice(0, 40)}</Typography>
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
