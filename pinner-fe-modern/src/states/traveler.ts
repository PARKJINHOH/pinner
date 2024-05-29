import { postLogout } from '@/apis/auth';
import { Traveler } from '@/apis/types';
import { atom, selector, useSetRecoilState } from 'recoil';
import { clearTraveler, loadTraveler, saveTraveler } from './webstore';

// Load Traveler from Web storage.
// Used to initialize travelerState.
const loadTravelerFromWebStorage = selector({
  key: 'loadTravelerFromWebStorage',
  get: () => loadTraveler(),
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
  const setTraveler = useSetRecoilState(travelerState);

  return function doLogout() {
    const refreshToken = window.sessionStorage.getItem('refreshToken');

    if (refreshToken !== null) {
      postLogout({ refreshToken })
        .then((response) => {
          alert(response.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
    setTraveler(null);
    clearTraveler();
  };
}

export function useDoLogin() {
  const setTraveler = useSetRecoilState(travelerState);

  return function doLogin(traveler: Traveler) {
    setTraveler(traveler);

    saveTraveler(traveler);
  };
}
