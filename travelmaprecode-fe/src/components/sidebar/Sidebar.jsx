import React, {useState} from 'react'
import './Sidebar.css'
import TravelerPill from './TravelerPill'
import TravelListView from './TravelListView'
import {Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LanguageIcon from "@mui/icons-material/Language";
import {Avatar} from "@mantine/core";


const drawerWidth = 70; // 사이드바 너비
const panelWidth = 280; // 패널 너비

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
    const [selectedDrawer, setSelectedDrawer] = useState(null);

    const handleItemClick = (pageNm) => {
        if (selectedDrawer !== null && selectedDrawer === pageNm) {
            setSelectedDrawer(null);
            return;
        }
        setSelectedDrawer(pageNm);
    };

    return (
        <>
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
                            selected={selectedDrawer === 'main'}
                            sx={listItemButtonStyles}
                            onClick={() => handleItemClick('main')}
                        >
                            <ListItemIcon sx={listItemIconStyles}>
                                <MapIcon sx={{fontSize: 30}}/>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={selectedDrawer === 'TravelListView'}
                            sx={listItemButtonStyles}
                            onClick={() => handleItemClick('TravelListView')}
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
                    <Avatar
                        sx={{width: 56, height: 56,}}
                        onClick={() => handleItemClick('TravelerPill')}
                    />
                </Button>
            </Drawer>

            {/* Panel - TravelerListView */}
            {selectedDrawer === 'TravelListView' && (
                <Paper sx={{
                    width: panelWidth, position: 'absolute',
                    height: '100vh', top: 0, left: drawerWidth, zIndex: '9'
                }}>
                    <TravelListView/>
                </Paper>
            ) }

            {/* Panel - TravelFill */}
            {selectedDrawer === 'TravelerPill' && (
                <Paper sx={{
                    width: panelWidth, position: 'absolute',
                    height: '100vh', top: 0, left: drawerWidth, zIndex: '9'
                }}>
                    <TravelerPill/>
                </Paper>
            ) }

        </>
    )
}
