import {  Box, Button, List, TextField} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { checkUser, getUsers } from "../firebase/firestore";
import { Search,  } from "@mui/icons-material";
import { Card } from "../components/tableCard";
import { styled } from '@mui/material/styles';

import Chat from "../components/chat";

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
}));

const Dashboard = () => {
  const { authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isChat, setIsChat] = useState(null)

  const openChat = (user) =>{
    setIsChat(user);
  }
  const handleUsersList = () => {
    const userData = {
        displayName : authUser?.displayName,
        email : authUser?.email,
        photoURL : authUser?.photoURL,
        uid : authUser?.uid
      }
    checkUser(userData)
  };
    useEffect(()=>{
        getUsers(setUsers);
        handleUsersList()
    },[]);
   

  return (
    <Box display='flex' flexDirection='column' height='100vh'>
      <Header />
      <Box display='flex' flex={1}>
       <Box display='flex' flex={1} flexDirection='column' sx={{border: "1px solid #00000099"}}>
            <Box display='flex'sx={{p: "10px 0", bgcolor:"#222222"}}  alignItems='center'>
                <TextField fullWidth id="outlined-basic" size="small" label="search.." variant="outlined" />
                <Button size="large" ><Search size="inherit" /></Button>
            </Box>
            <Box  display='flex' flex={3}  sx={{bgcolor: "#f2f2f2"}}>
                <List flex={3} dense sx={{ width: '100%', maxWidth: 360, bgcolor: '#222222', }}>
                    {users.map((el, id)=>(
                    <Card data={el} key={id} onClick={openChat} />
                    ))}
                </List>
            </Box>
       </Box>
       {isChat == null ?  <Box display='flex' flex={4} justifyContent="center" alignItems="center">
        <Div>Open any chat</Div>
       </Box> : 
       <Chat  messanger={isChat} />}
      
       
      </Box>
    </Box>
  );
};

export default Dashboard;
