import React, {useEffect, useState} from 'react'
import style from "./Summary.module.css";
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";
import {useAPIv1} from "apis/traveler/apiv1";
import {HTTPStatus} from "apis/admin/apiv1";

export default function Content() {
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
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>관리자</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.06.04</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">v1.2.1 업데이트 소식!</Typography>
                        </div>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>관리자</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.05.04</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">v1.2.0 업데이트 소식!</Typography>
                        </div>
                    </div>

                    {/*추천여행지*/}
                    <div className={`${style.box_basic} ${style.travel}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>추천 여행지</Typography>
                        <Divider/>
                        <div>
                            <div className={`${style.info} ${style.info_travel}`}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>일본 오사카</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">일본여행의 중심지, 음식과 문화 다양한 여행 선택지가 존재하는곳</Typography>
                        </div>
                        <div>
                            <div className={`${style.info} ${style.info_travel}`}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>튀르키예 이스탄불</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">서양과 동양이 함께 있는 나라, 먹는 재미와 이국적인 도심을 느낄 수 있는 곳</Typography>
                        </div>
                        <div>
                            <div className={`${style.info} ${style.info_travel}`}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>미국 로스엔젤레스</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">미국 서부의 메인도시, 호텔과 카지노 뿌시는 여행</Typography>
                        </div>
                    </div>
                </div>
                <div className={style.box_row}>
                    {/*커뮤니티*/}
                    <div className={`${style.box_basic} ${style.community}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>커뮤니티</Typography>
                        <Divider/>
                        <div>
                            <div className={style.info}>
                            <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>율리시스SS</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.04.24</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">일본여행 갔다 왔는데 여기 맛있더라궁! 오사카 스시집 추천하는 곳입니다.</Typography>
                        </div>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>판저크루투</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.04.23</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">여행 커뮤니티가 생겨서 너무 좋아요!</Typography>
                        </div>
                    </div>

                    {/*Q&A*/}
                    <div className={`${style.box_basic} ${style.qna}`}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>Q&A</Typography>
                        <Divider/>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>율리시스SS</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.04.24</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">일본 현지에서 유심 어디서 구할 수 있을까요?</Typography>
                        </div>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>홍길동</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.02.24</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">베트남에서 사기당했어요! 어떻게 해야하나요?</Typography>
                        </div>
                        <div>
                            <div className={style.info}>
                                <Typography sx={{fontSize: '1.1rem', fontWeight: 'bold'}}>홍길순</Typography>
                                <Typography sx={{fontSize: '1rem', marginLeft: 'auto'}}>2024.01.24</Typography>
                            </div>
                            <Typography className={style.title} variant="body1">호주 3박 4일 여행 일정 어떤가요?</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}