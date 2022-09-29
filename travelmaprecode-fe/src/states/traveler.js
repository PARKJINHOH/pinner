import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { clearTraveler, loadTraveler, saveTraveler } from './webstore';


// Load Traveler from Web storage.
// Used to initialize travelerState.
const loadTravelerFromWebStorage = selector({
    key: "loadTravelerFromWebStorage",
    get: ({ get }) => loadTraveler(),
});


export const travelerState = atom({
    key: 'travelerState',
    default: loadTravelerFromWebStorage,
});

export const isLoggedInState = selector({
    key: 'isLoggedInState',
    get: ({ get }) => {
        return get(travelerState) !== null;
    },
});


export function useDoLogout() {
    const [traveler, setTraveler] = useRecoilState(travelerState);

    return function doLogout() {
        const data = {
            refreshToken: traveler.refreshToken,
        };

        // TODO: refresh token 폐기 요청
        // postLogout(data)
        //     .then((response) => {
        //         if (response.status === 200) {
        //             alert(response.data.message);
        //         }
        //     })
        //     .catch((error) => {
        //         alert(error.response.data.message);
        //     });

        setTraveler(null);

        clearTraveler();
    }
}

export function useDoLogin() {
    const setTraveler = useSetRecoilState(travelerState);

    return function doLogin(traveler) {
        setTraveler(traveler);

        saveTraveler(traveler);
    }
}