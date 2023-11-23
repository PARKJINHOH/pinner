import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

// api
import {HTTPStatus, useAPIv1} from 'apis/apiv1';

// css
import style from './NewTravelPill.module.css';

// component
import { travelState } from 'states/travel';

// mui
import { AspectRatio } from "@mui/joy";
import Input from '@mui/joy/Input';
import { Button, IconButton, Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";

// icon
import ModeOfTravelOutlinedIcon from '@mui/icons-material/ModeOfTravelOutlined';
import WrongLocationOutlinedIcon from '@mui/icons-material/WrongLocationOutlined';

// etc
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

/**
 * 'Click to add new Travel'클릭시 나오는 컴포넌트
 * @param onCancel
 */
export default function NewTravelPill({ onCancel }) {
    const apiv1 = useAPIv1();

    const [title, setTitle] = useState("");
    const [travels, setTravels] = useRecoilState(travelState);


    const onTravelTitleChange = useCallback((newTitle) => {
        const titleLength = 15;

        const newTitleTrimStart = newTitle.trimStart();
        if (newTitleTrimStart.length > titleLength) {
            toast.error(`여행제목은 ${titleLength}글자 이하여야 합니다.`);
        }
        if (newTitleTrimStart.length <= titleLength) {
            setTitle(newTitleTrimStart);
        }
    }, []);

    /**
     * 이름 변경 중 ESC키를 누르면 취소를, 엔터를 누르면 적용한다.
     * @param {KeyboardEvent} e
     */
    async function onKeyDownRename(e) {
        const isEsc = e.key === "Escape";
        const isEnter = e.key === "Enter";
        const isMouseClick = e.type === "click";

        if (isEsc) {
            onCancel();
        }

        if (isEnter || isMouseClick) {
            e.preventDefault();
            if (title.trim() === "" || title.trim().length < 2) {
                toast.error("여행제목을 2글자 이상 입력해주세요.");
                return;
            }
            if (isEnter || isMouseClick) {
                await apiv1.post("/travel", JSON.stringify({ title: title.trim() }))
                    .then((response) => {
                        setTravels(response.data);
                    });
            }
            onCancel();
        }
    }

    return (
        <>
            <Stack spacing={1} sx={{ marginTop: '20px' }}>
                <AspectRatio ratio="16/10">
                    <Skeleton variant="rectangular" />
                </AspectRatio>
                <div className={style.travel_title_group}>
                    <Input
                        sx={{ width: '90%' }}
                        placeholder="2023년 유럽 여행"
                        startDecorator={<ModeOfTravelOutlinedIcon />}
                        endDecorator={<Button onClick={onKeyDownRename} >저장</Button>}
                        value={title}
                        onChange={e => onTravelTitleChange(e.target.value)}
                        onKeyDown={onKeyDownRename}
                    />
                    <IconButton
                        aria-label="delete"
                        variant="solid"
                        color="error"
                        onClick={onCancel}
                    >
                        <WrongLocationOutlinedIcon />
                    </IconButton>
                </div>
            </Stack>
        </>

    )
}
