import AfterOAtuhHandler from 'pages/AfterOAtuhHandler';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from 'App';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/afteroauth",
      element: <AfterOAtuhHandler />,
    },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);