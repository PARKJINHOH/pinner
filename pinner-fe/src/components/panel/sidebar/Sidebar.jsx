import React, {useState} from 'react'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";

// css
import style from './Sidebar.module.css'

// component
import TravelList from 'components/panel/travel/TravelList.jsx'
import {isLoggedInState, travelerState, useDoLogout} from "states/traveler";
import {AuthModalVisibility, authModalVisibilityState} from "states/modal";
import {sidebarWidth} from "states/panel/panelWidth";
import {sidebarStateKeys, sidebarState} from "states/sidebar";

// mui
import { Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Menu, MenuItem} from "@mui/material";

// mui Icon
import MapIcon from "@mui/icons-material/Map";
import LanguageIcon from "@mui/icons-material/Language";
import {Divider} from "@mantine/core";

/**
 * 사이드바(SideBar) 컴포넌트
 * 사이드바 순서 : 지도Icon, 둘러보기
 */
export default function Sidebar() {
    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);

    // Travel 메뉴
    const [sidebarSelector, setSidebarSelector] = useRecoilState(sidebarState);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const traveler = useRecoilValue(travelerState);
    const isLoggedIn = useRecoilValue(isLoggedInState);
    const doLogout = useDoLogout();

    const setModalVisibility = useSetRecoilState(authModalVisibilityState);


    function showRegisterModal() {
        menuClose();
        setModalVisibility(AuthModalVisibility.SHOW_REGISTER);
    }
    function showLoginModal() {
        menuClose();
        setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
    }
    function showProfile() {
        menuClose();
        setModalVisibility(AuthModalVisibility.SHOW_PROFILE);
    }

    function logout() {
        menuClose();
        doLogout();
    }

    const travelerClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const menuClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (pageNm) => {
        if (sidebarSelector !== null && sidebarSelector === pageNm) {
            setSidebarSelector(null);
            return;
        }
        setSidebarSelector(pageNm);
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
                            selected={sidebarSelector === sidebarStateKeys.MAIN}
                            className={style.list_item}
                            onClick={() => handleItemClick(sidebarStateKeys.MAIN)}
                        >
                            <ListItemIcon className={style.list_item_icon}>
                                <MapIcon className={style.icon_size}/>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={sidebarSelector === sidebarStateKeys.TRAVEL}
                            className={style.list_item}
                            onClick={() => handleItemClick(sidebarStateKeys.TRAVEL)}
                        >
                            <ListItemIcon className={style.list_item_icon}>
                                <LanguageIcon className={style.icon_size}/>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" noWrap>
                                        내 여행
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider sx={{marginTop: 'auto'}}/>

                <Button onClick={travelerClick}>
                    <Avatar {...stringAvatar(traveler ? traveler.nickname : '')} />
                </Button>
            </Drawer>


            {
                /* 여행(Travel)목록 리스트 패널 */
                sidebarSelector === sidebarStateKeys.TRAVEL && (<TravelList/>)
            }

            {
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={menuClose}
                >
                    {
                        isLoggedIn ?
                            [
                                <MenuItem key="profile" onClick={showProfile}>내 정보</MenuItem>,
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