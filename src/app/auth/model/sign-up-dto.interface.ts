export interface SignupDTO {
  username: string;
  email: string;
  password: string;
  accepted?: boolean;
  org_id?: number;
  invite_token?: string;
  user_anonymous_id?: number;
  conversation_id?: number;
  organization_name?: string;
}
