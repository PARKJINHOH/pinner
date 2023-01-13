import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useRecoilState, useRecoilValue } from 'recoil'
import { travelState } from '../../states/travel'
import { isLoggedInState } from '../../states/traveler'
import { useAPIv1 } from '../../apis/apiv1'
import NewTravelPill from './NewTravelPill'
import TravelPill from './TravelPill'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";


export default function TravelListView() {
    const apiv1 = useAPIv1();

    const isLoggedIn = useRecoilValue(isLoggedInState);
    const [travelData, setTravelData] = useRecoilState(travelState);
    const [isEditingNewTravel, setIsEditingNewTravel] = useState(false);

    const onDragEnd = (result) => {

        const sourceIndex = result.source.index;
        const targetIndex = result.destination.index;
        const workValue = travelData.slice();
        const [deletedItem,] = workValue.splice(sourceIndex, 1);
        workValue.splice(targetIndex, 0, deletedItem);

        let i = 0;
        const newTravelData = workValue.map(t => ({ ...t, "orderKey": i++ }));
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
                        <Button className='mb-3' onClick={(e) => setIsEditingNewTravel(!isEditingNewTravel)}>
                            새로운 여행
                        </Button>
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
                    <strong className='text-center fw-bold text-secondary'>
                        Join us and start your travel ✈
                    </strong>
            }
        </ul>
    )
}
