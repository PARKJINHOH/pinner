import React, {useState} from 'react';

import {useAPIv1} from '../../apis/apiv1'

import {Box, Button, Input, Paper} from "@mui/material";
import './NewJourneyPill.css';

import {useRecoilValue, useSetRecoilState} from "recoil";
import {travelState} from "../../states/travel";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";

import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/ko";
import moment from "moment";

/**
 * Journey 글쓰기 컴포넌트
 * @param travel
 */
export default function NewJourneyPill({ travel }) {
    console.log('travel', travel);
    const apiv1 = useAPIv1();

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);

    const currentDate = moment().format('YYYY-MM-DD');
    const [pickerDate, setPickerDate] = useState(moment(currentDate));

    const setTravels = useSetRecoilState(travelState);
    const[isTitleEditing, setIsTitleEditing] = useState(false);


    function ButtonField(props) {
        const {
            setOpen,
            label,
            id,
            disabled,
            InputProps: { ref } = {},
            inputProps: { 'aria-label': ariaLabel } = {},
        } = props;

        return (
            <Button
                variant="text"
                size="small"
                id={id}
                disabled={disabled}
                ref={ref}
                aria-label={ariaLabel}
                onClick={() => setOpen?.((prev) => !prev)}
            >
                {label ?? 'Pick a date'}
            </Button>
        );
    }

    function ButtonDatePicker(props) {
        const [open, setOpen] = useState(false);

        return (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="koKR">
                <DatePicker
                    slots={{ field: ButtonField, ...props.slots }}
                    slotProps={{ field: { setOpen } }}
                    {...props}
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                />
            </LocalizationProvider>
        );
    }

    return (
        <>
            <Paper sx={{
                width: _journeyPanelWidth, position: 'fixed', borderRadius: 0,
                height: '100vh', top: 0, left: _sidebarWidth + _travelListViewWidth, zIndex: '9',
                overflow: 'auto', // 스크롤바 추가
            }}>
                <Box className="newJourney-box">
                    <div className="newJourney-arrowBack">
                        <ArrowBackIosIcon/>
                        <Input
                            placeholder="여행한 장소를 입력해주세요.(13자 이내)"
                            sx={{width: 300, fontSize:14, height: 40}}
                            inputProps={{maxLength: 13}}
                        />
                    </div>
                    <div className="newJourney-date-underline">
                        <ButtonDatePicker
                            label={`${pickerDate.format('YYYY-MM-DD')}`}
                            value={pickerDate}
                            onChange={(newPickerDate) => setPickerDate(newPickerDate)}
                        />
                    </div>
                </Box>

            </Paper>
        </>
    )
}