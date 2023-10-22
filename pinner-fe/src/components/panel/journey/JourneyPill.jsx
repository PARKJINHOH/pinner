import React, {useState} from 'react';
import {useSetRecoilState} from "recoil";

// api
import {HTTPStatus, useAPIv1} from 'apis/apiv1'

// css
import style from './JourneyPill.module.css';

// component
import {travelState} from 'states/travel';
import {representPhotoIdOfJourney} from 'common/travelutils';
import RepresentImage from 'components/panel/RepresentImage';
import JourneyView from 'components/panel/journey/JourneyView';

// mui
import {Box, Chip, Typography, IconButton} from "@mui/material";

// icon
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

// etc
import dayjs from "dayjs";


/**
 * Journey 정보를 보여주는 컴포넌트
 * @param travelId
 * @param editMode
 * @param setEditMode
 * @param {Journey} journey
 */
export default function JourneyPill({travelId, editMode, setEditMode, journey}) {
    const apiv1 = useAPIv1();

    const [isJourneyViewState, setIsJourneyViewState] = useState(false);
    const setTravels = useSetRecoilState(travelState);

    const journeyPhotoCnt = journey.photos.length;
    const journeyDate = dayjs(journey.date).format("YYYY년 MM월 DD일");

    const photo = representPhotoIdOfJourney(journey);

    function onJourneyViewClick() {
        setEditMode('');
        setIsJourneyViewState(true);
    }

    async function onDeleteClick() {
        if(window.confirm(`"${journey.geoLocationDto.name}" 여정을 정말 삭제하실건가요?`)){
            await apiv1.delete(`/journey/${journey.id}`)
                .then((response) => {
                    if (response.status === HTTPStatus.OK) {
                        setEditMode('');
                        setTravels(response.data);
                    }
                });
        }
    }

    return (
        <>
            <Box className={style.root_box}>
                <div onClick={onJourneyViewClick}>
                    {
                        editMode === 'DELETE' && (
                            <IconButton
                                aria-label="delete"
                                sx={{position: 'absolute'}}
                                className={style.journey_delete_iconBtn}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDeleteClick();
                                }}
                            >
                                <DeleteForeverOutlinedIcon
                                    className={style.journey_delete_icon}
                                    sx={{fontSize: 30, color: 'red'}}
                                />
                            </IconButton>
                        )
                    }
                    <Box className={style.preview_box}>
                        <div className={style.preview}>
                            {
                                photo !== null ?
                                    <RepresentImage photo={photo}></RepresentImage>
                                    :
                                    <Typography color="textSecondary">
                                        사진 없음
                                    </Typography>
                            }
                        </div>
                        <div className={style.journey_info}>
                            <Chip size="small" sx={{backgroundColor: '#5b5b5b', color: 'white'}}
                                  label={journeyDate}
                            />
                            <Chip size="small" sx={{backgroundColor: '#5b5b5b', color: 'white', marginLeft: '120px'}}
                                  label={`${journeyPhotoCnt} 이미지`}
                            />
                        </div>
                    </Box>
                </div>
                <Typography sx={{fontSize: '20px', fontWeight: 'bold'}}>{journey.geoLocationDto.name}</Typography>
                {
                    journey.hashtags.map((tag, index) => (
                            <div key={index} className={style.journey_tags}>{tag}</div>
                        )
                    )
                }
            </Box>

            {
                // 여정(Journey)목록 리스트 패널
                isJourneyViewState && <JourneyView travelId={travelId} journey={journey} viewCancel={() => setIsJourneyViewState(false)}/>
            }
        </>
    );
}