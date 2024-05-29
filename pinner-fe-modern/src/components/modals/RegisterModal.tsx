import { useState } from 'react';
import { useRecoilState } from 'recoil';

// api
import { useAPIv1 } from '@/apis/apiv1';

// css

// component
import { postRegister } from '@/apis/auth';
import { AuthModalVisibility, authModalVisibilityState } from '@/states/modal';
import { Timer } from './Timer';

// mui

// image

export default function RegisterModal() {
  const apiv1 = useAPIv1();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [modalVisibility, setModalVisibility] = useRecoilState(authModalVisibilityState);

  const [errorMessage, setErrorMessage] = useState('');

  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [emailAuthenticationCode, setEmailAuthenticationCode] = useState('');
  const [isEmailAuthentication, setIsEmailAuthentication] = useState(false);
  const [isFinalEmailAuthentication, setFinalIsEmailAuthentication] = useState(false);

  function validInputs() {
    // if문 순서 중요

    if (!nickname || nickname.length < 2 || nickname.length > 6) {
      return '닉네임은 2~6자 이내로 적어주세요.';
    } else if (!/^\S+$/.test(nickname)) {
      return '닉네임은 공백을 사용할 수 없습니다.';
    } else if (!/^[a-zA-Z가-힣0-9]+$/.test(nickname)) {
      return '닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.';
    }

    if (!email) {
      return '이메일을 확인해주세요.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return '이메일 형식이 올바르지 않습니다.';
    }

    if (!password || !confirmPassword) {
      return '비밀번호 확인해주세요.';
    } else if (!/\d+/.test(password)) {
      return '비밀번호는 최소 하나 이상의 숫자를 포함해야 합니다.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return '비밀번호는 최소 하나 이상의 소문자와 대문자를 포함해야 합니다.';
    } else if (!/[!@#$%^&*()_+~`\-={}[\]:";'<>,.?\\/]+/.test(password)) {
      return '비밀번호는 최소 하나 이상의 특수문자를 포함해야 합니다.';
    } else if (!/.{8,}/.test(password)) {
      return '비밀번호는 최소 8자 이상이어야 합니다.';
    } else if (password !== confirmPassword) {
      return '비밀번호와 비밀번호확인은 같아야 합니다.';
    }
  }

  function clearInputs() {
    setEmail('');
    setPassword('');
    setNickname('');
    setConfirmPassword('');
  }

  /**
   * 이메일 인증 발송 여부
   * @returns {Promise<void>}
   */
  function sendEmail() {
    setLoading(true);
    apiv1
      .post('/email', JSON.stringify({ email: email.trim() }))
      .then(() => {
        setIsEmailAuthentication(true);
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setEmailSendLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  /**
   * 이메일 인증
   * @returns {Promise<void>}
   */
  async function getEmailAuthentication() {
    if (emailAuthenticationCode.trim().length === 0) {
      setErrorMessage('이메일 인증 코드를 입력해주세요.');
      return;
    }

    const isEmailAuthCheck = await apiv1
      .post('email/check', JSON.stringify({ email: email.trim(), emailCode: emailAuthenticationCode.trim() }))
      .then((response) => {
        setErrorMessage('');
        return true;
      })
      .catch((error) => {
        setErrorMessage(error.message);
        return false;
      });
    setFinalIsEmailAuthentication(isEmailAuthCheck);
  }

  /**
   * 회원가입
   * @param event
   * @returns {Promise<void>}
   */
  const onSubmit = async (event) => {
    if (!isEmailAuthentication) {
      setErrorMessage('이메일 인증을 받아주세요.');
      return;
    }
    event.preventDefault();

    // validation
    const errorMessage = validInputs();
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    // prepare data and send request
    const data = JSON.stringify({
      email,
      password,
      nickname,
      signupServices: 'Web',
    });

    postRegister(data)
      .then((response) => {
        alert(response.data);

        setModalVisibility(AuthModalVisibility.SHOW_LOGIN);
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <div>
      <dialog id='my_modal_1' className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Hello!</h3>
          <p className='py-4'>Press ESC key or click the button below to close</p>
          <div className={style.register_box}>
            <p className='divider mb-3'>Pinner에 오신것을 환영합니다.</p>
            <p sx={{ marginBottom: 2 }}>회원가입에 필요한 정보를 입력해주세요</p>

            <input
              label='닉네임'
              variant='outlined'
              inputProps={{ maxLength: 6 }}
              value={nickname}
              onChange={(e) => setNickname(e.currentTarget.value)}
              placeholder='2~6자 이내'
            />
            <input
              label='이메일'
              variant='outlined'
              disabled={isEmailAuthentication}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              type='email'
              placeholder='example@test.com'
              InputProps={{
                endAdornment: (
                  <>
                    {loading && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', marginRight: 2 }}>
                        <CircularProgress size='20px' color='secondary' />
                      </Box>
                    )}
                    <LoadingButton
                      variant='contained'
                      onClick={sendEmail}
                      loading={emailSendLoading}
                      disabled={isEmailAuthentication || loading}
                    >
                      발송
                    </LoadingButton>
                  </>
                ),
              }}
            />
            {isEmailAuthentication && (
              <>
                <input
                  label='이메일인증'
                  variant='outlined'
                  disabled={isFinalEmailAuthentication}
                  value={emailAuthenticationCode}
                  onChange={(e) => setEmailAuthenticationCode(e.currentTarget.value)}
                  type='email'
                  InputProps={{
                    endAdornment: (
                      <div style={{ display: 'flex' }}>
                        {!isFinalEmailAuthentication && <Timer style={{ textAlign: 'center' }} />}
                        <button
                          variant='contained'
                          onClick={getEmailAuthentication}
                          disabled={isFinalEmailAuthentication}
                          sx={{ '&.Mui-disabled': { background: '#eaeaea', color: '#26a400' } }}
                        >
                          {isFinalEmailAuthentication ? <CheckCircleOutlineOutlinedIcon /> : '인증'}
                        </button>
                      </div>
                    ),
                  }}
                />
              </>
            )}
            <input
              label='비밀번호'
              variant='outlined'
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              type='password'
              placeholder='최소 8자 이상(대소문자, 숫자, 특수문자 필수)'
            />
            <input
              label='비밀번호 확인'
              variant='outlined'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              type='password'
              placeholder='********'
            />
            {errorMessage && errorAlert(errorMessage)}
            <button
              onClick={onSubmit}
              variant='contained'
              sx={{ backgroundColor: '#33a4ff' }}
              disabled={!isFinalEmailAuthentication}
            >
              회원가입
            </button>

            <p className='mb-2 divider'>소셜 계정으로 간편 회원가입</p>
            <div className={'flex space-y-2 justify-center'}>
              <IconButton
                className={style.login_icon_naver}
                onClick={() => (window.location = '/oauth2/authorization/naver')}
              >
                <img src={NaverLoginBtn} alt='NaverLoginBtn' />
              </IconButton>
              <IconButton
                className={style.login_icon_google}
                onClick={() => (window.location = '/oauth2/authorization/google')}
              >
                <img src={GoogleLoginBtn} alt='GoogleLoginBtn' />
              </IconButton>
            </div>
          </div>

          <div className='modal-action'>
            <form method='dialog'>
              {/* if there is a button in form, it will close the modal */}
              <button className='btn'>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
    // <Modal
    //   open={modalVisibility === AuthModalVisibility.SHOW_REGISTER}
    //   onClose={() => {
    //     setModalVisibility(AuthModalVisibility.HIDE_ALL);
    //     setErrorMessage('');
    //     clearInputs();
    //   }}
    // >

    // </Modal>
  );
}
