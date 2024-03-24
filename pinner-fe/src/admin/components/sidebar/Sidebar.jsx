import React from 'react';
import {Link as ReactRouterLink} from 'react-router-dom';
import Link from '@mui/material/Link';

// component

// mui
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StorageIcon from '@mui/icons-material/Storage';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import CampaignIcon from "@mui/icons-material/Campaign";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import {Box} from "@mui/material";
import Divider from "@mui/material/Divider";

// css
import style from './Sidebar.module.css';


export default function Sidebar() {
    const [selectedIndex, setSelectedIndex] = React.useState(null);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <Box className={style.sidebar}>
            <Box className={style.sidebarWrapper}>
                <Typography
                    level="title-sm"
                    fontWeight="lg"
                    mb={1}
                >
                    대시보드
                </Typography>
                <List component="nav">
                    <Link component={ReactRouterLink} to="dashboard" onClick={(event) => handleListItemClick(event, 'dashboard')}
                          className={style.sidebarListItem} sx={{backgroundColor: selectedIndex === 'dashboard' ? '#ede7f6' : 'none'}}>
                        <ListItem>
                            <ListItemDecorator><SpaceDashboardIcon sx={{height: '20px'}}/></ListItemDecorator>
                            <Typography level="body-sm">Dashboard</Typography>
                        </ListItem>
                    </Link>
                </List>
                <Divider/>
            </Box>

            <Box className={style.sidebarWrapper}>
                <Typography
                    level="title-sm"
                    fontWeight="lg"
                    mb={1}
                >
                    공시사항
                </Typography>
                <List component="nav">
                    <Link component={ReactRouterLink} to="notice" onClick={(event) => handleListItemClick(event, 'notice')}
                          className={style.sidebarListItem} sx={{backgroundColor: selectedIndex === 'notice' ? '#ede7f6' : 'none'}}>
                        <ListItem>
                            <ListItemDecorator><CampaignIcon sx={{height: '20px'}}/></ListItemDecorator>
                            <Typography level="body-sm">Notice</Typography>
                        </ListItem>
                    </Link>
                </List>
                <Divider/>
            </Box>

            <Box className={style.sidebarWrapper}>
                <Typography
                    level="title-sm"
                    fontWeight="lg"
                    mb={1}
                >
                    문의
                </Typography>
                <List component="nav">
                    <Link component={ReactRouterLink} to="inquiry" onClick={(event) => handleListItemClick(event, 'inquiry')}
                          className={style.sidebarListItem} sx={{backgroundColor: selectedIndex === 'inquiry' ? '#ede7f6' : 'none'}}>
                        <ListItem>
                            <ListItemDecorator><WarningAmberOutlinedIcon sx={{height: '20px'}}/></ListItemDecorator>
                            <Typography level="body-sm">Inquiry</Typography>
                        </ListItem>
                    </Link>
                </List>
                <Divider/>
            </Box>

            <Box className={style.sidebarWrapper}>
                <Typography
                    level="title-sm"
                    fontWeight="lg"
                    mb={1}
                >
                    기타
                </Typography>
                <List component="nav">
                    <Link component={ReactRouterLink} to="users" onClick={(event) => handleListItemClick(event, 'users')}
                          className={style.sidebarListItem} sx={{backgroundColor: selectedIndex === 'users' ? '#ede7f6' : 'none'}}>
                        <ListItem>
                            <ListItemDecorator><PeopleAltIcon sx={{height: '20px'}}/></ListItemDecorator>
                            <Typography level="body-sm">Users</Typography>
                        </ListItem>
                    </Link>
                    <Link component={ReactRouterLink} target="_blank" to="http://144.24.67.233:3000/login" className={style.sidebarListItem}>
                        <ListItem>
                            <ListItemDecorator><StorageIcon sx={{height: '20px'}}/></ListItemDecorator>
                            <Typography level="body-sm">Grafana</Typography> <OpenInNewOutlinedIcon sx={{fontSize:'15px', marginLeft:'5px'}}/>
                        </ListItem>
                    </Link>
                </List>
            </Box>
        </Box>
    );
}
