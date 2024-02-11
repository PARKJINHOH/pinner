import React from 'react';

// component
import logo from 'assets/images/pinner_logo.png';

// mui
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// css
import style from './Topbar.module.css';
import Link from "@mui/material/Link";
import {Stack, IconButton, Typography, Button, Box} from "@mui/material";

export default function Topbar() {

    return (
        <div className={style.topbar}>
            <div className={style.topbarWrapper}>
                <div className={style.topLeft}>
                    <Link className={style.logo_group} href="/admin/dashboard" underline="none">
                        <img
                            src={logo}
                            alt={logo}
                            className={style.logo_img}
                            loading="lazy"
                        />
                        <Typography className={style.logo_font} variant="h5">pinner admin</Typography>
                    </Link>
                </div>
                <div className={style.topRight}>
                    <IconButton className={style.topbarIconContainer}>
                        <NotificationsNoneOutlinedIcon/>
                        <span className={style.topIconBadge}>2</span>
                    </IconButton>
                    <Box className={style.topAvatarContainer}>
                        <img
                            src={logo}
                            alt=""
                            className={style.topAvatar}
                        />
                        <IconButton>
                            <SettingsOutlinedIcon className={style.settingIcon}/>
                        </IconButton>
                    </Box>

                </div>
            </div>
        </div>
    );
}
