import React from 'react'
import { Anchor, Badge } from 'react-bootstrap';

export default function JourneyPill({ journey }) {

    const geoString = 'Some Country Any City'; // FIXME
    const hashtags = journey.hashtags;

    return (
        <div className='ms-3 mb-3'>
            <p className='mb-0'>{geoString}</p>
            {journey.hashtags.map(tag => <Hashtag key={tag} tag={tag}></Hashtag>)}
        </div>
    )
}

function Hashtag({ tag }) {
    const style = {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
        },
    };

    return (
        <Badge  style={style} bg="light" text="dark">#{tag}</Badge>
    )
}   
