import axios from "axios";

export function sendPostApi(url, data) {
    return axios
        .post(url, data, {
            headers: {
                "Content-Type": `application/json`,
            }
        });
};

export function sendGetApi(url, data) {
    return axios
        .get(url + "/" + data);
};