import React, {useState} from 'react'
import './Sidebar.css'
import TravelListView from './TravelListView'
import { Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LanguageIcon from "@mui/icons-material/Language";
import Avatar from '@mui/material/Avatar';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useAPIv1} from "../../apis/apiv1";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {isLoggedInState, travelerState, useDoLogout} from "../../states/traveler";
import {AuthModalVisibility, authModalVisibilityState} from "../../states/modal";
import {travelState} from "../../states/travel";


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
    const traveler = useRecoilValue(travelerState);
    const isLoggedIn = useRecoilValue(isLoggedInState);
    const doLogout = useDoLogout();

    const setModalVisibility = useSetRecoilState(authModalVisibilityState);
    function showRegisterModal() {
        travelerClose();
        setModalVisibility(AuthModalVisibility.SHOW_REGISTER);
    }
    function showLoginModal() {
        travelerClose();
        setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
    }
    function logout() {
        travelerClose();
        doLogout();
    }

    // Traveler 메뉴
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const travelerClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const travelerClose = () => {
        setAnchorEl(null);
    };

    // Travel 메뉴
    const [selectedDrawer, setSelectedDrawer] = useState(null);
    const handleItemClick = (pageNm) => {
        if (selectedDrawer !== null && selectedDrawer === pageNm) {
            setSelectedDrawer(null);
            return;
        }
        setSelectedDrawer(pageNm);
    };


    // Avatar 이름에 따른 배경 색상(랜덤)
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    // Avatar 이름에 따른 약자
    function stringAvatar(name) {
        let abbreviation = '';
        if (name) {
            const [firstName, lastName] = (name || '').split(' ');
            if (firstName) abbreviation += firstName[0];
            if (lastName) abbreviation += lastName[0];
        }

        return {
            sx: {
                bgcolor: stringToColor(name),
                width: 50,
                height: 50,
            },
            ...(abbreviation && { children: abbreviation.toUpperCase() }),
        };
    }


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
                    onClick={travelerClick}
                    sx={{marginTop: 'auto'}}
                >
                    <Avatar {...stringAvatar(traveler ? traveler.name : '')} />
                </Button>
            </Drawer>

            {/* Panel - TravelerListView */}
            {selectedDrawer === 'TravelListView' && (
                <Paper sx={{
                    width: panelWidth, position: 'absolute',
                    height: '100vh', top: 0, left: drawerWidth, zIndex: '9',
                    overflow: 'auto', // 스크롤바 추가
                }}>
                    <TravelListView/>
                </Paper>
            )}

            {
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={travelerClose}
                >
                    {
                        isLoggedIn ?
                            [
                                // <MenuItem key="profile" onClick={travelerClose}>내 정보</MenuItem>,
                                <MenuItem key="logout" onClick={logout}>로그아웃</MenuItem>
                            ]
                            :
                            [
                                <MenuItem key="register" onClick={showRegisterModal}>회원가입</MenuItem>,
                                <MenuItem key="login" onClick={showLoginModal}>로그인</MenuItem>
                            ]
                    }
                </Menu>

            }

        </>
    )
}
