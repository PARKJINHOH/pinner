import GoogleLoginBtn from '@/assets/videos/intro-bg-video.mp4';
import { AuthModalVisibility, authModalVisibilityState } from '@/states/modal';
import Typing from 'react-kr-typing-anim';
import { useRecoilState } from 'recoil';

import FindPasswordModal from '@/components/modals/FindPasswordModal';
import LoginModal from '@/components/modals/LoginModal';
import ProfileModal from '@/components/modals/ProfileModal';
import RegisterModal from '@/components/modals/RegisterModal';

import './IntroPage.css';

function IntroPage() {
  const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

  return (
    <div className='relative h-screen'>
      {/* 배경 동영상 */}
      <video autoPlay loop muted className='absolute inset-0 object-cover w-full h-full'>
        {/* https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4 */}
        <source src={GoogleLoginBtn} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      {/* 콘텐츠 */}
      <div className='absolute inset-0 flex flex-col justify-center items-center space-y-4 select-none'>
        <Typing
          className={`text-4xl md:text-6xl text-white`}
          Tag='div'
          preDelay={1000}
          postDelay={1000}
          cursor
          fixedWidth
          onDone={() => console.log('done')}
        >
          여행은 기억이다.
        </Typing>

        <div className='text-white mt-4'>
          {652}번의 여행과 {1463}개의 기억이 보관 됨
        </div>

        <div className='space-x-2 mt-4'>
          <button
            className='backdrop-blur rounded-md backdrop-filter p-3 bg-slate-400 bg-opacity-40 text-white hover:bg-slate-300 hover:bg-opacity-40'
            onClick={() => setModalVisibility(AuthModalVisibility.SHOW_LOGIN)}
          >
            로그인
          </button>
          <button
            className='backdrop-blur rounded-md backdrop-filter p-3 bg-slate-400 bg-opacity-40 text-white hover:bg-slate-300 hover:bg-opacity-40'
            onClick={() => setModalVisibility(AuthModalVisibility.SHOW_REGISTER)}
          >
            회원가입
          </button>
        </div>
      </div>
      {modalVisibility === AuthModalVisibility.SHOW_REGISTER && <RegisterModal />}
      {modalVisibility === AuthModalVisibility.SHOW_LOGIN && <LoginModal />}
      {/* <LoginModal2 /> */}
      {modalVisibility === AuthModalVisibility.SHOW_PROFILE && <ProfileModal />}
      {modalVisibility === AuthModalVisibility.SHOW_FINDPW && <FindPasswordModal />}
    </div>
  );
}

export default IntroPage;
