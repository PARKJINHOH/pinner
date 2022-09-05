import React, { useRef, useState } from 'react'
import { Button, Dropdown, Stack } from 'react-bootstrap'
import JourneyPill from './JourneyPill';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';

export default function TravelPill({ travelLog }) {

    const [isRenaming, setIsRenaming] = useState(false);
    const renameRef = useRef(null);

    const [collapse, setCollapse] = useState(true);

    function onDeleteClick(e) {
        e.stopPropagation();
        console.log('asdf');
    }

    function onRenameClick(e) {
        e.stopPropagation();
        setIsRenaming(true);
        // TODO:
    }

    return (
        <li className="mb-2 d-grid space-between">
            <Button onClick={() => setCollapse(!collapse)}>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="horizontal" className='me-auto'>
                    {
                        isRenaming ?
                            <input type="text" autoFocus={true}></input>
                            :
                            <>
                                {collapse ? <FiChevronRight /> : <FiChevronDown />}
                                <div>{travelLog.title}</div>
                            </>
                    }
                    </Stack>

                    <Dropdown onClick={e => e.stopPropagation()}>
                        <Dropdown.Toggle className='e-caret-hide hide-after p-0'>
                            <BsThreeDots />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={onRenameClick}>이름 변경</Dropdown.Item>
                            <Dropdown.Item onClick={onDeleteClick}>삭제</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Stack>
            </Button>

            {
                collapse ||
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {
                        travelLog.travels.map(travel => <JourneyPill travel={travel} />)
                    }
                </ul>
            }
        </li>
    )
}
