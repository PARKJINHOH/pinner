import { atom } from "recoil";


// 선택된 travel 데이터를 나타낸다.
// [travel_log_id, travel_id, point_id]
const focusedTravelState = atom({
    key: 'focusedTravelState',
    default: [],
});
