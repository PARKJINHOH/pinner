import React from 'react'

/**
 *
 * @param {{photoId: string}} props
 * @returns
 */
export default function RepresentImage({ photoId }) {
    return (<img
        style={{
            objectFit: 'cover',
            transform: 'translate3d(0, 0, 1px)',
        }}
        src={`/photo/${photoId}`}
        loading="lazy"
        alt={photoId}
        width="100%"
        height="100%"
    />
    )
}
