import { useSearchParams } from 'react-router-dom';
import { useDoLogin } from 'states/traveler';

export default function AfterOAtuhHandler() {
    const doLogin = useDoLogin();


    const [searchParams] = useSearchParams();
    console.log(searchParams);

    doLogin({
        email: searchParams.get('email'),
        name: searchParams.get('nickname'),
        accessToken: searchParams.get('accessToken'),
        refreshToken: searchParams.get('refreshToken'),
    });


    window.location = "/";
}