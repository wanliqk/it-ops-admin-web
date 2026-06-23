declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      access_token: string;
      token_type: string;
      expires_in: number;
    }

    interface UserInfo {
      userId: string;
      userName: string;
      roles: string[];
      permissions: string[];
    }
  }
}
