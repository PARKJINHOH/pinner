import axios from "axios";

function getLocalAccessToken() {
    return window.sessionStorage.getItem("adminAccessToken");
}

function getLocalRefreshToken() {
    return window.sessionStorage.getItem("adminRefreshToken");
}

const instance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = getLocalAccessToken();
        if (token) {
            config.headers["x-access-token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 로그인
export async function postLogin(data) {
    let res = await instance.post("/api/v1/admin/login", data);
    const { accessToken, refreshToken } = res.data;
    window.sessionStorage.setItem("adminAccessToken", accessToken);
    window.sessionStorage.setItem("adminRefreshToken", refreshToken);
    return res;
}

// 로그아웃
export async function postLogout(data) {
    return instance.post("/api/v1/admin/logout", data);
}

// token 갱신
export async function renewalToken() {
    return instance.post("/api/v1/admin/renewal/token", {
        refreshToken: getLocalRefreshToken(),
        accessToken: getLocalAccessToken()
    });
}