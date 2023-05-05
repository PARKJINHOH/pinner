import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { travelState } from '../../states/travel'
import { isLoggedInState } from '../../states/traveler'
import { useAPIv1 } from '../../apis/apiv1'
import NewTravelPill from './NewTravelPill'
import TravelPill from './TravelPill'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {Box, Button, Fab, List, Paper, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

export default function TravelListView() {
    const apiv1 = useAPIv1();

    const isLoggedIn = useRecoilValue(isLoggedInState);
    const [travelData, setTravelData] = useRecoilState(travelState);
    const [isEditingNewTravel, setIsEditingNewTravel] = useState(false);

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


    return (
        <List id='sidebar-list-div' sx={{ mb: 'auto'}}>
            {
                isLoggedIn ?
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ margin: '10px', fontSize: '20px', fontWeight: 'bold', color: 'Black' }}>
                                나의 여행 둘러보기
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button>
                                <SortByAlphaIcon />
                            </Button>
                        </Box>

                        <Box sx={{
                            backgroundColor: '#cecece', borderRadius: '10px', cursor: 'pointer',
                            height: '200px', margin: '10px', padding: '10px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"
                        }}
                             onClick={(e) => setIsEditingNewTravel(!isEditingNewTravel)}
                        >
                            <AddIcon sx={{ fontSize: '60px' }} />
                            <Typography >
                                Click to add new Travel
                            </Typography>
                        </Box>

                        {
                            isEditingNewTravel && <NewTravelPill onCancle={() => setIsEditingNewTravel(false)} />
                        }

                        {
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="ROOT">
                                    {provided => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                travelData.map((t) => {
                                                    return (
                                                        <Draggable draggableId={String(t.orderKey)} index={t.orderKey} key={t.orderKey}>
                                                            {
                                                                provided => (
                                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                    </>
                    :
                    <Box sx={{ padding: 2, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'grey' }}>
                        로그인 후 이용해주세요. ✈
                    </Box>
            }
        </List>
    )
}
