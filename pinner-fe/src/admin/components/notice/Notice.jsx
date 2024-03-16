import React, {useEffect, useState} from 'react';
import {HTTPStatus, useAPIv1} from "apis/admin/apiv1";
import {Navigate, useNavigate} from "react-router-dom";

// component

// mui
import {Box, Paper, TableContainer} from "@mui/material";
import Button from "@mui/joy/Button";

// css
import style from './Notice.module.css';

export default function Notice() {
    const apiv1 = useAPIv1();
    const navigate = useNavigate();

    const [pageNo, setPageNo] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(5); // 페이지 사이즈
    const [totalPageCnt, setTotalPageCnt] = useState(0); // 전체 페이지 수

    const [noticeList, setNoticeList] = useState([]);

    const [boardList, setBoardList] = useState([]);
    const [pageList, setPageList] = useState([]);

    useEffect(() => {
        getNoticeList();
    }, []);

    function getNoticeList() {
        const params = {page: pageNo, size: pageSize};
        apiv1.get("/admin/notice", {params})
            .then((response) => {
                console.log(response);
                if (response.status === HTTPStatus.OK) {

                }
            })
            .catch((error) => {
                console.error({"getNoticeList-error": error});
            });
    }

    function writeNotice() {
        navigate("/admin/notice/write");
    }

    return (
        <Box sx={{width: '100%'}}>
            <Paper className={style.search}>

            </Paper>
            <Paper className={style.noticeList}>

            </Paper>
            <Button className={style.writeMoveBtn} onClick={writeNotice}>글쓰기</Button>
        </Box>
    //     https://mui.com/material-ui/react-pagination/
    );
}
