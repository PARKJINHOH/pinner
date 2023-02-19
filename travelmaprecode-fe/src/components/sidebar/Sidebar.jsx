import React from 'react'
import './Sidebar.css'
import TravelerPill from './TravelerPill'
import TravelListView from './TravelListView'
import {AppBar, Box, Drawer, IconButton, Toolbar, Typography} from "@mui/material";
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
                <Box
                    component="nav"
                    sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                    aria-label="mailbox folders"
                >
                    {/*사이드바(SideBar) - PC*/}
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
