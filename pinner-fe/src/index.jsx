import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// component
import App from 'App';
import App_Admin from 'admin/App_Admin';
import AfterOAuthHandler from 'pages/AfterOAuthHandler';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
        path: "/admin",
        element: <App_Admin />,
    },
    {
      path: "/afteroauth",
      element: <AfterOAuthHandler />,
    },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);