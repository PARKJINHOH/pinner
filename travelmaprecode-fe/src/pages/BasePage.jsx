import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { HTTPStatus, useAPIv1 } from '../apis/apiv1';
import LoginModal from '../components/modals/LoginModal';
import NewJourneyModal from '../components/modals/NewJourneyModal';
import RegisterModal from '../components/modals/RegisterModal';
import { googleMapState } from '../states/map';
import { NewJourneyStep, newJourneyStepState, newLocationState } from '../states/modal';
import { selectedTravelState } from '../states/travel';

export default function BasePage() {
    const containerStyle = {
        width: '100%',
        height: '100vh',
    };

    const gMap = useRecoilValue(googleMapState);


    const mapOptions = {
        fullscreenControl: false,
    };

    const apiv1 = useAPIv1();
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const setNewLocationState = useSetRecoilState(newLocationState);

    // 선택된 Travel/Journey Id
    /**
     * @type {import('../states/travel').Travel}
     */
    const selectedTravel = useRecoilValue(selectedTravelState);

    return (
        <div>
            <Toaster />
            <RegisterModal />
            <LoginModal />
            {
                // selectedTravel가 undefinded인 상태가 있을 수 있음.
                // 이는 TravelePill에서 setSelected를 사용해 초기화 됨.
                newJourneyStep === NewJourneyStep.EDITTING && <NewJourneyModal travelId={selectedTravel.id} />
            }

            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            >
                {/* https://react-google-maps-api-docs.netlify.app/ */}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    options={mapOptions}
                    zoom={gMap.zoom}
                    center={gMap.center}

                    // 맵 클릭시 위치 정보 획득
                    onClick={async (e) => {
                        const loc = {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                            name: "",
                        };

                        console.log(e.latLng.toString());

                        // Locating 모드일 때만 역 지오코딩 API 요청
                        if (newJourneyStep === NewJourneyStep.LOCATING) {
                            const resp = await apiv1.get(
                                '/geocoding',
                                { params: { lat: loc.lat, lng: loc.lng, reverse: true } }
                            );
                            console.log(resp);


                            if (resp.status === HTTPStatus.NOT_FOUND || resp.status === HTTPStatus.INTERNAL_SERVER_ERROR) {
                                toast.error("지정한 장소의 이름을 가져 올 수 없어요. 직접 입력해 주세요.")
                                setNewJourneyStep(NewJourneyStep.EDITTING);
                            } else {
                                loc.name = resp.data.name;
                            }

                            setNewLocationState(loc);
                            setNewJourneyStep(NewJourneyStep.EDITTING);
                        }
                    }}
                >
                    {selectedTravel && drawMarkers(selectedTravel)}
                    {selectedTravel && drawLine(selectedTravel)}
                </GoogleMap>

            </LoadScript>
        </div>
    );
}

function drawMarkers(selectedTravel) {
    return selectedTravel.journeys.map((journey, index) => {
        return <Marker position={journey.geoLocationDto} key={journey.id} onClick={() => { }} />;
    });
}


function drawLine(selectedTravel) {
    return <Polyline path={selectedTravel.journeys.map((journey, index) => journey.geoLocationDto)} />;
}
