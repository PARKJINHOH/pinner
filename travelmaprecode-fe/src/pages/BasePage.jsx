import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useMemo } from 'react';

import LoginModal from '../components/modals/LoginModal';
import NewJourneyModal from '../components/modals/NewJourneyModal';
import RegisterModal from '../components/modals/RegisterModal';


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

    return (
        <div>
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
                >
                    { /* Child components, such as markers, info windows, etc. */}
                </GoogleMap>

            </LoadScript>
        </div>
    );
}
