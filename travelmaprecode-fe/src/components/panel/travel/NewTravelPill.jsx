import React, {useState} from 'react';
import {useRecoilState} from 'recoil';

// api
import {useAPIv1} from '../../../apis/apiv1';

// css
import style from './NewTravelPill.module.css';

// component
import {travelState} from '../../../states/travel';

// mui
import Stack from "@mui/material/Stack";
import Input from '@mui/joy/Input';
import {Button, Skeleton} from "@mui/material";
import {AspectRatio} from "@mui/joy";

// icon
import WrongLocationOutlinedIcon from '@mui/icons-material/WrongLocationOutlined';
import ModeOfTravelOutlinedIcon from '@mui/icons-material/ModeOfTravelOutlined';

// etc
import toast from "react-hot-toast";

/**
 * 'Click to add new Travel'클릭시 나오는 컴포넌트
 * @param onCancel
 */
export default function NewTravelPill({onCancel}) {
    const apiv1 = useAPIv1();
    const [title, setTitle] = useState("");
    const [travels, setTravels] = useRecoilState(travelState);


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
                const resp = await apiv1.post("/travel", JSON.stringify({title: title.trim()}));
                const travel = resp.data;
                setTravels([...travels, travel]);
            }
            onCancel();
        }
    }

    return (
        <>
            <Stack spacing={1} sx={{marginTop: '20px'}}>
                <AspectRatio ratio="16/10">
                    <Skeleton variant="rectangular"/>
                </AspectRatio>
                <div className={style.travel_title_group}>
                    <Input
                        sx={{width: '90%'}}
                        label="여행제목을 적어주세요(10자)"
                        startDecorator={<ModeOfTravelOutlinedIcon />}
                        endDecorator={<Button onClick={onKeyDownRename} >저장</Button>}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onKeyDown={onKeyDownRename}
                    />
                    <WrongLocationOutlinedIcon
                        sx={{marginLeft: 'auto', cursor: 'pointer'}}
                        onClick={onCancel}
                    />
                </div>
            </Stack>
        </>

    )
}
