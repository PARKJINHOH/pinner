import React, {useEffect, useState} from 'react';
import {HTTPStatus, useAPIv1} from "apis/admin/apiv1";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import parse from 'html-react-parser';

// component

// mui

// css
import style from './NoticeView.module.css';
import {Box, Paper} from "@mui/material";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/material/TextField";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "@mui/joy/Button";

export default function NoticeView() {
    const apiv1 = useAPIv1();
    const { idx } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState({});

    useEffect(() => {
        getNoticeDetail();
    }, []);

    function getNoticeDetail() {
        apiv1.post("/admin/notice/" + idx)
            .then((response) => {
                console.log(response);
                if (response.status === HTTPStatus.OK) {
                    setBoard(response.data);
                }
            })
            .catch((error) => {
                console.error({"getNoticeDetail-error": error});
            });
    }

    function onSubmit() {


    }

    return (
        <Box sx={{width: '100%'}}>
            <Paper className={style.titlePaper}>
                <Typography level="h3" className={style.title} align="right">제목</Typography>
                <Typography sx={{width: '70%'}}>{board.title}</Typography>
            </Paper>
            <Paper className={style.textPaper}>
                <Typography level="h3" className={style.content} align="right">내용</Typography>
                <div className={style.ckeditor}>
                    {board.content ? parse(board.content) : ''}
                </div>

            </Paper>
            <div className={style.controlArea}>
                <Button onClick={() => navigate('/admin/notice', {replace: true})}>목록</Button>
                <Button onClick={onSubmit}>수정</Button>
            </div>
        </Box>
    );

}