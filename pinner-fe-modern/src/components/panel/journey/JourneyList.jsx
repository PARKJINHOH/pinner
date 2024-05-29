import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

// api
import { useAPIv1 } from 'apis/apiv1';

// component
import { representPhotoIdOfTravel } from 'common/travelutils';
import RepresentImage from 'components/panel/RepresentImage.jsx';
import JourneyPill from 'components/panel/journey/JourneyPill';
import NewJourneyPill from 'components/panel/journey/NewJourneyPill';
import { journeyListViewWidth, sidebarWidth, travelListViewWidth } from 'states/panel/panelWidth';
import { selectedTravelIdState, travelState } from 'states/travel';

// mui
import { Divider } from '@mantine/core';
import { Tooltip } from '@mui/joy';
import { Alert, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';

// icon & images
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';
import { ReactComponent as EditIcon } from 'assets/images/edit-outline-icon.svg';

// etc
import { Share } from '@mui/icons-material';
import ShareModal from 'components/modals/ShareModal';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

/**
 * Journey 정보를 보여주는 컴포넌트
 * @param {Travel} travel
 */
export default function JourneyList({ travel }) {
  const EditMode = {
    DEFAULT: '',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
  };

  const apiv1 = useAPIv1();
  const textFieldRef = useRef(null);

  // Panel Width
  const _sidebarWidth = useRecoilValue(sidebarWidth);
  const _travelListViewWidth = useRecoilValue(travelListViewWidth);
  const _journeyPanelWidth = useRecoilValue(journeyListViewWidth);
  const [selectedTravelId, setSelectedTravelId] = useRecoilState(selectedTravelIdState);
  const setTravels = useSetRecoilState(travelState);
  const [editMode, setEditMode] = useState(EditMode.DEFAULT);
  const [isEditingNewJourneyState, setIsEditingNewJourneyState] = useState(false);

  // 공유 모달
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const sortedJourneys = [...travel.journeys].sort((a, b) => a.date.localeCompare(b.date));

  let startDate = '';
  let endDate = '';
  if (sortedJourneys && sortedJourneys.length > 0) {
    startDate = dayjs(sortedJourneys[0].date).format('YYYY년 MM월 DD일');
    endDate = dayjs(sortedJourneys[sortedJourneys.length - 1].date).format('YYYY년 MM월 DD일');
  }

  useEffect(() => {
    if (editMode === EditMode.EDIT && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [editMode]);

  /**
   * 이름 변경 중 ESC키를 누르면 취소를, 엔터를 누르면 적용한다.
   * @param {KeyboardEvent} e
   */
  async function onKeyDownRename(e) {
    const isEsc = e.key === 'Escape';
    const isEnter = e.key === 'Enter';

    if (isEsc || isEnter) {
      e.preventDefault();
      if (isEnter) {
        const titleJson = JSON.stringify({
          title: e.target.value.trim(),
        });

        await apiv1.patch('/travel/' + travel.id, titleJson).then((response) => {
          setTravels(response.data);
        });
      }
      setEditMode(EditMode.DEFAULT);
    }
  }

  /**
   *
   * @param {Object} obj
   * @param {Travel} obj.travel
   * @param {function (): void} obj.onClick
   *
   * @returns {JSX.Element}
   */
  function RepresentImageWithButton({ travel }) {
    const photo = representPhotoIdOfTravel(travel);

    if (photo === null) {
      return <div className={style.main_preview} />;
    }

    return (
      <div style={{ aspectRatio: 16 / 10 }}>
        <RepresentImage photo={photo}></RepresentImage>
      </div>
    );
  }

  return (
    <>
      <Paper
        className={style.root_paper}
        sx={{ width: _journeyPanelWidth, left: _sidebarWidth + _travelListViewWidth }}
      >
        <div>
          <RepresentImageWithButton travel={travel} />

          <div align='center' className={style.travel_title_group}>
            {editMode === EditMode.EDIT ? (
              <>
                <TextField
                  inputProps={{ maxLength: 10, style: { fontSize: 20 } }}
                  style={{ width: 250 }}
                  defaultValue={travel.title}
                  variant='standard'
                  onKeyDown={onKeyDownRename}
                  onBlur={() => setEditMode(EditMode.DEFAULT)}
                  inputRef={textFieldRef}
                />
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>{travel.title}</Typography>
              </>
            )}
            <Typography variant='subtitle1'>
              {sortedJourneys && sortedJourneys.length > 0 ? startDate + ' ~ ' + endDate : ''}
            </Typography>
          </div>

          <div className={style.journeys_tool}>
            {/* 뒤로 가기 */}
            <IconButton className={style.arrow_icon_btn} onClick={() => setSelectedTravelId('')}>
              <ArrowBackIosOutlinedIcon sx={{ fontSize: '30px' }} />
            </IconButton>

            {/* 툴셋, 오른정렬, 공유 받은게 아닐 경우에만 보여줌 */}
            {travel.sharedInfo ? (
              <p>{`${travel.sharedInfo.hostNickname}이(가) 공유`}</p>
            ) : (
              <div className={style.journeys_tool_right}>
                <Tooltip title='공유' variant='outlined' size='lg'>
                  <Share
                    sx={{ fontSize: '30px' }}
                    className={style.add_icon}
                    onClick={() => setIsShareModalOpen(true)}
                  />
                </Tooltip>

                <Tooltip title='여정 추가' variant='outlined' size='lg'>
                  <AddBoxOutlinedIcon
                    sx={{ fontSize: '30px' }}
                    className={style.add_icon}
                    onClick={() => {
                      setIsEditingNewJourneyState(!isEditingNewJourneyState);
                    }}
                  />
                </Tooltip>

                <Tooltip title='여행제목 수정' variant='outlined' size='lg'>
                  <EditIcon
                    className={style.edit_icon}
                    style={{
                      pointerEvents: editMode === EditMode.EDIT ? 'none' : 'auto',
                      fill: editMode === EditMode.EDIT && 'gray',
                    }}
                    onClick={() => {
                      setEditMode((prevMode) => (prevMode === EditMode.EDIT ? EditMode.DEFAULT : EditMode.EDIT));
                    }}
                  />
                </Tooltip>

                <Tooltip title='여정 삭제' variant='outlined' size='lg'>
                  <DisabledByDefaultOutlinedIcon
                    sx={{ fontSize: '30px' }}
                    className={style.del_icon}
                    style={{ color: editMode === EditMode.DELETE && 'red' }}
                    onClick={() => {
                      if (travel.journeys.length === 0) {
                        toast('삭제할 여정이 없습니다.');
                      } else {
                        setEditMode((prevMode) => (prevMode === EditMode.DELETE ? EditMode.DEFAULT : EditMode.DELETE));
                      }
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {travel.journeys.length !== 0 ? (
          travel.journeys.map((journey) => (
            <JourneyPill
              key={journey.id}
              travelId={travel.id}
              editMode={editMode}
              setEditMode={setEditMode}
              journey={journey}
            />
          ))
        ) : (
          <div className={style.no_journeys}>
            <Stack sx={{ width: '80%' }}>
              <Alert variant='outlined' severity='info' sx={{ justifyContent: 'center' }}>
                여정을 추가해주세요.
              </Alert>
            </Stack>
          </div>
        )}
      </Paper>

      {
        /* 여정 글쓰기 */
        isEditingNewJourneyState && (
          <NewJourneyPill travel={travel} editingCancel={() => setIsEditingNewJourneyState(false)} />
        )
      }

      {/* 공유 모달 */}
      {isShareModalOpen && (
        <ShareModal travelId={travel.id} isOpen={isShareModalOpen} setIsOpen={setIsShareModalOpen}></ShareModal>
      )}
    </>
  );
}
