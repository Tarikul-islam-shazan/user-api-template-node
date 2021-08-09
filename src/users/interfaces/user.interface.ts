import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleBase;
}

export enum RoleBase {
  user = 'user',
  admin = 'admin',
}
