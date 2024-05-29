import { Traveler } from '@/apis/types';

const kAccessToken = 'accessToken';
const kRefreshToken = 'refreshToken';
const kEmail = 'email';
const kNickname = 'nickname';
const kSignupServices = 'signupServices';

function isValidTraveler(traveler: any) {
  const hasText = (s: string | null) => s !== null && s.trim().length !== 0;

  return (
    hasText(traveler.accessToken) &&
    hasText(traveler.refreshToken) &&
    hasText(traveler.email) &&
    hasText(traveler.nickname) &&
    hasText(traveler.signupServices)
  );
}

export function loadTraveler(): Traveler | null {
  // Retrieve values from sessionStorage
  const traveler = {
    accessToken: window.sessionStorage.getItem(kAccessToken),
    refreshToken: window.sessionStorage.getItem(kRefreshToken),
    email: window.sessionStorage.getItem(kEmail),
    nickname: window.sessionStorage.getItem(kNickname),
    signupServices: window.sessionStorage.getItem(kSignupServices),
  };

  if (!isValidTraveler(traveler)) {
    return null;
  }

  return traveler as Traveler;
}

export function saveTraveler(traveler: Traveler) {
  if (!isValidTraveler(traveler)) {
    console.error('malformed traveler!', { traveler });
  }

  window.sessionStorage.setItem(kAccessToken, traveler.accessToken);
  window.sessionStorage.setItem(kRefreshToken, traveler.refreshToken);
  window.sessionStorage.setItem(kEmail, traveler.email);
  window.sessionStorage.setItem(kNickname, traveler.nickname);
  window.sessionStorage.setItem(kSignupServices, traveler.signupServices);
}

export function clearTraveler() {
  window.sessionStorage.removeItem(kAccessToken);
  window.sessionStorage.removeItem(kRefreshToken);
  window.sessionStorage.removeItem(kEmail);
  window.sessionStorage.removeItem(kNickname);
  window.sessionStorage.removeItem(kSignupServices);
}
