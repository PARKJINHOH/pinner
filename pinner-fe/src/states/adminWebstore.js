const kAccessToken = "adminAccessToken";
const kRefreshToken = "adminRefreshToken";
const kEmail = "adminEmail";
const kAdminName = "adminName";

function isValidAdmin(admin) {
    const hasText = (s) => (s !== null) && (s.trim().length !== 0);

    return (
        hasText(admin.accessToken) &&
        hasText(admin.refreshToken) &&
        hasText(admin.email) &&
        hasText(admin.adminName)
    );
}

export function loadAdmin() {
    const admin = {
        accessToken: window.sessionStorage.getItem(kAccessToken),
        refreshToken: window.sessionStorage.getItem(kRefreshToken),
        email: window.sessionStorage.getItem(kEmail),
        adminName: window.sessionStorage.getItem(kAdminName),
    };

    if (!isValidAdmin(admin)) {
        return null;
    }

    return admin;
}

export function saveAdmin(admin) {
    if (!isValidAdmin(admin)) {
        console.error("malformed admin!", { admin: admin });
    }

    window.sessionStorage.setItem(kAccessToken, admin.accessToken);
    window.sessionStorage.setItem(kRefreshToken, admin.refreshToken);
    window.sessionStorage.setItem(kEmail, admin.email);
    window.sessionStorage.setItem(kAdminName, admin.adminName);
}


export function clearAdmin() {
    window.sessionStorage.removeItem(kAccessToken);
    window.sessionStorage.removeItem(kRefreshToken);
    window.sessionStorage.removeItem(kEmail);
    window.sessionStorage.removeItem(kAdminName);
}