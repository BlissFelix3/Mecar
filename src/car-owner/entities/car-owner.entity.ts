import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities';

@Entity('car_owners')
export class CarOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  residentialAddress: string;

  @OneToOne(() => User, (user) => user.carOwner)
  @JoinColumn()
  user: User;
}
