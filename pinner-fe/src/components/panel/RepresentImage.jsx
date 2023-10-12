import React from 'react'

/**
 *
 * @param {{photoId: string}} props
 * @returns
 */
export default function RepresentImage({photo}) {
    return (
        <img
            style={{
                objectFit: 'cover',
                transform: 'translate3d(0, 0, 1px)',
            }}
            src={photo.src}
            loading="lazy"
            width="100%"
            height="100%"
            alt="RepresentImage"/>
    )
}
