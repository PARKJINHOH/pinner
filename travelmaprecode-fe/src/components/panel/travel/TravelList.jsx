import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';

// api
import {useAPIv1} from '../../../apis/apiv1';

// css
import style from './TravelList.module.css';

// component
import {selectedTravelIdState, travelState} from '../../../states/travel';
import {sidebarWidth, travelListViewWidth} from "../../../states/panel/panelWidth";
import {isLoggedInState, travelerState} from '../../../states/traveler';
import NewTravelPill from './NewTravelPill';
import TravelPill from './TravelPill';

// mui
import {Box, Button, IconButton, List, Paper, Typography} from "@mui/material";

// Icon
import {ReactComponent as DragIcon} from 'assets/images/drag_icon.svg';

// etc
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import {Divider} from "@mantine/core";


/**
 * 여행(Travel) 목록을 보여주는 컴포넌트
 */
export default function TravelList() {
    const apiv1 = useAPIv1();

    // Panel Width
    const _sidebarWidth = useRecoilValue(sidebarWidth);
    const _travelListViewWidth = useRecoilValue(travelListViewWidth);

    const isLoggedIn = useRecoilValue(isLoggedInState);
    const [travelData, setTravelData] = useRecoilState(travelState);
    const [isEditingNewTravel, setIsEditingNewTravel] = useState(false);
    const traveler = useRecoilValue(travelerState);
    const [dndState, setDndState] = useState(true); // 드래그 앤 드롭 상태(초기값: true)
    const [selectedId, setSelectedId] = useRecoilState(selectedTravelIdState);

    // GET /api/v1/travel
    useEffect(() => {
        if (!traveler) {
            setTravelData([]);
            return;
        }

        apiv1.get("/travel")
            .then(resp => {
                setTravelData(resp.data);
            })
            .catch(error => {
                console.error(`can not load data: ${error}`);
                setTravelData([]);
            });
    }, [traveler]);

    const onDragEnd = (result) => {
        if (!result.destination) {
            // 1개만 있을 때 옮기면 생기는 오류 방지
            return;
        }
        const sourceIndex = result.source.index;
        const targetIndex = result.destination.index;
        const workValue = travelData.slice();
        const [deletedItem,] = workValue.splice(sourceIndex, 1);
        workValue.splice(targetIndex, 0, deletedItem);

        const newTravelData = workValue.map((t, i) => ({ ...t, "orderKey": i }));
        setTravelData(newTravelData);

        // PUT /api/v1/travel/orderKey
        apiv1.put("/travel/orderKey", newTravelData)
            .then((response) => {
                if (!response.status === 200) {
                    setTravelData([...travelData]);
                }
            });

    }

    const dndHandleClick = () => {
        setDndState(!dndState);
        setSelectedId(null);
    };


    return (
        <Paper
            className={style.root_paper}
            sx={{width: _travelListViewWidth, left: _sidebarWidth}}
        >
            <List className={style.sidebar_list_div}>
                {
                    isLoggedIn ?
                        <>
                            <Box className={style.title_box}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'Black' }}>
                                    나의 여행 둘러보기
                                </Typography>
                            </Box>

                            <div className={style.journey_tool}>
                                <AddBoxOutlinedIcon
                                    sx={{fontSize: '30px'}}
                                    className={style.add_icon}
                                    onClick={() => {
                                        setIsEditingNewTravel(!isEditingNewTravel);
                                        if (dndState === false) {
                                            setDndState(true);
                                        }
                                        setSelectedId(null);
                                    }}
                                />
                                <DragIcon
                                    className={style.drag_icon}
                                    onClick={dndHandleClick}
                                    style={{stroke: !dndState && '#00AEFF'}}
                                />
                            </div>

                            <Divider />

                            {
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="ROOT">
                                        {provided => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {
                                                    travelData.map((t) => {
                                                        return (
                                                            <Draggable draggableId={String(t.orderKey)} index={t.orderKey} key={t.orderKey} isDragDisabled={dndState}>
                                                                {
                                                                    provided => (
                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                             onClick={() => {
                                                                                 if (dndState === false) {
                                                                                     setDndState(true);
                                                                                 }
                                                                             }}
                                                                        >
                                                                            <TravelPill draggable="true" key={t.id} travel={t} />
                                                                        </div>
                                                                    )
                                                                }
                                                            </Draggable>
                                                        )
                                                    })
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            }

                            {
                                isEditingNewTravel && <NewTravelPill onCancel={() => setIsEditingNewTravel(false)}/>
                            }
                        </>
                        :
                        <Box className={style.login_title_box}>
                            로그인 후 이용해주세요. ✈
                        </Box>
                }
            </List>
        </Paper>
    )
}
