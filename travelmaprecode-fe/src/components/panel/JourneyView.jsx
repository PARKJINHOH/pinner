import React, {useCallback, useEffect, useState} from 'react';

import {useAPIv1} from '../../apis/apiv1'

import {Box, Button, ImageList, ImageListItem, ImageListItemBar, imageListItemClasses, Input, Paper, Snackbar, Typography} from "@mui/material";
import './JourneyView.css';

import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";

import Tags from "@yaireo/tagify/dist/react.tagify";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import IconButton from "@mui/material/IconButton";
import {Divider} from "@mantine/core";
import {toast} from "react-hot-toast";
import {selectedTravelState, travelState} from "../../states/travel";
import {NewJourneyStep, newJourneyStepState, newLocationState} from "../../states/modal";


/**
 * Journey 보기 및 수정
 * @param travel
 */
export default function JourneyView({ journey, viewCancel }) {
    console.log('JourneyView', journey);
    const apiv1 = useAPIv1();

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);
    const [travelData, setTravelData] = useRecoilState(travelState);

    const _setTravels = useSetRecoilState(travelState);
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);

    return (
        <>
            <Paper sx={{
                width: _journeyPanelWidth, position: 'fixed', borderRadius: 0,
                height: '100vh', top: 0, left: _sidebarWidth + _travelListViewWidth, zIndex: '9',
                overflow: 'auto', // 스크롤바 추가
            }}>
                <Box className="journeyView-box">
                    <div className="newJourney-arrowBack">
                        <ArrowBackIosIcon
                            sx={{marginLeft: 2}}
                            onClick={() => {
                                viewCancel();
                            }}
                        />
                        <Typography>

                        </Typography>

                    </div>
                </Box>
            </Paper>
        </>
    );
}