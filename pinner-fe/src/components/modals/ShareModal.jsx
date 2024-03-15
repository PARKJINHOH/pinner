import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

// api
import { HTTPStatus, useAPIv1 } from "apis/apiv1";

// css
import style from "./ShareModal.module.css";

// component
import { errorAlert } from "components/alert/AlertComponent";

// mui
import {
  Modal,
  Button,
  Stack,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { Select } from "@mui/joy";
import { wrapShareCodeWithHostname } from "common/share";

export default function ShareModal({ travelId, isOpen, setIsOpen }) {
  const apiv1 = useAPIv1();

  const [duration, setDuration] = useState(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [shareCode, setShareCode] = useState(null);
  const [sharedMemberList, setSharedMemberList] = useState([]);

  useEffect(() => {
    // Get shared member list
    // apiv1.get("/travel/shared/");
  }, []);

  async function onCreateMemberShare(travelId, guestEmail, duration) {
    try {
      const response = await apiv1.post(`/travel/share`, {
        shareType: "MEMBER",
        travelId,
        guestEmail, 
      });

      alert(`${guestEmail}을 초대했습니다.`);
      setIsOpen(false);
        
    } catch (error) {
      alert(error.message);
    }
  }

  async function onCreatePublicShare(travelId, duration) {
    const response = await apiv1.post(`/travel/share`, {
      shareType: "PUBLIC",
      travelId,
      duration,
    });

    const shareCode = response.data.shareCode;
    setShareCode(shareCode);
  }

  return (
    <div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box className={style.register_box}>
          <Typography variant="h5" sx={{ marginBottom: 3 }}>
            여행을 공유합니다.
          </Typography>

          {/* 공유된 목록 - 맴버*/}
          {/* 공유된 목록 - 공개*/}

          {/* 공유하기 - 맴버 */}
          {
            <div>
              <p>초대할 사람의 이메일을 입력해 주세요.</p>
              <input
                placeholder="guest@naver.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              ></input>

              <Button onClick={() => onCreateMemberShare(travelId, guestEmail, duration)}>초대</Button>
            </div>
          }

          {/* 공유하기 - 공개 */}
          {
            false && 
            // 공유 코드가 발급되면 복사 화면을 보여줌
            (shareCode === null ? (
              <div>
                <select
                  type=""
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={duration}
                  label="유효시간"
                  onChange={setDuration}
                >
                  <option value={60 * 60}>1시간</option>
                  <option value={60 * 60 * 24}>1루</option>
                  <option value={60 * 60 * 24 * 7}>1주1</option>
                  <option value={60 * 60 * 24 * 30}>1달</option>
                  <option value={60 * 60 * 24 * 365}>1년</option>
                  <option value={null}>만료하지 않음</option>
                </select>
                <Button onClick={() => onCreatePublicShare(travelId, duration)}>생성</Button>
              </div>
            ) : (
              <div>
                <p className={style.shared_url}>{wrapShareCodeWithHostname(shareCode)}</p>
                <Button onClick={() => navigator.clipboard.writeText(wrapShareCodeWithHostname(shareCode))}>
                  복사
                </Button>
              </div>
            ))
          }
        </Box>
      </Modal>
    </div>
  );
}
