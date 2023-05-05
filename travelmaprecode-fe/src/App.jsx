import './style/globals.css';
import {RecoilRoot} from 'recoil';
import React from 'react';
import BasePage from './pages/BasePage';
import Sidebar from './components/sidebar/Sidebar';

import MapIcon from '@mui/icons-material/Map';
import LanguageIcon from '@mui/icons-material/Language';
import {AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";

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

function App() {
    return (
        <RecoilRoot>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
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
                            <ListItemButton sx={listItemButtonStyles}>
                                <ListItemIcon sx={listItemIconStyles}>
                                    <MapIcon sx={{fontSize: 30}}/>
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={listItemButtonStyles}>
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
                </Drawer>
                <Box
                    sx={{flexGrow: 1}}
                >
                    <BasePage/>
                </Box>
            </Box>

            {/*<Sidebar />*/}
        </RecoilRoot>
    );
}

export default App;
