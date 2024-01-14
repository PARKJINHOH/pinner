import axios from "axios";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { travelerState, useDoLogout } from "states/traveler";
import {clearTraveler, loadTraveler} from "states/travelerWebstore";
import { renewalToken } from "./auth";


// Generated file. Do not edit
export const HTTPStatus = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    PROCESSING: 102,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    MOVED_TEMPORARILY: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    REQUEST_TOO_LONG: 413,
    REQUEST_URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    INSUFFICIENT_SPACE_ON_RESOURCE: 419,
    METHOD_FAILURE: 420,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    INSUFFICIENT_STORAGE: 507,
    NETWORK_AUTHENTICATION_REQUIRED: 511,
};

Object.freeze(HTTPStatus);


export const rawAxiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        "Content-Type": "application/json",
    }
});


// 모든 요청에 액세스 토큰을 포함하도록 구성
rawAxiosInstance.interceptors.request.use(
    (config) => {
        const traveler = loadTraveler();
        if (traveler) {
            config.headers["Authorization"] = `Bearer ${traveler.accessToken}`;
        }
        return config;
    },
    (error) => {
        console.error({ "request-interceptors-error": error.response.data.message });
        return Promise.reject(error);
    }
);

export const useAPIv1 = function () {
    const setTraveler = useSetRecoilState(travelerState);

    // 토큰 갱신 후 재시도 하는 함수
    async function handleTokenExpired(config) {
        try {
            const res = await renewalToken();
            const { accessToken, refreshToken } = res.data;
            window.sessionStorage.setItem("accessToken", accessToken);
            window.sessionStorage.setItem("refreshToken", refreshToken);

            return rawAxiosInstance.request(config);
        } catch (error) {
            setTraveler(null);
            clearTraveler();
            alert(error.response.data.message);
        }
    }

    // 접근 권한이 없는 403 Error 사용.
    function forbiddenError() {
        setTraveler(null);
        clearTraveler();
        alert("접근 권한이 없습니다. 다시 로그인해주세요.");
        window.location.reload();
    }

    return {
        put: async (url, data) => {
            try {
                return (await rawAxiosInstance.put(url, data));
            } catch (error) {
                if (error.response.status === HTTPStatus.UNAUTHORIZED && error.response.data.status === 9999) {
                    return await handleTokenExpired(error.config);
                }
                throw error.response.data;
            }
        },
        patch: async (url, data) => {
            try {
                return (await rawAxiosInstance.patch(url, data));
            } catch (error) {
                if (error.response.status === HTTPStatus.UNAUTHORIZED && error.response.data.status === 9999) {
                    return await handleTokenExpired(error.config);
                }
                throw error.response.data;
            }
        },
        delete: async (url, data) => {
            try {
                return (await rawAxiosInstance.delete(url, data));
            } catch (error) {
                if (error.response.status === HTTPStatus.UNAUTHORIZED && error.response.data.status === 9999) {
                    return await handleTokenExpired(error.config);
                }
                throw error.response.data;
            }
        },
        get: async (url, config) => {
            try {
                return (await rawAxiosInstance.get(url, config));
            } catch (error) {
                if (error.response.status === HTTPStatus.UNAUTHORIZED && error.response.data.status === 9999) {
                    return await handleTokenExpired(error.config);
                } else if(error.response.data.status === 9998){
                    forbiddenError();
                }
                throw error.response.data;
            }
        },
        post: async (url, data, config) => {
            try {
                return (await rawAxiosInstance.post(url, data, config));
            } catch (error) {
                if (error.response.status === HTTPStatus.UNAUTHORIZED && error.response.data.status === 9999) {
                    return await handleTokenExpired(error.config);
                } else if(error.response.data.status === 9998){
                    forbiddenError();
                }
                throw error.response.data;
            }
        },
    };
}

