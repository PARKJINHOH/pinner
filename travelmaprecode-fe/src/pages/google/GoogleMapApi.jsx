import React from 'react';
import {useMemo} from "react";
import {useRecoilState} from "recoil";
import {GoogleMap, LoadScript} from '@react-google-maps/api';
import {Button} from "react-bootstrap";

import RegisterModal from "../../components/login/RegisterModal";
import LoginModal from "../../components/login/LoginModal";

import './GoogleMapApi.css';

import {registerStatus, showRegisterStatus} from "../../_states/register";
import {loginStatus, showLoginStatus} from "../../_states/login";
import {showLogoutStatus} from "../../_states/logout";

export default function GoogleMapApi() {
    const [registerModalOn, setRegisterModalOn] = useRecoilState(registerStatus);
    const [loginModalOn, setLoginModalOn] = useRecoilState(loginStatus);

    const [showLogin, setShowLogin] = useRecoilState(showLoginStatus);
    const [showRegister, setShowRegister] = useRecoilState(showRegisterStatus);
    const [showLogout, setShowLogout] = useRecoilState(showLogoutStatus);


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

    const onSubmit = () => {
        setShowLogout(false);
        setShowRegister(true);
        setShowLogin(true);
    }



    return (
        <div>
            <RegisterModal
                show={registerModalOn}
                onHide={() => setRegisterModalOn(false)}
            />
            <LoginModal
                show={loginModalOn}
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
                {
                    showLogin ?
                    <Button className="login_btn" variant="primary" onClick={() => setLoginModalOn(true)}>
                        로그인
                    </Button>
                    : null
                }
                {
                    showRegister ?
                    <Button className="register_btn" variant="secondary" onClick={() => setRegisterModalOn(true)}>
                        회원가입
                    </Button>
                    : null
                }
                {
                    showLogout ?
                    <Button className="logout_btn" variant="info" onClick={onSubmit}>
                        로그아웃
                    </Button>
                    : null
                }

            </LoadScript>
        </div>
    );
};