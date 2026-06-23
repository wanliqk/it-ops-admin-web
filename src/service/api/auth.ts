import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: {
      username: userName,
      password
    }
  });
}

/** backend shape of `GET /auth/me`, see admin-api-v1.md 5.2 */
interface MeResponseData {
  id: number;
  real_name: string;
  roles: string[];
  permissions: string[];
}

/** Get user info */
export async function fetchGetUserInfo() {
  const { data, error } = await request<MeResponseData>({ url: '/auth/me' });

  if (error || !data) {
    return { data: null, error };
  }

  const userInfo: Api.Auth.UserInfo = {
    userId: String(data.id),
    userName: data.real_name,
    roles: data.roles,
    permissions: data.permissions
  };

  return { data: userInfo, error: null };
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
