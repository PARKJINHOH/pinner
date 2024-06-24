import React, {useState} from 'react'

// component
import Navbar from "./navbar/Navbar";
import Content from "./content/Content";
import Footer from "./footer/Footer";


export default function index() {


    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Navbar/>
            <Content/>
            <Footer/>
        </div>
    )
}