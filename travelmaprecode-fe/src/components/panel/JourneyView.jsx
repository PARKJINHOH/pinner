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

    return (
        <>
            <Paper sx={{
                width: _journeyPanelWidth, position: 'fixed', borderRadius: 0,
                height: '100vh', top: 0, left: _sidebarWidth + _travelListViewWidth, zIndex: '9',
                overflow: 'auto', // 스크롤바 추가
            }}>
                <Box className="journeyView-box">
                    <div className="journeyView-arrowBack">
                        <ArrowBackIosIcon
                            sx={{marginLeft: 2}}
                            onClick={() => {
                                viewCancel();
                            }}
                        />
                        <Typography>
                            {journey.geoLocationDto.name}
                        </Typography>
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