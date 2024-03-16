import React, {useEffect, useState} from 'react';
import {HTTPStatus, useAPIv1} from "apis/admin/apiv1";

// component

// mui

// css
import style from './NoticeWrite.module.css';
import {Box, Paper} from "@mui/material";
import Button from "@mui/joy/Button";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import {Textarea} from "@mantine/core";
import TextField from "@mui/material/TextField";

export default function NoticeWrite() {
    const apiv1 = useAPIv1();
    const navigate = useNavigate();


    function write() {
        console.log("write");
    }

    return (
        <Box sx={{width: '100%'}}>
            <Paper className={style.titlePaper}>
                <Typography level="h3" className={style.title} align="right">제목</Typography>
                <TextField label={'공지사항 제목'} />
            </Paper>
            <Paper className={style.textPaper}>

            </Paper>
            <div className={style.controlArea}>
                <Button className={style.cancelBtn} onClick={() => navigate('/admin/notice', {replace: true})}>취소</Button>
                <Button className={style.writeBtn} onClick={write}>글쓰기</Button>
            </div>

        </Box>
    );
}