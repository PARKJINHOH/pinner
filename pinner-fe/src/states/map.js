import { atom } from "recoil";

export const googleMapState = atom({
    key: 'googleMapState',
    default: {
        zoom: 10,
        center: {lat: 37.580283, lng: 126.976641}
    },
});
