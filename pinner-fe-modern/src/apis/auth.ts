import axios from 'axios';

function getLocalAccessToken() {
  return window.sessionStorage.getItem('accessToken');
}

function getLocalRefreshToken() {
  return window.sessionStorage.getItem('refreshToken');
}

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 로그인
export async function postLogin(data: { email: string; password: string }) {
  // TODO: Can we omit stringify?
  // const jsonData = JSON.stringify(data);
  const res = await instance.post('/api/v1/traveler/login', data);
  const { accessToken, refreshToken } = res.data;
  window.sessionStorage.setItem('accessToken', accessToken);
  window.sessionStorage.setItem('refreshToken', refreshToken);
  return res;
}

// OAuth 로그인
export async function postLoginAfterOAuth(ticket: string) {
  const res = await instance.post(`/api/v1/traveler/afteroauth/${ticket}`);
  return res;
}

interface RegisterRequestData {
  email: string;
  password: string;
  nickname: string;
  signupServices: 'Web';
}

// 회원가입
export async function postRegister(data: RegisterRequestData) {
  return instance.post('/api/v1/traveler/register', data);
}

// 로그아웃
export async function postLogout(data: { refreshToken: string }) {
  return instance.post('/api/v1/traveler/logout', data);
}

// token 갱신
export async function renewalToken() {
  return instance.post('/api/v1/traveler/renewal/token', {
    refreshToken: getLocalRefreshToken(),
    accessToken: getLocalAccessToken(),
  });
}
