import React, { useEffect, useState } from "react";

import style from "./Community.module.css";
import { useAPIv1 } from "apis/traveler/apiv1";
import { HTTPStatus } from "apis/admin/apiv1";
import Button from "@mui/joy/Button";

export default function Community() {
  const apiv1 = useAPIv1();

  const [noticeList, setNoticeList] = useState([]);
  const [travelList, setTravelList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [qnaList, setQnaList] = useState([]);


  useEffect(() => {
    const params = { page: 0, size: 3 };
    apiv1.get("/community/summary", { params })
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
      <div className={style.banner}>

      </div>
      <div className={style.tab}>
        <Button className={style.tab_button}>
          작성하기
        </Button>
        <Button className={style.tab_button}>
          작성하기
        </Button>
      </div>
      <div className={style.content}>
      </div>
    </div>
  );
}