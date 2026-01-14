export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface IUser {
  _id?: string;
  fullName: string;
  birthDate: Date;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: string;
  fullName: string;
  birthDate: Date;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  fullName: string;
  birthDate: Date;
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
