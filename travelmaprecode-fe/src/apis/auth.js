import axios from "axios";

function getLocalAccessToken() {
    return window.sessionStorage.getItem("accessToken");
}

function getLocalRefreshToken() {
    return window.sessionStorage.getItem("refreshToken");
}

const instance = axios.create({
    baseURL: "http://localhost:8080",
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
        console.log(error.response.data.message);
        return Promise.reject(error);
    }
);

// instance.interceptors.response.use(
//     (res) => {
//         return res;
//     },
//     async (err) => {
//         const originalConfig = err.config;
//         if (err.response) {
//             // Access Token was expired
//             if (err.response.status === 401 && !originalConfig._retry) {
//                 originalConfig._retry = true;
//                 try {
//                     const rs = await refreshToken();
//                     const {accessToken} = rs.data;
//                     window.sessionStorage.setItem("accessToken", accessToken);
//                     instance.defaults.headers.common["x-access-token"] = accessToken;
//                     return instance(originalConfig);
//                 } catch (_error) {
//                     if (_error.response && _error.response.data) {
//                         return Promise.reject(_error.response.data);
//                     }
//                     return Promise.reject(_error);
//                 }
//             }
//             if (err.response.status === 403 && err.response.data) {
//                 console.log(err.response.data.message);
//                 return Promise.reject(err.response.data);
//             }
//         }
//         return Promise.reject(err);
//     }
// );

// 로그인
export async function postLogin(data) {
    let res = await instance.post("/api/traveler/login", data);
    const { accessToken, refreshToken } = res.data.data.payload;
    window.sessionStorage.setItem("accessToken", accessToken);
    window.sessionStorage.setItem("refreshToken", refreshToken);
    return res;
}

// 회원가입
export async function postRegister(data) {
    return await instance.post("/api/traveler/register", data);
}

// 로그아웃
export async function postLogout(data) {
    return await instance.post("/api/traveler/logout", data);
}

// refreshToken 갱신
export async function refreshToken() {
    return await instance.post("/api/traveler/refreshtoken", {
        refreshToken: getLocalRefreshToken(),
    });
}