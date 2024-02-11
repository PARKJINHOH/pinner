import React from 'react';
import {Link as ReactRouterLink} from 'react-router-dom';
import Link from '@mui/material/Link';

// component

// mui
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StorageIcon from '@mui/icons-material/Storage';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import {Box} from "@mui/material";
import Divider from "@mui/material/Divider";

// css
import style from './Sidebar.module.css';


export default function Sidebar() {
    const [selectedIndex, setSelectedIndex] = React.useState(1);

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
                    <Link component={ReactRouterLink} to="dashboard" onClick={(event) => handleListItemClick(event, 0)}
                          className={style.sidebarListItem} sx={{backgroundColor: selectedIndex === 0 ? '#ede7f6' : 'none'}}>
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
                    기타
                </Typography>
                <List component="nav">
                    <Link component={ReactRouterLink} to="users" onClick={(event) => handleListItemClick(event, 1)}
                          className={style.sidebarListItem} sx={{backgroundColor: selectedIndex === 1 ? '#ede7f6' : 'none'}}>
                        <ListItem>
                            <ListItemDecorator><PeopleAltIcon sx={{height: '20px'}}/></ListItemDecorator>
                            <Typography level="body-sm">Users</Typography>
                        </ListItem>
                    </Link>
                    <Link component={ReactRouterLink} to="server_status" onClick={(event) => handleListItemClick(event, 2)}
                          className={style.sidebarListItem} sx={{backgroundColor: selectedIndex === 2 ? '#ede7f6' : 'none'}}>
                        <ListItem>
                            <ListItemDecorator><StorageIcon sx={{height: '20px'}}/></ListItemDecorator>
                            <Typography level="body-sm">Server Status</Typography>
                        </ListItem>
                    </Link>
                </List>
            </Box>
        </Box>
    );
}
