

const kAccessToken = "accessToken";
const kRefreshToken = "refreshToken";
const kEmail = "email";
const kNickname = "nickname";
const kSignupServices = "signupServices";

function isValidTraveler(traveler) {
    const hasText = (s) => (s !== null) && (s.trim().length !== 0);

    return (
        hasText(traveler.accessToken) &&
        hasText(traveler.refreshToken) &&
        hasText(traveler.email) &&
        hasText(traveler.nickname) &&
        hasText(traveler.signupServices)
    );
}

export function loadTraveler() {
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

    return traveler;
}

export function saveTraveler(traveler) {
    if (!isValidTraveler(traveler)) {
        console.error("malformed traveler!", { traveler });
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