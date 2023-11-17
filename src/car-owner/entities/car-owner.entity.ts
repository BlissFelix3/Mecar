import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole } from '../../shared/enums';
import { User } from 'src/users/entities';

@Entity('car_owners')
export class CarOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  residentialAddress: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column('simple-array', { default: [UserRole.CAR_OWNER] })
  roles: UserRole[];
}
