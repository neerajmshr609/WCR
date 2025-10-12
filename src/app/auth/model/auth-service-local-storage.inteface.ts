import { IAnonymousUserResponse } from './anonymous-user-response.interface';

export interface IAuthServiceLocalStorage {
  accessToken: string;
  client: string;
  expiry: string;
  tokenType: `Bearer`;
  uid: string;
  temp_user_id?: string;
  last_completed_conversation_id?: number;
  conversation_id?: number;
}


export const createAnonUserLocalStorageData = (data: IAnonymousUserResponse): IAuthServiceLocalStorage => {

  const [client] = Object.keys(data.auth_service);
  const accessToken = data.auth_service[client].token;
  const expiry = data.auth_service[client].expiry.toString();

  const temp_user_id = data.user_anonymous_id.toString();
  const uid = data.uid;
  return { accessToken, client, expiry, temp_user_id, tokenType: `Bearer`, uid };
};