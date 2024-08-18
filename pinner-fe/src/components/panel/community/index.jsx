import React, { useEffect, useState } from "react";

// component
import Navbar from "./navbar/Navbar";
import Content from "./content/Content";
import Footer from "./footer/Footer";

// css
import style from "./Index.module.css";

export default function Index() {

  return (
    <div className={style.wrap}>
      <Navbar/>
      <div className={style.content}>
        <Content />
      </div>
      <Footer />
    </div>
  );
}