// 2022-07-16 테스트 해야함.
export function sendPostApi(uri, data) {
    return fetch(
        uri,
        {
            body: data,
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        },
    )
}

export function sendGetApi(uri, data) {
    return fetch(
        uri + "/" + data,
        {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        },
    )
}