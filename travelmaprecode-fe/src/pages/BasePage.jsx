import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { HTTPStatus, useAPIv1 } from '../apis/apiv1';
import LoginModal from '../components/modals/LoginModal';
import NewJourneyModal from '../components/modals/NewJourneyModal';
import RegisterModal from '../components/modals/RegisterModal';
import { NewJourneyStep, newJourneyStepState, newLocationState } from '../states/modal';

export default function BasePage() {
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

    const apiv1 = useAPIv1();
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const setNewLocationState = useSetRecoilState(newLocationState);

    return (
        <div>
            <Toaster />
            <RegisterModal />
            <LoginModal />
            <NewJourneyModal />

            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            >
                {/* https://react-google-maps-api-docs.netlify.app/ */}
                <GoogleMap
                    zoom={10}
                    mapContainerStyle={containerStyle}
                    center={center}
                    options={mapOptions}

                    // 맵 클릭시 위치 정보 획득
                    onClick={async (e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();

                        console.log(e.latLng.toString());

                        // Locating 모드일 때만 역 지오코딩 API 요청
                        if (newJourneyStep === NewJourneyStep.LOCATING) {
                            const resp = await apiv1.get('/geocoding', { params: { lat, lng, reverse: true } });
                            console.log(resp);

                            if (resp.status === HTTPStatus.NOT_FOUND || resp.status === HTTPStatus.INTERNAL_SERVER_ERROR) {
                                toast.error("지정한 장소의 이름을 가져 올 수 없어요. 직접 입력해 주세요.")
                                setNewJourneyStep(NewJourneyStep.EDITTING);
                                return;
                            }

                            const name = resp.data.name;
                            setNewLocationState({ lat, lng, name });
                            setNewJourneyStep(NewJourneyStep.EDITTING);
                        }
                    }}
                >
                    { /* Child components, such as markers, info windows, etc. */}
                </GoogleMap>

            </LoadScript>
        </div>
    );
}
