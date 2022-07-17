// 2022-07-16 테스트 해야함.
import axios from "axios";

export function sendPostApi(url, data) {
    return fetch(
        url,
        {
            body: data,
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        },
    )
}

export function sendGetApi(url, data) {
    return axios
        .get(url + "/" + data)
        .then((Response) => {
            return Response.data;
        })
        .catch((Error) => {
            console.log(Error);
        });
}