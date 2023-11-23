import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

// api
import { HTTPStatus, useAPIv1 } from 'apis/apiv1';

// css
import style from './TravelList.module.css';

// component
import { sidebarWidth, travelListViewWidth } from "states/panel/panelWidth";
import { selectedTravelIdState, travelState } from 'states/travel';
import { isLoggedInState, travelerState } from 'states/traveler';
import NewTravelPill from 'components/panel/travel/NewTravelPill';
import TravelPill from 'components/panel/travel/TravelPill';

// mui
import { Divider } from "@mantine/core";
import { Tooltip } from "@mui/joy";
import { Alert, Box, List, Paper, Stack, Typography } from "@mui/material";

// Icon
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { ReactComponent as DragIcon } from 'assets/images/drag_icon.svg';

// etc
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


/**
 * 여행(Travel) 목록을 보여주는 컴포넌트
 */
export default function TravelList() {
    const EditMode = {
        DEFAULT: '',
        ADD: 'ADD',
        EDIT: 'EDIT',
        DELETE: 'DELETE',
    }
    const apiv1 = useAPIv1();
    const [editMode, setEditMode] = useState(EditMode.DEFAULT);

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
            .then(response => {
                setTravelData(response.data);
            })
            .catch(error => {
                console.error(error.message);
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

        apiv1.put("/travel/orderKey", newTravelData)
            .then((response) => {
                setTravelData(response.data);
            });

    }

    const dndHandleClick = () => {
        setDndState(!dndState);
        setSelectedId(null);
    };

    return (
        <Paper
            className={style.root_paper}
            sx={{ width: _travelListViewWidth, left: _sidebarWidth }}
        >
            <List className={style.sidebar_list_div}>
                {
                    isLoggedIn ?
                        <>
                            <Box className={style.title_box}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: 'Black' }}>
                                    당신의 여행을 pin 하다.
                                </Typography>
                            </Box>

                            <div className={style.travel_tool}>
                                <Tooltip title="순서변경" variant="outlined" size="lg">
                                    <DragIcon
                                        className={style.drag_icon}
                                        onClick={dndHandleClick}
                                        style={{ stroke: !dndState && '#00AEFF' }}
                                    />
                                </Tooltip>
                                <Tooltip title="여행 추가" variant="outlined" size="lg">
                                    <AddBoxOutlinedIcon
                                        sx={{ fontSize: '30px' }}
                                        className={style.add_icon}
                                        onClick={() => {
                                            setEditMode(prevMode =>
                                                prevMode === EditMode.ADD ? EditMode.DEFAULT : EditMode.ADD
                                            );
                                            if (dndState === false) {
                                                setDndState(true);
                                            }
                                            setSelectedId(null);
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="여행 삭제" variant="outlined" size="lg">
                                    <DisabledByDefaultOutlinedIcon
                                        sx={{ fontSize: '30px' }}
                                        className={style.del_icon}
                                        style={{ color: editMode === EditMode.DELETE && 'red' }}
                                        onClick={() => {
                                            setSelectedId(null);
                                            if (travelData.length === 0) {
                                                toast('삭제할 여행이 없습니다.');
                                            } else {
                                                setEditMode(prevMode =>
                                                    prevMode === EditMode.DELETE ? EditMode.DEFAULT : EditMode.DELETE
                                                );
                                            }
                                        }}
                                    />
                                </Tooltip>
                            </div>

                            <Divider />

                            {
                                travelData.length !== 0 ?
                                    <>
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <Droppable droppableId="ROOT">
                                                {provided => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                                        {
                                                            travelData.map((travel, idx) => {
                                                                return (
                                                                    <Draggable key={travel.orderKey} draggableId={String(travel.orderKey)} index={idx} isDragDisabled={dndState}>
                                                                        {
                                                                            provided => (
                                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                                    onClick={() => {
                                                                                        if (dndState === false) {
                                                                                            setEditMode(EditMode.DEFAULT);
                                                                                            setDndState(true);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <TravelPill draggable="true" key={travel.id} editMode={editMode} setEditMode={setEditMode} travel={travel} />
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
                                    </>
                                    :
                                    <>
                                        {
                                            editMode === EditMode.DEFAULT && (
                                                <div className={style.no_travels}>
                                                    <Stack sx={{ width: '80%' }}>
                                                        <Alert variant="outlined" severity="info" sx={{ justifyContent: 'center' }}>
                                                            여행을 추가해주세요.
                                                        </Alert>
                                                    </Stack>
                                                </div>
                                            )
                                        }
                                    </>
                            }
                            {
                                editMode === EditMode.ADD && <NewTravelPill onCancel={() => setEditMode(EditMode.DEFAULT)} />
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
