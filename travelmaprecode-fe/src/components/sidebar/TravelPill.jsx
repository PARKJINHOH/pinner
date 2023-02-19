import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState } from '../../states/modal';
import { selectedTravelIdState, travelState } from '../../states/travel';
import JourneyPill from "./JourneyPill";

import { useAPIv1 } from '../../apis/apiv1';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function TravelPill({ travel }) {

    const [isRenaming, setIsRenaming] = useState(false);

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
        setAnchorEl(null);
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
        setAnchorEl(null);
    }

    const renameTextInput = <input type="text" autoFocus={true} onKeyDown={onKeyDownRename} onBlur={() => setIsRenaming(false)}></input>;
    // 이름 변경 끝

    // Travel 사이드 메뉴 시작
    function onNewJourneyClick() {
        setAnchorEl(null);
        toast((t) => (<span>
            어디를 여행하셨나요?
            지도를 클릭해서 Journey를 추가해요.
        </span>));
        setNewJourneyStep(NewJourneyStep.LOCATING);
        setSelectedId(travel.id);
    }


    const [anchorEl, setAnchorEl] = useState(null);
    const showDropdownMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);
    // Travel 사이드 메뉴 끝

    const iconAndTitle =
        <div >
            {travel.title}

            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={showDropdownMenu ? 'long-menu' : undefined}
                aria-expanded={showDropdownMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>

            <div onClick={(e) => e.stopPropagation()}>
                <Menu
                    anchorEl={anchorEl}
                    id="long-menu"
                    open={showDropdownMenu}
                    MenuListProps={{ 'aria-labelledby': 'long-button' }}
                    onClose={handleClose}
                >
                    <MenuItem onClick={onRenameClick}>이름변경</MenuItem>
                    <MenuItem onClick={onDeleteClick}>삭제</MenuItem>
                    <MenuItem onClick={onNewJourneyClick}>여행지 생성</MenuItem>
                </Menu>
            </div>


        </div>;

    return (
        <MuiAccordion>
            <MuiAccordionSummary>
                {isRenaming ? renameTextInput : iconAndTitle}
            </MuiAccordionSummary>
            <AccordionDetails>
                {newData.map((journeys, i) => <JourneyDatePill key={i} journeys={journeys} />)}
            </AccordionDetails>
        </MuiAccordion>
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