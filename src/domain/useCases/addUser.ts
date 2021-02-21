import { UserModel } from '../models';

export interface AddUserModel {
  name: string;
  email: string;
  password: string;
}

export interface AddUser {
  execute(user: AddUserModel): Promise<UserModel>;
}
