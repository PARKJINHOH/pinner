import { useAPIv1 } from 'apis/apiv1';
import { postLoginAfterOAuth } from 'apis/auth';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDoLogin } from 'states/traveler';

export default function AfterOAtuhHandler() {
    const doLogin = useDoLogin();

    const apiv1 = useAPIv1();

    const [searchParams] = useSearchParams();
    console.log(searchParams);

    useEffect(() => {
        const ticket = searchParams.get('ticket');


        postLoginAfterOAuth(ticket)
            .then((response) => {
                doLogin({
                    email: response.data.data.payload.email,
                    name: response.data.data.payload.name,
                    accessToken: response.data.data.payload.accessToken,
                    refreshToken: response.data.data.payload.refreshToken,
                });

                window.location = "/";
            })
            .catch((error) => {
                console.error(error)
            });
    }, [])


    return <p>wait a sec</p>
}