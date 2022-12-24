import { atom, selector } from "recoil";


/**
 * @typedef {{id: number}} Travel
 * @type {import("recoil").RecoilState<Travel[]>}
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
 * @type {Travel | undefined}
 */
export const selectedTravelState =  selector({
    key: 'selectedTravelState',
    get: ({ get }) => {
        /**
         * @type {Selected}
         */
        const selectedId =  get(selectedTravelIdState);
        /**
         * @type {Travel[]}
         */
        const travels = get(travelState);


        return travels.find(travel => travel.id === selectedId);
    },
});