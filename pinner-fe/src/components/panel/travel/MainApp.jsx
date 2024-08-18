import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

// components
import Sidebar from "components/panel/sidebar/Sidebar";
import CommunityPage from "components/panel/community";
import TravelPage from "pages/TravelPage";
import { AuthModalVisibility, authModalVisibilityState } from "../../../states/modal";
import RegisterModal from "../../modals/RegisterModal";
import LoginModal from "../../modals/LoginModal";
import ProfileModal from "../../modals/ProfileModal";
import FindPasswordModal from "../../modals/FindPasswordModal";
import FindNicknameModal from "../../modals/FindNicknameModal";
import {sidebarState} from 'states/sidebar';

// mui
import {Box, CssBaseline} from "@mui/material";

// css
import "react-toastify/dist/ReactToastify.css";

export default function MainApp() {
    const sidebar = useRecoilValue(sidebarState);
  const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Sidebar/>
            <Box sx={{flexGrow: 1}}>
                {
                    (() => {
                        switch (sidebar) {
                            case 'TRAVEL':
                                return <TravelPage/>;
                            case 'COMMUNITY':
                                return <CommunityPage/>;
                            default:
                                return <TravelPage/>;
                        }
                    })()
                }
            </Box>
          {modalVisibility === AuthModalVisibility.SHOW_REGISTER && <RegisterModal />}
          {modalVisibility === AuthModalVisibility.SHOW_LOGIN && <LoginModal />}
          {modalVisibility === AuthModalVisibility.SHOW_PROFILE && <ProfileModal />}
          {modalVisibility === AuthModalVisibility.SHOW_FINDPW && <FindPasswordModal />}
          {modalVisibility === AuthModalVisibility.SHOW_FINDNICKNAME && <FindNicknameModal />}
        </Box>
    )
}
