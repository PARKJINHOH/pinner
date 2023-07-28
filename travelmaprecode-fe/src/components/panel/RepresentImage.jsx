import React from 'react'
import {useRecoilState} from "recoil";
import {environmentStatus} from "../../states/environment";

/**
 *
 * @param {{photoId: string}} props
 * @returns
 */
export default function RepresentImage({photo}) {
    const [nowEnv, setNowEnv] = useRecoilState(environmentStatus);

    return (
        <img
            style={{
                objectFit: 'cover',
                transform: 'translate3d(0, 0, 1px)',
            }}
            src={photo.src}
            loading="lazy"
            alt={photo.fileName}
            width="100%"
            height="100%"
        />
    )
}
