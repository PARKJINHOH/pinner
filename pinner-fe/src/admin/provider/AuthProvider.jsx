import {createContext, useContext, useEffect, useMemo, useState} from "react";

import {clearAdmin} from "states/adminWebstore";
import {clearTraveler} from "states/travelerWebstore";

import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export default function AuthProvider({children}) {
    const [accessToken, setAccessToken] = useState(window.sessionStorage.getItem("accessToken"));
    const setToken = (newToken) => {
        setAccessToken(newToken);
    };

    useEffect(() => {
        if (accessToken) {
            const verifiedToken = jwtDecode(accessToken);
            if (!verifiedToken.admin) {
                clearAdmin();
                clearTraveler();
            }
        }
    }, [accessToken]);

    // 인증 컨텍스트의 메모된 값
    const contextValue = useMemo(
        () => ({
            token: accessToken,
            setToken,
        }),
        [accessToken]
    );

    // 하위 구성 요소에 인증 컨텍스트 제공
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};