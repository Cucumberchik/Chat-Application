import {  Box, Button, List, TextField} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { getUsers } from "../firebase/firestore";

import Chat from "../components/chat";
import { Search,  } from "@mui/icons-material";
import { Card } from "../components/tableCard";

const Dashboard = () => {
  const { authUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [messanger, setMessanger] = useState(false);
  const handleOpenChat = (user) => {
      setMessanger(user)
    }
    
    useEffect(()=>{
        
        getUsers(setUsers);
    },[]);

  return (
    <Box display='flex' flexDirection='column' height='100vh'>
      <Header />
      <Box display='flex' flex={1}>
       <Box display='flex' flex={1}  sx={{bgcolor: "#f2f2f2"}} flexDirection='column'>
            <Box display='flex'sx={{p: "10px 0"}}  alignItems='center'>
                <TextField fullWidth id="outlined-basic" size="small" label="search.." variant="outlined" />
                <Button size="large" ><Search size="inherit" /></Button>
            </Box>
            <Box display='flex' flex={3}  sx={{bgcolor: "#f2f2f2"}}>
                <List flex={3} dense sx={{ width: '100%', maxWidth: 360, bgcolor: '#f2f2f2' }}>
                    {users.map((el, id)=>(
                    <Card data={el} key={id} onClick={handleOpenChat} />
                    ))}
                </List>
            </Box>
       </Box>
       <Chat type = "DEFAULT" messanger={messanger ? messanger : users[0]} />
      </Box>
    </Box>
  );
};

export default Dashboard;
