export interface IAnonymousUserResponse {
  user_anonymous_id: number;
  uid: string;
  auth_service: {
    [client: string]: {
      token: string,
      expiry: number,
    }
  };
}