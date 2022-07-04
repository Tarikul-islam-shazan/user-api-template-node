import { ObjectID } from 'typeorm';
import { RoleBase } from '../enums/user-role.enum';

export interface UserModel {
  id: ObjectID;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: RoleBase;
}
