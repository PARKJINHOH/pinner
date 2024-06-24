import React from 'react';

// component

// mui
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";

// css
import style from './Navbar.module.css';
import logo from "assets/images/pinner_logo.png";

export default function Navbar() {

    return (
        <div className={style.wrap}>
            <div className={style.menu}>
                <img
                    src={logo}
                    alt={logo}
                    className={style.logo}
                    loading="lazy"
                />
                <div className={style.menu_item}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>공지사항</Typography>
                </div>
                <div className={style.menu_item}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>커뮤니티</Typography>
                </div>
                <div className={style.menu_item}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>추천 여행사</Typography>
                </div>
                <div className={style.menu_item}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Q&A</Typography>
                </div>
            </div>
            <Divider/>
        </div>
    );
}
