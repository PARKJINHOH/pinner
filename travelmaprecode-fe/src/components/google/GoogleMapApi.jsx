import React, {useState} from 'react';
import {useMemo} from "react";
import {GoogleMap, LoadScript} from '@react-google-maps/api';

import RegisterModal from "../register/RegisterModal";
import LoginModal from "../login/LoginModal";

import './GoogleMapApi.css';
import {Button} from "react-bootstrap";

export default function GoogleMapApi() {
    const containerStyle = {
        width: '100%',
        height: '100vh'
    };

    const center = useMemo(() => ({
        lat: 37.580283, lng: 126.976641
    }), []);

    const mapOptions = {
        fullscreenControl: false,
    };

    // register
    const [registerModalOn, setRegisterModalOn] = useState(false);
    const [LoginModalOn, setLoginModalOn] = useState(false);

    return (
        <div>
            <RegisterModal
                show={registerModalOn}
                onHide={() => setRegisterModalOn(false)}
            />
            <LoginModal
                show={LoginModalOn}
                onHide={() => setLoginModalOn(false)}
            />

            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                {/*https://react-google-maps-api-docs.netlify.app/*/}
                <GoogleMap
                    zoom={10}
                    mapContainerStyle={containerStyle}
                    center={center}
                    options={mapOptions}>
                    { /* Child components, such as markers, info windows, etc. */}
                </GoogleMap>
                <Button className="login_btn" variant="primary" onClick={() => setLoginModalOn(true)}>
                    로그인
                </Button>
                <Button className="register_btn" variant="secondary" onClick={() => setRegisterModalOn(true)}>
                    회원가입
                </Button>
            </LoadScript>
        </div>
    );
};