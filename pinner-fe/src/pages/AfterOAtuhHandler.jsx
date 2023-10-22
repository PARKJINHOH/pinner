import { postLoginAfterOAuth } from 'apis/auth';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDoLogin } from 'states/traveler';

export default function AfterOAtuhHandler() {
    const doLogin = useDoLogin();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const ticket = searchParams.get('ticket');


        postLoginAfterOAuth(ticket)
            .then((response) => {
                doLogin({
                    email: response.data.data.payload.email,
                    nickname: response.data.data.payload.nickname,
                    accessToken: response.data.data.payload.accessToken,
                    refreshToken: response.data.data.payload.refreshToken,
                    signupServices: response.data.data.payload.signupServices,
                });

                window.location = "/";
            })
            .catch((error) => {
                console.error(error)
            });
    }, [])


    return <p>wait a sec</p>
}