import React, { useMemo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Button } from 'react-bootstrap';

import RegisterModal from '../../components/login/RegisterModal';
import LoginModal from '../../components/login/LoginModal';

import './GoogleMapApi.css';
import { loginState, ModalVisibility, modalVisibilityState } from '../../_states/login';
import {postLogout} from "../../apis/api_jwt";

export default function GoogleMapApi() {
    const [isLoggedIn, setLoginState] = useRecoilState(loginState);
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

    const onLogout = async (event) => {
        // Todo : 전역으로 구현하기
        const data = JSON.stringify({
            // email, password, name
        });

        postLogout(data)
            .then((response) => {
                if (response.status === 200) {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    }

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
                            <Button className="logout_btn" variant="info" onClick={() => {
                                setLoginState(false)
                                onLogout()
                            }}>
                                로그아웃
                            </Button>
                        )
                        : (
                            <>
                                <Button className="login_btn" variant="primary" onClick={() => setModalVisibility(ModalVisibility.LOGIN)}>
                                    로그인
                                </Button>
                                <Button className="register_btn" variant="secondary" onClick={() => setModalVisibility(ModalVisibility.REGISTER)}>
                                    회원가입
                                </Button>
                            </>
                        )
                }

            </LoadScript>
        </div>
    );
}
