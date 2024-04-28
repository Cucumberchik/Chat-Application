import { Avatar, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { createMessage } from "../firebase/firestore";
import { db } from "../firebase";
import Send from "@mui/icons-material/Send";

const Dashboard = () => {
  const { authUser } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false);
  console.log(authUser);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshots) => {
      const list = [];
      snapshots.forEach((doc) => {
        const message = doc.data();
        list.push(message);
      });
      setMessages(list.sort((a, b) => a?.date?.seconds - b?.date?.seconds));

    });
    return () => {
      unsubscribe();
    };
  }, []);
  const onSendMessage = async () => {
    if (!message) return;
    try {
      setLoading(true);
      const messageObj = {
        uid: authUser.uid,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        content: message,
        date: serverTimestamp(),
      };
      await createMessage(messageObj);
      setMessage("");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box display='flex' flexDirection='column' height='100vh'>
      <Header />
      <Box display='flex' flex={1}>
       <Box display='flex' sx={{borderRight: "3px solid black"}} flex={1}></Box>
       <Box display='flex'  flex={3} flexDirection="column">
        <Box display="flex"
            flex={1}
            sx={{ background: "green", overflow: "scroll"}}
            flexDirection="column"
            maxHeight="85vh"
            padding={1}>
              {messages.map((message, id) => (
              <Box key={id}
                display="flex"
                gap={1}
                alignItems={"center"}
                boxShadow={1}
                padding={1}
                mb={1}
                sx={{ backgroundColor: "#fff" }}
              >
                <Avatar alt={message?.displayName} src={message?.photoURL} />
                <Typography>{message.content.slice(0, 40)}</Typography>
              </Box>
            ))}

        </Box>
        <Box display='flex' alignItems='center' sx={{borderTop: "3px solid black"}} >
          <TextField value={message} onChange={(e)=>setMessage(e.target.value)} fullWidth id="outlined-basic" label="Outlined" variant="outlined" />
          <Button disabled={loading}
          variant="text" onClick={onSendMessage}> {loading ? <CircularProgress /> : <Send />} </Button>
        </Box>
       </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
