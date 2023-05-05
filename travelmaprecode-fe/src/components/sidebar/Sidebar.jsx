import React, {useState} from 'react'
import './Sidebar.css'
import TravelerPill from './TravelerPill'
import TravelListView from './TravelListView'
import {Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LanguageIcon from "@mui/icons-material/Language";
import {Avatar} from "@mantine/core";


const drawerWidth = 70; // 사이드바 너비

// Style
const listItemButtonStyles = {
    minHeight: 40, // Icon 간격
    justifyContent: 'center',
    flexDirection: 'column', // 세로 방향으로 표시
};

const listItemIconStyles = {
    justifyContent: 'center',
};

//! Style

export default function Sidebar() {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (index) => {
        if (selectedItem !== null && selectedItem === index) {
            setSelectedItem(null);
            return;
        }
        setSelectedItem(index);
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedItem === 0}
                        sx={listItemButtonStyles}
                        onClick={() => handleItemClick(0)}
                    >
                        <ListItemIcon sx={listItemIconStyles}>
                            <MapIcon sx={{fontSize: 30}}/>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedItem === 1}
                        sx={listItemButtonStyles}
                        onClick={() => handleItemClick(1)}
                    >
                        <ListItemIcon sx={listItemIconStyles}>
                            <LanguageIcon sx={{fontSize: 30}}/>
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="subtitle2" noWrap>
                                    둘러보기
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            </List>
            <Button
                sx={{marginTop: 'auto'}}
            >
                <Avatar sx={{
                    width: 56, height: 56,
                }}/>
            </Button>
        </Drawer>
    )
}
