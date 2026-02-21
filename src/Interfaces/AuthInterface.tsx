export interface SuccessLogin {
  messege: string;
  user: UserInterface;
  token: string;
}
export interface FailedLogin {
  messege: string;
  statusMsg: string;
}

export interface UserInterface {
  name: string;
  email: string;
  role: string;
}