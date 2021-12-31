import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Customer {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  customerId: string;

  @Column()
  userId: string;

  @Column()
  street: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  zip: string;
}
