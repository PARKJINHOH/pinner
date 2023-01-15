import React from 'react'
import './Sidebar.css'
import TravelerPill from './TravelerPill'
import TravelListView from './TravelListView'
import {Box, Drawer} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 280;

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <div className="sidebar d-flex flex-column flex-shrink-0 bg-white">
            <Box sx={{display: 'flex'}}>
                {/*상단바(TopBar)*/}
                {/*<AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Responsive drawer
                    </Typography>
                </Toolbar>
            </AppBar>*/}


                <Box
                    component="nav"
                    sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{display: {xs: 'block', sm: 'none'}, '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},}}
                    >
                    </Drawer>

                    {/*사이드바(SideBar)*/}
                    <Drawer
                        variant="permanent"
                        sx={{display: {xs: 'none', sm: 'block'}, '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},}}
                        open
                    >
                        <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                            <span className="fs-5 fw-semibold">Travel Map Record</span>
                        </a>

                        <TravelListView></TravelListView>
                        <TravelerPill></TravelerPill>

                    </Drawer>
                </Box>
            </Box>
        </div>
    )
}
