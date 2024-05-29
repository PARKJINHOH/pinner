import { postLogin } from '@/apis/auth';
import { InputChanged } from '@/apis/helper_types';
import GoogleLoginBtn from '@/assets/images/login_icon_google.png';
import NaverLoginBtn from '@/assets/images/login_icon_naver.png';
import { AuthModalVisibility, authModalVisibilityState } from '@/states/modal';
import { useDoLogin } from '@/states/traveler';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

  const doLogin = useDoLogin();

  const onEmailHandler: InputChanged = (event) => setEmail(event.currentTarget.value);
  const onPasswordHandler: InputChanged = (event) => setPassword(event.currentTarget.value);

  const onSubmit = async () => {
    if (email == null || email == '' || email == undefined) {
      setErrorMessage('이메일을 확인해주세요.');
      return;
    }

    if (password == null || password == '' || password == undefined) {
      setErrorMessage('비밀번호 확인해주세요.');
      return;
    }

    postLogin({ email, password })
      .then((response) => {
        const payload = response.data;

        doLogin({
          email: payload.email,
          nickname: payload.nickname,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          signupServices: payload.signupServices,
        });

        // 로그인 모달 감춤
        setModalVisibility(AuthModalVisibility.HIDE_ALL);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error.response.data.message);
      });
  };

  const EmailIcon = (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-4 h-4 opacity-70'>
      <path d='M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z' />
      <path d='M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z' />
    </svg>
  );

  const PasswordIcon = (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-4 h-4 opacity-70'>
      <path
        fillRule='evenodd'
        d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
        clipRule='evenodd'
      />
    </svg>
  );

  return (
    <dialog
      id='login_modal'
      className='modal modal-bottom sm:modal-middle'
      open={modalVisibility === AuthModalVisibility.SHOW_LOGIN}
      onClose={() => setModalVisibility(AuthModalVisibility.HIDE_ALL)}
    >
      <div className='modal-box flex flex-col gap-4'>
        <h3 className='font-bold text-lg select-none'>Pinner에 오신것을 환영합니다!</h3>

        <label className='input input-bordered flex items-center gap-2'>
          {EmailIcon}
          <input onChange={onEmailHandler} type='text' className='grow' placeholder='이메일' />
        </label>

        <label className='input input-bordered flex items-center gap-2'>
          {PasswordIcon}
          <input
            onChange={onPasswordHandler}
            type='password'
            className='grow'
            placeholder='비밀번호'
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          />
        </label>

        <button onClick={onSubmit} className='btn'>
          로그인
        </button>

        {/* 비밀번호 찾기 */}
        <button onClick={() => setModalVisibility(AuthModalVisibility.SHOW_FINDPW)} className='text-xs select-none'>
          비밀번호 찾기
        </button>

        {/* 오류 메시지 */}
        {errorMessage && (
          <div role='alert' className='alert alert-error'>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 소셜 로그인 */}
        <div>
          <div className='divider select-none'>소셜 로그인</div>
          <div className='flex gap-2 justify-center'>
            <button
              onClick={() => (window.location.href = '/oauth2/authorization/naver')}
              className='btn btn-circle btn-outline'
            >
              <img src={NaverLoginBtn} alt='NaverLoginBtn' />
            </button>
            <button
              onClick={() => (window.location.href = '/oauth2/authorization/google')}
              className='btn btn-circle btn-outline'
            >
              <img src={GoogleLoginBtn} alt='GoogleLoginBtn' />
            </button>
          </div>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>닫기</button>
      </form>
    </dialog>
  );
}
