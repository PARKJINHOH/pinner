import React from 'react';

// component

// mui
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

// css
import style from './Topbar.module.css';

export default function Topbar() {

    return (
        <div className={style.topbar}>
            <div className={style.topbarWrapper}>
                <div className={style.topLeft}>
                    <span className={style.logo}>pinner</span>
                </div>
                <div className={style.topRight}>
                    <div className={style.topbarIconContainer}>
                        <FlightTakeoffIcon/>
                        <span className={style.topIconBadge}>2</span>
                    </div>
                    <div className={style.topbarIconContainer}>
                        <NotificationsNoneOutlinedIcon/>
                        <span className={style.topIconBadge}>2</span>
                    </div>
                    <img
                        src="assets/images/login_icon_naver.png"
                        alt=""
                        className={style.topAvatar}
                    />
                </div>
            </div>
        </div>
    );
}
