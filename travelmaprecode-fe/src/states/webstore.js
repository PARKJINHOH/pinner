

const kAccessToken = "accessToken";
const kRefreshToken = "refreshToken";
const kEmail = "email";
const kName = "name";

function isValidTraveler(traveler) {
    const hasText = (s) => (s !== null) && (s.trim().length !== 0);

    return (
        hasText(traveler.accessToken) &&
        hasText(traveler.refreshToken) &&
        hasText(traveler.email) &&
        hasText(traveler.name)
    );
}

export function loadTraveler() {
    const traveler = {
        accessToken: window.sessionStorage.getItem(kAccessToken),
        refreshToken: window.sessionStorage.getItem(kRefreshToken),
        email: window.sessionStorage.getItem(kEmail),
        name: window.sessionStorage.getItem(kName),
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
    window.sessionStorage.setItem(kName, traveler.name);
}


export function clearTraveler() {
    window.sessionStorage.removeItem(kAccessToken);
    window.sessionStorage.removeItem(kRefreshToken);
    window.sessionStorage.removeItem(kEmail);
    window.sessionStorage.removeItem(kName);
}