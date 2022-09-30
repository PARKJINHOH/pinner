import React, { useRef, useState } from 'react'
import { Button, ButtonGroup, Dropdown, DropdownButton, Stack } from 'react-bootstrap'
import JourneyPill from './JourneyPill';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState } from '../../states/modal';

export default function TravelPill({ travel }) {

    const [isRenaming, setIsRenaming] = useState(false);
    const renameRef = useRef(null);

    const [collapse, setCollapse] = useState(true);

    const setNewJourneyStep = useSetRecoilState(newJourneyStepState);


    function onDeleteClick(e) {
        e.stopPropagation();
        console.log('asdf');
    }

    function onRenameClick(e) {
        e.stopPropagation();
        setIsRenaming(true);
        // TODO:
    }

    /**
     * 이름 변경 중 ESC키를 누르면 취소를, 엔터를 누르면 적용한다.
     * @param {KeyboardEvent} e
     */
    function onKeyDownRename(e) {
        const isEsc = e.key === "Escape";
        const isEnter = e.key === "Enter";

        if (isEsc || isEnter) {
            e.preventDefault();
            if (isEnter) {
                // TODO: apply rename
                console.log("apply rename");
            }
            setIsRenaming(false);
        }
    }

    function applyRename(e) {

    }

    return (
        <li className="mb-2 d-grid space-between">
            <ButtonGroup>
                <Button onClick={() => setCollapse(!collapse)}>
                    <Stack direction="horizontal" className='me-auto'>
                        {
                            isRenaming ?
                                <input type="text" autoFocus={true} onKeyDown={onKeyDownRename} onBlur={() => setIsRenaming(false)}></input>
                                :
                                <>
                                    {collapse ? <FiChevronRight /> : <FiChevronDown />}
                                    <div>{travel.title}</div>
                                </>
                        }
                    </Stack>


                </Button>


                <DropdownButton as={ButtonGroup} className='e-caret-hide hide-after' title={<BsThreeDots />}>
                    <Dropdown.Item onClick={onRenameClick}>이름 변경</Dropdown.Item>
                    <Dropdown.Item onClick={onDeleteClick}>삭제</Dropdown.Item>
                    <Dropdown.Item onClick={() => setNewJourneyStep(NewJourneyStep.EDITTING)}>Add journey</Dropdown.Item>
                </DropdownButton>
            </ButtonGroup>


            {
                collapse ||
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {
                        travel.journeys.map(journey => <JourneyPill key={journey.id} journey={journey} />)
                    }
                </ul>
            }
        </li>
    )
}
