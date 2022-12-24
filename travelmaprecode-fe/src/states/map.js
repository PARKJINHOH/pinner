import { atom } from "recoil";

export const centreOfMapState = atom({
    key: 'centreOfMap',
    default: {lat: 37.580283, lng: 126.976641},
});
