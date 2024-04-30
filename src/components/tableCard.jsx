import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'
import { useAuth } from '../hooks/useAuth'

export const Card = ( { data, onClick}) => {
    let {authUser} = useAuth()
  return (
    <ListItem  onClick={()=>onClick(data)} sx={{display: data.uid === authUser.uid ? "none" : 'flex',}} disablePadding  >
        <ListItemButton>
            <ListItemAvatar>
                <Avatar
                        alt="avatar"
                        src={data.photoURL}
                        />
            </ListItemAvatar>
            <ListItemText id={`checkbox-list-secondary-label-2`} primary={data.displayName} />
        </ListItemButton>
    </ListItem>
  )
}
