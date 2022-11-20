import React, {useState} from 'react';
import {Badge, Button, ButtonGroup, Dropdown, DropdownButton, Stack} from 'react-bootstrap';
import JourneyPill from "./JourneyPill";
import {FiChevronDown, FiChevronRight} from "react-icons/fi";

export default function JourneyDatePill({ journeys }) {

    const [collapse, setCollapse] = useState(true);

    return (
        <li className="mb-2 d-grid space-between">
            <ButtonGroup>
                <Button onClick={() => setCollapse(!collapse)}>
                    <Stack direction="horizontal" className='me-auto'>
                        {
                            <>
                                {collapse ? <FiChevronRight /> : <FiChevronDown />}
                                <div>
                                    {
                                        <div key={journeys[0].id}>{journeys[0].date}</div>
                                    }
                                </div>
                            </>
                        }
                    </Stack>
                </Button>
            </ButtonGroup>
            {
                collapse ||
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {
                        journeys.map(journey => <JourneyPill key={journey.id} journey={journey} />)
                    }
                </ul>
            }
        </li>
    )
}