import axios from "axios";

export function sendPostApi(url, data) {
    return axios
        .post(url, data, {
            headers: {
                "Content-Type": `application/json`,
            }
        })
        .then((Response) => {
            return Response.data;
        })
        .catch((Error) => {
            console.log(Error);
        });
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