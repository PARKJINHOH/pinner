import { useEffect } from "react";
import {useAPIv1} from "apis/traveler/apiv1";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

// component
import { selectedTravelIdState, travelState } from "states/travel";
import Sidebar from "components/panel/sidebar/Sidebar";
import TravelPage from "pages/TravelPage";

// mui
import { Box, CssBaseline } from "@mui/material";

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
        <TravelPage />
      </Box>
    </Box>
  );
}

export default PublicShared;
