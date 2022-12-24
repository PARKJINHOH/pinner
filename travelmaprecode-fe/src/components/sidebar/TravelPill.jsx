import React, { useRef, useState } from 'react'
import { Button, ButtonGroup, Dropdown, DropdownButton, Stack } from 'react-bootstrap'
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState, newLocationState } from '../../states/modal';
import toast from 'react-hot-toast';
import { selectedTravelIdState, selectedTravelState, travelState } from '../../states/travel';
import JourneyDatePill from "./JourneyDatePill";

import { useAPIv1 } from '../../apis/apiv1';

export default function TravelPill({ travel }) {

    const [isRenaming, setIsRenaming] = useState(false);
    const renameRef = useRef(null);

    const [collapse, setCollapse] = useState(true);
    const resetNewLocationState = useResetRecoilState(newLocationState);
    const setNewJourneyStep = useSetRecoilState(newJourneyStepState);
    const [selectedId, setSelectedId] = useRecoilState(selectedTravelIdState);

    const apiv1 = useAPIv1();

    const setTravels = useSetRecoilState(travelState);

    const journeyList = travel.journeys;
    const uniqueDate = [...new Set(journeyList.map((v) => v.date))]
    const newData = uniqueDate.reduce(
        (acc, v) => [...acc, [...journeyList.filter((d) => d.date === v)]], []
    );

    const onDeleteClick = async (e) => {
        await apiv1.delete("/travel/" + travel.id)
            .then((response) => {
                if (response.status === 200) {
                    setTravels(response.data);
                } else {
                    alert(response.data);
                }
            });
    }


    /**
     * 이름 변경 중 ESC키를 누르면 취소를, 엔터를 누르면 적용한다.
     * @param {KeyboardEvent} e
     */
    async function onKeyDownRename(e) {
        const isEsc = e.key === "Escape";
        const isEnter = e.key === "Enter";

        if (isEsc || isEnter) {
            e.preventDefault();
            if (isEnter) {
                const titleJson = JSON.stringify({
                    title: e.target.value,
                });

                await apiv1.patch("/travel/" + travel.id, titleJson)
                    .then((response) => {
                        if (response.status === 200) {
                            setTravels(response.data);

                        }
                    });

            }
            setIsRenaming(false);
        }
    }

    function onRenameClick(e) {
        e.stopPropagation();
        setIsRenaming(true);
    }

    return (
        <li className="mb-2 d-grid space-between">
            <ButtonGroup>
                <Button onClick={() => {
                    if (collapse === true) setSelectedId(travel.id);


                    setCollapse(!collapse);

                }}>
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
                    <Dropdown.Item onClick={() => {
                        // 사용자가 맵을 클릭하도록 안내
                        toast((t) => (<span>
                            어디를 여행하셨나요?
                            지도를 클릭해서 Journey를 추가해요.
                        </span>));
                        setNewJourneyStep(NewJourneyStep.LOCATING);
                        setSelectedId(travel.id);
                    }}>Journey 생성</Dropdown.Item>
                </DropdownButton>
            </ButtonGroup>


            {
                collapse ||
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {
                        newData.map((journeys, i) => <JourneyDatePill key={i} journeys={journeys} />)
                    }
                </ul>
            }
        </li>
    )
}
