import { atom, selector } from "recoil";


/**
 * @type {import("recoil").RecoilState<Travel[]>}
 */
export const travelState = atom({
    key: 'travelState',
    default: [],
});

/**
 * 선택퇸 Travel의 ID 혹은 빈 문자열
 *
 * @type {string}
 */
export const selectedTravelIdState = atom({
    key: 'selectedTravelIdState',
    default: '',
});

/**
 * @type {Travel | undefined}
 */
export const selectedTravelState = selector({
    key: 'selectedTravelState',
    get: ({ get }) => {
        /**
         * @type {Selected}
         */
        const selectedId = get(selectedTravelIdState);
        /**
         * @type {Travel[]}
         */
        const travels = get(travelState);


        return travels.find(travel => travel.id === selectedId);
    },
});