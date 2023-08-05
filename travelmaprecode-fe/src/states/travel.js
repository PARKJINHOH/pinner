import { atom, selector } from "recoil";
import { boundsOfTravel } from "utils";


/**
 * @typedef {{id: number}} TravelState
 * @type {import("recoil").RecoilState<TravelState[]>}
 */
export const travelState = atom({
    key: 'travelState',
    default: [],
});

/**
 * @typedef {{travelId:number, journeyId: number}} Selected
 *
 * @type {import("recoil").RecoilState<Selected>}
 */
export const selectedTravelIdState = atom({
    key: 'selectedTravelIdState',
    default: '',
});

/**
 * @type {TravelState | undefined}
 */
export const selectedTravelState = selector({
    key: 'selectedTravelState',
    get: ({ get }) => {
        /**
         * @type {Selected}
         */
        const selectedId = get(selectedTravelIdState);
        /**
         * @type {TravelState[]}
         */
        const travels = get(travelState);


        return travels.find(travel => travel.id === selectedId);
    },
});

/**
 * 선택된 Travel의 bounds
 *
 * 아래 경우에는 null을 반환
 *   - 선택된 여행이 없을 경우
 *   - 선택된 여행에 유효한 지리 정보를 갖는 여정이 하나 이하일 경우
 *     - 유효한 지리 정보는 위경도가 (0, 0)이 아닌것
 *
 * @type {import("recoil").RecoilState<google.maps.LatLngBoundsLiteral?>}
 */
export const selectedTravelBoundsState = selector({
    key: 'selectedTravelBoundsState',
    get: ({ get }) => {
        /** @type {TravelState} */
        const travel = get(selectedTravelState);

        if (!travel) {
            return null;
        }

        return boundsOfTravel(travel);
    },
});