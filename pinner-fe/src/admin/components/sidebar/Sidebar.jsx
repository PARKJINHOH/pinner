import React from 'react';
import Link from '@mui/material/Link';
import { Link as ReactRouterLink } from 'react-router-dom';

// component

// mui
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StorageIcon from '@mui/icons-material/Storage';
import MailIcon from '@mui/icons-material/Mail';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

// css
import style from './Sidebar.module.css';
import {Box} from "@mui/material";

export default function Sidebar() {

    return (
        <Box className={style.sidebar}>
            <Box className={style.sidebarWrapper}>
                <Box className={style.sidebarMenu}>
                    <h3 className={style.sidebarTitle}>Dashboard</h3>
                    <ul className={style.sidebarList}>
                        <Link component={ReactRouterLink} to="dashboard" className={style.sidebarListItem}>
                            <li>
                                <HomeWorkIcon className={style.sidebarIcon}/>
                                Dashboard
                            </li>
                        </Link>
                        <Link component={ReactRouterLink} to="users">
                            <li className={style.sidebarListItem}>
                                <PeopleAltIcon className={style.sidebarIcon}/>
                                Users
                            </li>
                        </Link>
                        <Link component={ReactRouterLink} to="server_status">
                            <li className={style.sidebarListItem}>
                                <StorageIcon className={style.sidebarIcon}/>
                                Server Status
                            </li>
                        </Link>
                    </ul>

                    <h3 className={style.sidebarTitle}>notifications</h3>
                    <ul className={style.sidebarList}>
                        <li className={style.sidebarListItem}>
                            <MailIcon className={style.sidebarIcon}/>
                            Mail
                        </li>
                        <li className={style.sidebarListItem}>
                            <ReportGmailerrorredIcon className={style.sidebarIcon}/>
                            Reports
                        </li>
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}
