import { useEffect } from "react";

// component
import Sidebar from "components/panel/sidebar/Sidebar";
import "pages/BasePage";
import BasePage from "pages/BasePage";

// mui
import { Box, CssBaseline } from "@mui/material";
import { useAPIv1 } from "apis/apiv1";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { selectedTravelIdState, travelState } from "states/travel";

function PublicShared() {
  const apiv1 = useAPIv1();

  const setTravels = useSetRecoilState(travelState);
  const setSelectedTravel = useSetRecoilState(selectedTravelIdState);

  const { shareCode } = useParams();

  useEffect(() => {
    apiv1.get(`/travel/share/${shareCode}`).then((response) => {
      console.log(response.data);
      setTravels([response.data]);
      setSelectedTravel(response.data.id);
    });
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <BasePage />
      </Box>
    </Box>
  );
}

export default PublicShared;
