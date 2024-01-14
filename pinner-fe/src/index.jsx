import ReactDOM from 'react-dom/client';
import {RecoilRoot} from 'recoil';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

// component
import App from 'App';
import AdminLogin from 'admin/AdminLogin';
import AfterOAuthHandler from 'pages/AfterOAuthHandler';
import Dashboard from "admin/dashboard/Dashboard";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
        path: "/admin/login",
        element: <AdminLogin />,
    },
    {
        path: "/admin/dashboard",
        element: <Dashboard />,
    },
    {
      path: "/afteroauth",
      element: <AfterOAuthHandler />,
    },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RecoilRoot>
        <RouterProvider router={router}/>
    </RecoilRoot>
);