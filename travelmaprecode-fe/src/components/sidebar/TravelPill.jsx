import React, { useRef, useState } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState, newLocationState } from '../../states/modal';
import { selectedTravelIdState, travelState } from '../../states/travel';
import JourneyPill from "./JourneyPill";

import { useAPIv1 } from '../../apis/apiv1';
import { centreOfMapState } from '../../states/map';


function getCentreOfTravel(travel) {
    const journeyList = travel.journeys;
    const sum = journeyList.reduce((acc, v) => {
        return {
            lat: acc.lat + v.geoLocationDto.lat,
            lng: acc.lng + v.geoLocationDto.lng
        }
    }, { lat: 0, lng: 0 });

    return {
        lat: sum.lat / journeyList.length,
        lng: sum.lng / journeyList.length
    }
}


export default function TravelPill({ travel }) {

    const [isRenaming, setIsRenaming] = useState(false);
    const renameRef = useRef(null);

    const resetNewLocationState = useResetRecoilState(newLocationState);
    const setNewJourneyStep = useSetRecoilState(newJourneyStepState);

    const [selectedId, setSelectedId] = useRecoilState(selectedTravelIdState);
    const isSelected = selectedId === travel.id;

    const apiv1 = useAPIv1();

    const setTravels = useSetRecoilState(travelState);

    // 맵 위치를 여행의 중심으로 이동
    const [centreOfMap, setCentreOfMap] = useRecoilState(centreOfMapState);

    const journeyList = travel.journeys;
    const uniqueDate = [...new Set(journeyList.map((v) => v.date))]
    const newData = uniqueDate.reduce(
        (acc, v) => [...acc, [...journeyList.filter((d) => d.date === v)]], []
    );


    function onFoldingClick() {
        if (isSelected) {
            setSelectedId(null);
        } else {
            const centreOfTravel = getCentreOfTravel(travel);
            setCentreOfMap(centreOfTravel);
            setSelectedId(travel.id);
        }
    }

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

    // 이름 변경 시작
    function onRenameClick(e) {
        e.stopPropagation();
        setIsRenaming(true);
    }

    const renameTextInput = <input type="text" autoFocus={true} onKeyDown={onKeyDownRename} onBlur={() => setIsRenaming(false)}></input>;

    // 새 Journey 생성을 위해 사용자가 맵을 클릭하도록 안내
    function onNewJourneyClick() {
        toast((t) => (<span>
            어디를 여행하셨나요?
            지도를 클릭해서 Journey를 추가해요.
        </span>));
        setNewJourneyStep(NewJourneyStep.LOCATING);
        setSelectedId(travel.id);
    }


    const iconAndTitle = <>
        {isSelected ? <FiChevronDown /> : <FiChevronRight />}
        <div>{travel.title}</div>
    </>;

    return (
        <li className="mb-2 d-grid space-between">
            {/* Travel 버튼 */}
            <ButtonGroup>
                <Button onClick={onFoldingClick}>
                    <Stack direction="horizontal" className='me-auto'>
                        {isRenaming ? renameTextInput : iconAndTitle}
                    </Stack>
                </Button>

                <DropdownButton as={ButtonGroup} className='e-caret-hide hide-after' title={<BsThreeDots />}>
                    <Dropdown.Item onClick={onRenameClick}>이름 변경</Dropdown.Item>
                    <Dropdown.Item onClick={onDeleteClick}>삭제</Dropdown.Item>
                    <Dropdown.Item onClick={onNewJourneyClick}>Journey 생성</Dropdown.Item>
                </DropdownButton>
            </ButtonGroup>


            {/* Travel 목록 */}
            {
                isSelected &&
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {newData.map((journeys, i) => <JourneyDatePill key={i} journeys={journeys} />)}
                </ul>
            }
        </li>
    )
}

function JourneyDatePill({ journeys }) {

    function drawDateTitle() {
        return <div className='ms-3'>
            <b key={journeys[0].id}>{journeys[0].date}</b>
            <hr style={{ margin: 4 }}></hr>
        </div>;
    }

    function drawJourneyPills() {
        return journeys.map(journey => <JourneyPill key={journey.id} journey={journey} />)
    }

    return (
        <li>
            {drawDateTitle()}
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small ms-4">
                {drawJourneyPills()}
            </ul>
        </li>
    )
}