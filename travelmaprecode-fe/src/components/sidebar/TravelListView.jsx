import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { travelState } from '../../states/travel'
import { isLoggedInState } from '../../states/traveler'
import { useAPIv1 } from '../../apis/apiv1'
import NewTravelPill from './NewTravelPill'
import TravelPill from './TravelPill'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Box, Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';


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
        <ul id='sidebar-list-div' className="flex-column mb-auto list-unstyled ps-0">
            {
                isLoggedIn ?
                    <>
                        <Fab variant="extended" className='mt-3 mb-3 mx-5' size="medium" color="primary" aria-label="add" onClick={(e) => setIsEditingNewTravel(!isEditingNewTravel)}>
                            <AddIcon />
                            새로운 여행
                        </Fab>
                        {
                            isEditingNewTravel && <NewTravelPill onCancle={() => setIsEditingNewTravel(false)} />
                        }

                        {
                            travelData ?
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="ROOT">
                                        {provided => (
                                            <div className="goals-list-wrap" {...provided.droppableProps} ref={provided.innerRef}>
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
                                :
                                <strong className='text-center fw-bold text-secondary'>
                                    Add your first travel.
                                </strong>
                        }
                    </>
                    :
                    <Box sx={{ padding: 2, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'grey' }}>
                        Join us and start your travel ✈
                    </Box>
            }
        </ul>
    )
}
