import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPageAdmin() {
    let useRouteError1 = useRouteError();
    console.log(useRouteError1)

    return (
        <div id="error-page">
            <h1>관리자 페이지에서 에러가 발생했습니다.</h1>
        </div>
    );
}