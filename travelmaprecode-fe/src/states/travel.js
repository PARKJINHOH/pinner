import { atom, selector } from "recoil";


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