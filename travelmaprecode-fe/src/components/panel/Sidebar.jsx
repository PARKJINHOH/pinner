import React, {useState} from 'react'
import {useRecoilValue, useSetRecoilState} from "recoil";

// css
import style from './Sidebar.module.css'

// component
import TravelList from './TravelList'
import {isLoggedInState, travelerState, useDoLogout} from "../../states/traveler";
import {AuthModalVisibility, authModalVisibilityState} from "../../states/modal";
import {sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";

// mui
import { Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Menu, MenuItem} from "@mui/material";

// mui Icon
import MapIcon from "@mui/icons-material/Map";
import LanguageIcon from "@mui/icons-material/Language";

/**
 * 사이드바(SideBar) 컴포넌트
 * 사이드바 순서 : 지도Icon, 둘러보기
 */
export default function Sidebar() {
    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);

    // Travel 메뉴
    const [selectedDrawer, setSelectedDrawer] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

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

    const travelerClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const travelerClose = () => {
        setAnchorEl(null);
    };

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
                    width: _sidebarWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: _sidebarWidth,
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
                            className={style.list_item}
                            onClick={() => handleItemClick('main')}
                        >
                            <ListItemIcon className={style.list_item_icon}>
                                <MapIcon className={style.icon_size}/>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={selectedDrawer === 'TravelList'}
                            className={style.list_item}
                            onClick={() => handleItemClick('TravelList')}
                        >
                            <ListItemIcon className={style.list_item_icon}>
                                <LanguageIcon className={style.icon_size}/>
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


            {
                /* 여행(Travel)목록 리스트 패널 */
                selectedDrawer === 'TravelList' && (
                    <TravelList/>
                )
            }

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