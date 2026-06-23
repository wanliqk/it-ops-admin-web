import { alova } from '../request';

/**
 * the demo backend's auth response shapes
 *
 * kept local to this file (rather than the global `Api.Auth` namespace, which now reflects the real
 * `/auth/login` + `/auth/me` backend) since this alova demo module talks to a different, unrelated mock
 * backend.
 */
interface DemoLoginToken {
  token: string;
  refreshToken: string;
}

interface DemoUserInfo {
  userId: string;
  userName: string;
  roles: string[];
  buttons: string[];
}

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return alova.Post<DemoLoginToken>('/auth/login', { userName, password });
}

/** Get user info */
export function fetchGetUserInfo() {
  return alova.Get<DemoUserInfo>('/auth/getUserInfo');
}

/** Send captcha to target phone */
export function sendCaptcha(phone: string) {
  return alova.Post<null>('/auth/sendCaptcha', { phone });
}

/** Verify captcha */
export function verifyCaptcha(phone: string, code: string) {
  return alova.Post<null>('/auth/verifyCaptcha', { phone, code });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return alova.Post<DemoLoginToken>(
    '/auth/refreshToken',
    { refreshToken },
    {
      meta: {
        authRole: 'refreshToken'
      }
    }
  );
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return alova.Get('/auth/error', {
    params: { code, msg },
    shareRequest: false
  });
}
