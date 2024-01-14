import * as React from 'react';

// component
import {useAPIv1} from "apis/apiv1";

export default function Dashboard() {
    const apiv1 = useAPIv1();
    return (
        <>
            대시보드입니다.
        </>
    );
}
