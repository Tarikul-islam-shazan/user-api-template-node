import { Entity, ObjectIdColumn, ObjectID, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoleBase } from '../enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: RoleBase;
}
