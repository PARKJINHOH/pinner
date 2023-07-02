import React, {useCallback, useEffect, useState} from 'react';

import {useAPIv1} from '../../apis/apiv1'

import {Box, Button, ImageList, ImageListItem, ImageListItemBar, imageListItemClasses, Input, Paper, Snackbar, Typography} from "@mui/material";
import './JourneyView.css';

import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {journeyListViewWidth, sidebarWidth, travelListViewWidth} from "../../states/panel/panelWidth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import dayjs from "dayjs";
import {selectedTravelState, travelState} from "../../states/travel";
import {NewJourneyStep, newJourneyStepState, newLocationState} from "../../states/modal";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * Journey 보기 및 수정
 * @param travel
 */
export default function JourneyView({journey, viewCancel}) {
    console.log('JourneyView', journey);
    const apiv1 = useAPIv1();

    const [editMode, setEditMode] = useState(false);

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);
    const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);
    const [travelData, setTravelData] = useRecoilState(travelState);

    const _setTravels = useSetRecoilState(travelState);
    const [newJourneyStep, setNewJourneyStep] = useRecoilState(newJourneyStepState);
    const [newLocation, setNewLocation] = useRecoilState(newLocationState);

    const [snackbarState, setSnackbarState] = useState({open: false, vertical: 'top', horizontal: 'center'});
    const { vertical, horizontal, open } = snackbarState;

    const snackbarOpen = (newState) => {
        setSnackbarState({ open: true, ...newState });
    }

    const snackbarClose = (event, reason) => {
        if(newJourneyStep === NewJourneyStep.LOCATING){
            return;
        }
        setSnackbarState({ ...snackbarState, open: false });
    };

    return (
        <>
            <div>
                <Snackbar
                    anchorOrigin={{vertical, horizontal}}
                    open={open}
                    onClose={snackbarClose}
                    message="지도에서 위치를 클릭해주세요."
                    key={vertical + horizontal}
                />
            </div>
            <Paper sx={{
                padding: 2,
                width: _journeyPanelWidth, position: 'fixed', borderRadius: 0,
                height: '100vh', top: 0, left: _sidebarWidth + _travelListViewWidth, zIndex: '9',
                overflow: 'auto', // 스크롤바 추가
            }}>
                <Box>
                    <div className="journeyView-title-group">
                        <ArrowBackIosIcon
                            sx={{cursor: 'pointer'}}
                            onClick={() => {
                                viewCancel();
                            }}
                        />
                        {
                            editMode ?
                                <>
                                    <Input
                                        className="journeyView-title"
                                        placeholder="여행한 장소를 입력해주세요."
                                        inputProps={{maxLength: 50}}
                                        value={newLocation.name}
                                        onChange={e => setNewLocation({...newLocation, name: e.target.value})}
                                    />
                                    <LocationOnIcon
                                        sx={{cursor: 'pointer'}}
                                        className="journeyView-location"
                                        onClick={() => {
                                            snackbarOpen({vertical: "top", horizontal: "center"});
                                            setNewJourneyStep(NewJourneyStep.LOCATING);
                                        }}
                                    />
                                </>
                                :
                                <Typography variant="h6" className="journeyView-title">
                                    {journey.geoLocationDto.name}
                                </Typography>
                        }
                    </div>
                    <div className="journeyView-date">
                        <Typography>
                            {dayjs(journey.date).format("YYYY.MM.DD")}
                        </Typography>
                    </div>
                    <div className="journeyView-tag-div">
                        {
                            journey.hashtags.map((tag, index) => (
                                    <div key={index} className="journeyView-tag">{tag}</div>
                                )
                            )
                        }
                    </div>
                </Box>
                <Box className="journeyView-edit">
                    {
                        editMode ?
                            <CheckCircleOutlineIcon
                                sx={{cursor: 'pointer'}}
                                onClick={() => {
                                    setEditMode(!editMode);
                                    // Todo : function 저장
                                }}
                            />
                            :
                            <ModeEditIcon
                                sx={{cursor: 'pointer'}}
                                onClick={() => {
                                    setEditMode(!editMode);
                                }}
                            />
                    }

                </Box>
                <Box className="journeyView-imageBox">
                    <ImageList variant="masonry" cols={2} gap={8}>
                        {
                            journey.photos.map((file, index) => {
                                return (
                                    <ImageListItem key={index}>
                                        <img
                                            alt={index}
                                            src={`/photo/${file}`}
                                            srcSet={`/photo/${file}`}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                )
                            })
                        }
                    </ImageList>
                </Box>
            </Paper>
        </>
    );
}