import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NewJourneyStep, newJourneyStepState } from '../../states/modal';
import { selectedTravelIdState, travelState } from '../../states/travel';
import JourneyPill from "./JourneyPill";

import { useAPIv1 } from '../../apis/apiv1';

import { styled } from "@mui/material/styles";
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TravelPill({ travel }) {

    const [isRenaming, setIsRenaming] = useState(false);

    const setNewJourneyStep = useSetRecoilState(newJourneyStepState);
    const [selectedId, setSelectedId] = useRecoilState(selectedTravelIdState);
    const isSelected = travel.id === selectedId;

    const apiv1 = useAPIv1();

    const setTravels = useSetRecoilState(travelState);

    const journeyList = travel.journeys;
    const uniqueDate = [...new Set(journeyList.map((v) => v.date))]
    const newData = uniqueDate.reduce(
        (acc, v) => [...acc, [...journeyList.filter((d) => d.date === v)]], []
    );


    function onFoldingClick(e) {
        if (isSelected) setSelectedId(undefined);
        else setSelectedId(travel.id);
    }

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


    // 아코디언 Custom 시작
    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        "&:not(:last-child)": {
            borderBottom: 0
        },
        "&:before": {
            display: "none"
        }
    }));

    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
            {...props}
        />
    ))(({ theme }) => ({
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, .05)"
                : "rgba(0, 0, 0, .03)",
        flexDirection: "row-reverse",
        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)"
        },
        "& .MuiAccordionSummary-content": {
            marginLeft: theme.spacing(1)
        }
    }));
    // 아코디언 Custom 끝


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
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // Travel 사이드 메뉴 끝

    const iconAndTitle =
        <div>
            {travel.title}
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="long-menu"
                open={open}
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                onClose={handleClose}
            >
                <MenuItem onClick={onRenameClick}>이름변경</MenuItem>
                <MenuItem onClick={onDeleteClick}>삭제</MenuItem>
                <MenuItem onClick={onNewJourneyClick}>여행지 생성</MenuItem>
            </Menu>
        </div>;

    return (
        <>
            {/* Travel 버튼 */}
            <Accordion>
                <AccordionSummary>
                    {isRenaming ? renameTextInput : iconAndTitle}
                </AccordionSummary>
                <AccordionDetails>
                    {newData.map((journeys, i) => <JourneyDatePill key={i} journeys={journeys} />)}
                </AccordionDetails>
            </Accordion>
        </>
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