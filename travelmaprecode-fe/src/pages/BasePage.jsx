import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import LoginModal from '../components/modals/LoginModal';
import RegisterModal from '../components/modals/RegisterModal';

import './BasePage.css';

import { ModalVisibility, modalVisibilityState } from '../states/modal';
import { isLoggedInState, useDoLogout } from '../states/traveler';


export default function BasePage() {
    const isLoggedIn = useRecoilValue(isLoggedInState);
    const doLogout = useDoLogout();

    const setModalVisibility = useSetRecoilState(modalVisibilityState);


    const containerStyle = {
        width: '100%',
        height: '100vh',
    };

    const center = useMemo(() => ({
        lat: 37.580283, lng: 126.976641,
    }), []);

    const mapOptions = {
        fullscreenControl: false,
    };

    return (
        <div>
            <RegisterModal />
            <LoginModal />

            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            >
                {/* https://react-google-maps-api-docs.netlify.app/ */}
                <GoogleMap
                    zoom={10}
                    mapContainerStyle={containerStyle}
                    center={center}
                    options={mapOptions}
                >
                    { /* Child components, such as markers, info windows, etc. */}
                </GoogleMap>
                {
                    isLoggedIn
                        ? (
                            <Button className="logout_btn" variant="info" onClick={doLogout}>
                                로그아웃
                            </Button>
                        )
                        : (
                            <>
                                <Button className="login_btn" variant="primary" onClick={() => setModalVisibility(ModalVisibility.SHOW_LOGIN)}>
                                    로그인
                                </Button>
                                <Button className="register_btn" variant="secondary" onClick={() => setModalVisibility(ModalVisibility.SHOW_REGISTER)}>
                                    회원가입
                                </Button>
                            </>
                        )
                }

            </LoadScript>
        </div>
    );
}
