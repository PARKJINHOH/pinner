import React from 'react';
import {useRecoilState} from "recoil";

// component
import {commStateKeys, commState} from "states/community/sidebar";

// mui
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";

// css
import style from './Navbar.module.css';
import logo from "assets/images/pinner_logo.png";

export default function Navbar() {

    const [navbarSelector, setNavbarSelector] = useRecoilState(commState);

    const handleItemClick = (pageNm) => {
        if (navbarSelector !== null && navbarSelector === pageNm) {
            setNavbarSelector(null);
            return;
        }
        setNavbarSelector(pageNm);
    };

    return (
        <div className={style.wrap}>
            <div className={style.menu}>
                <img
                    onClick={() => handleItemClick(commStateKeys.MAIN)}
                    src={logo}
                    alt={logo}
                    className={style.logo}
                    loading="lazy"
                />
                <div className={style.menu_item} onClick={() => handleItemClick(commStateKeys.NOTICE)}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>공지사항</Typography>
                </div>
                <div className={style.menu_item} onClick={() => handleItemClick(commStateKeys.COMMUNITY)}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>커뮤니티</Typography>
                </div>
                <div className={style.menu_item} onClick={() => handleItemClick(commStateKeys.TRAVEL)}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>추천 여행사</Typography>
                </div>
                <div className={style.menu_item} onClick={() => handleItemClick(commStateKeys.QNA)}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Q&A</Typography>
                </div>
            </div>
            <Divider/>
        </div>
    );
}
