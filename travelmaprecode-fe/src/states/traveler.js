import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';

const accessTokenKey = "accessToken";
const refreshTokenKey = "refreshToken";


// Load tokens from Local storeage.
// Use to initialize travelerState.
const loadTokensFromsessionStorage = selector({
    key: "loadTokensFromsessionStorage",
    get: ({ get }) => {
        const accessToken = window.sessionStorage.getItem(accessTokenKey);
        const refreshToken = window.sessionStorage.getItem(refreshTokenKey);

        if (accessToken === null || refreshToken === null) {
            // TODO: clean up local storage
            return null;
        }

        return {
            accessToken,
            refreshToken,
        };
    },
})


const travelerState = atom({
    key: 'travelerState',
    default: loadTokensFromsessionStorage,
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

        window.sessionStorage.removeItem(accessTokenKey);
        window.sessionStorage.removeItem(refreshTokenKey);
    }
}

export function useDoLogin() {
    const setTraveler = useSetRecoilState(travelerState);

    return function doLogin(traveler) {
        setTraveler(traveler);

        window.sessionStorage.setItem(accessTokenKey, traveler.accessToken);
        window.sessionStorage.setItem(refreshTokenKey, traveler.refreshToken);
    }
}