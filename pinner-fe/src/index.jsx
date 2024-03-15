import AfterOAuthHandler from "pages/AfterOAuthHandler";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "App";
import PublicShared from "pages/PublicSharedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/shared/:shareCode",
    element: <PublicShared />,
  },
  {
    path: "/afteroauth",
    element: <AfterOAuthHandler />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);
