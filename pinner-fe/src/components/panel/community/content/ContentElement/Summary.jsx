import React, {useEffect, useState} from 'react'

import style from "./Summary.module.css";
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";
import {useAPIv1} from "apis/traveler/apiv1";
import {HTTPStatus} from "apis/admin/apiv1";

export default function Summary() {
    const apiv1 = useAPIv1();

    const [noticeList, setNoticeList] = useState([]);
    const [travelList, setTravelList] = useState([]);
    const [communityList, setCommunityList] = useState([]);
    const [qnaList, setQnaList] = useState([]);


    useEffect(() => {
        const params = {page: 0, size: 3};
        apiv1.get("/community/summary", {params})
            .then((response) => {
                console.log(response);
                if (response.status === HTTPStatus.OK) {
                    setNoticeList(response.data.noticeList);
                    setTravelList(response.data.travelList);
                    setCommunityList(response.data.communityList);
                    setQnaList(response.data.qnaList);
                }
            })
            .catch((error) => {
                console.error("summary데이터를 불러오는데 실패했습니다." + error);
            });
    }, []);

    return (
        <div className={style.wrap}>
            <div className={style.body}>
                <div className={style.box_row}>
                    {/*공지사항*/}
                    <div className={`${style.box_basic} ${style.notice}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>공지사항</Typography>
                        <Divider/>
                        {
                            noticeList && noticeList.length > 0 ? (
                                noticeList.map((notice, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={style.info}>
                                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>{notice.writer}</Typography>
                                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>{notice.date}</Typography>
                                            </div>
                                            <Typography className={style.title} variant="body1">{notice.title}</Typography>
                                        </div>
                                    );
                                })
                            ) : (
                                <Typography sx={{textAlign: 'center', marginTop: '1rem'}}>게시글이 없습니다.</Typography>
                            )
                        }
                    </div>

                    {/*추천여행지*/}
                    <div className={`${style.box_basic} ${style.travel}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>추천 여행지</Typography>
                        <Divider/>
                        {
                            travelList && travelList.length > 0 ? (
                                travelList.map((travel, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={`${style.info} ${style.info_travel}`}>
                                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>{travel.title}</Typography>
                                            </div>
                                            <Typography className={style.title} variant="body1">{travel.content}</Typography>
                                        </div>
                                    );
                                })
                            ) : (
                                <Typography sx={{textAlign: 'center', marginTop: '1rem'}}>게시글이 없습니다.</Typography>
                            )
                        }
                    </div>
                </div>
                <div className={style.box_row}>
                    {/*커뮤니티*/}
                    <div className={`${style.box_basic} ${style.community}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>커뮤니티</Typography>
                        <Divider/>
                        {
                            communityList && communityList.length > 0 ? (
                                communityList.map((community, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={style.info}>
                                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>{community.writer}</Typography>
                                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>{community.date}</Typography>
                                            </div>
                                            <Typography className={style.title} variant="body1">{community.title}</Typography>
                                        </div>
                                    );
                                })
                            ) : (
                                <Typography sx={{textAlign: 'center', marginTop: '1rem'}}>게시글이 없습니다.</Typography>
                            )
                        }
                    </div>

                    {/*Q&A*/}
                    <div className={`${style.box_basic} ${style.qna}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>Q&A</Typography>
                        <Divider/>
                        {
                            qnaList && qnaList.length > 0 ? (
                                qnaList.map((qna, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={style.info}>
                                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>{qna.writer}</Typography>
                                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>{qna.date}</Typography>
                                            </div>
                                            <Typography className={style.title} variant="body1">{qna.title}</Typography>
                                        </div>
                                    );
                                })
                            ) : (
                                <Typography sx={{textAlign: 'center', marginTop: '1rem'}}>게시글이 없습니다.</Typography>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}