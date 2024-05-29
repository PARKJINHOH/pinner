import { HomeIcon as HomeIconOutline, MagnifyingGlassIcon, MapIcon } from '@heroicons/react/24/outline';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import BasePage from './components/panel/BasePage';
import MenuBar from './components/panel/sidebar/MenuBar';
import './index.css';
import IntroPage from './pages/IntroPage';
import { LoginSplitter } from './pages/Splitter';
import UserSettingPage from './pages/UserSettingPage';

const routes = [
  {
    url: '/',
    name: '홈',
    icon: <HomeIconOutline className='h-7 w-7' />,
  },
  {
    url: '/maps',
    name: '지도',
    icon: <MapIcon className='h-7 w-7' />,
  },
  {
    url: '/explor',
    name: '탐색',
    icon: <MagnifyingGlassIcon className='h-7 w-7' />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LoginSplitter
        whenLoggedIn={
          <div className='flex flex-col md:flex-row-reverse w-screen h-screen'>
            <div className='w-full h-full bg-yellow-200'></div>
            <MenuBar menus={routes}></MenuBar>
          </div>
        }
        orElse={<IntroPage />}
      ></LoginSplitter>
    ),
  },
  {
    path: '/maps',
    element: (
      <div className='flex flex-col md:flex-row-reverse w-screen h-screen'>
        <BasePage></BasePage>
        <MenuBar menus={routes}></MenuBar>
      </div>
    ),
  },
  {
    path: '/explor',
    element: (
      <div className='flex flex-col md:flex-row-reverse w-screen h-screen'>
        <div className='bg-yellow'></div>
        <MenuBar menus={routes}></MenuBar>
      </div>
    ),
  },
  {
    path: '/settings',
    element: (
      <LoginSplitter
        whenLoggedIn={
          <div className='flex flex-col md:flex-row-reverse w-screen h-screen'>
            <UserSettingPage></UserSettingPage>
            <MenuBar menus={routes}></MenuBar>
          </div>
        }
        orElse={<IntroPage />}
      ></LoginSplitter>
    ),
  },
  // {
  //   path: "/shared/:shareCode",
  //   element: <PublicShared />,
  // },
  // {
  //   path: "/afteroauth",
  //   element: <AfterOAuthHandler />,
  // },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <link
      rel='stylesheet'
      as='style'
      crossOrigin={''}
      href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css'
    />
    <RouterProvider router={router} />
  </RecoilRoot>
);
