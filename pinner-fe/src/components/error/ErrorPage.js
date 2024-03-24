import {isRouteErrorResponse, useRouteError} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 401) {
            return (
                <div id="error-page">
                    <h1>인증되지 않은 사용자입니다.</h1>
                </div>
            );
        } else if (error.status === 404) {
            return (
                <div id="error-page">
                    <h1>페이지를 찾을 수 없어요.</h1>
                </div>
            );
        }
        return (
            <div id="error-page">
                관리자에게 문의해주세요.
            </div>
        );

    } else if (error instanceof Error) {
        return (
            <div id="error-page">
                <h1>알수 없는 에러가 발생했습니다.</h1>
                <p>
                    <i>{error.message}</i>
                </p>
            </div>
        );
    } else {
        return <></>;
    }
}