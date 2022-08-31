import React from 'react'
import './Sidebar.css'
import TravelerPill from './TravelerPill'
import TravelListView from './TravelListView'

export default function Sidebar() {
    return (
        <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-white" style={{ width: 280 + 'px' }}>
            <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                {/* <svg className="bi me-2" width="30" height="24"><use xlink:href="#bootstrap" /></svg> */}
                <span className="fs-5 fw-semibold">Travel Map Record</span>
            </a>
            
            <TravelListView></TravelListView>

            <TravelerPill></TravelerPill>
        </div>
    )
}
