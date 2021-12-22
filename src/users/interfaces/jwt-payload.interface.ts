import { ObjectID } from 'typeorm';

export class JwtPayload {
  id: ObjectID;
  role: string;
}
