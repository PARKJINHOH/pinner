import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import TravelPill from './TravelPill';

export default function TravelLogPill({ travelLog }) {

    const [collapse, setCollapse] = useState(true);

    return (
        <li className="mb-2">
            <Button onClick={() => setCollapse(!collapse)}>
                {(collapse ? '› ' : '⌄ ') + travelLog.title}
            </Button>

            {
                collapse ||
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {
                        travelLog.travels.map(travel => <TravelPill travel={travel} />)
                    }
                </ul>
            }
        </li>
    )
}
