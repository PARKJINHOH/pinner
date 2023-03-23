import React from 'react'
import './Sidebar.css'
import TravelerPill from './TravelerPill'
import TravelListView from './TravelListView'
import { Box, Drawer } from "@mui/material";

const drawerWidth = 280;

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <div className="sidebar d-flex flex-column flex-shrink-0 bg-white">
            <Box sx={{ display: 'flex' }}>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/*사이드바(SideBar) - PC*/}
                    <Drawer
                        variant="permanent"
                        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }}
                        open
                    >
                        <Box sx={{ padding: 2, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                            Travel Map Record
                        </Box>

                        <br />
                        <TravelListView></TravelListView>
                        <TravelerPill></TravelerPill>

                    </Drawer>
                </Box>
            </Box>
        </div >
    )
}
