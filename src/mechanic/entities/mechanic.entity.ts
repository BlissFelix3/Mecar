import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities';
import { MechanicServiceEntity } from '../services/entities/mechanic.service.entity';
import { Orders } from 'src/orders/entity/order.entity';

@Entity('mechanics')
export class Mechanic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessName: string;

  @Column()
  businessAddress: string;

  @Column()
  cacNumber: string;

  @Column()
  workshopAddress: string;

  @Column()
  nationality: string;

  @Column()
  state: string;

  @Column()
  homeAddress: string;

  @Column()
  companyImage: string;

  @Column()
  idCardImage: string;

  @Column()
  businessPermitImage: string;

  @OneToOne(() => User, (user) => user.mechanic)
  @JoinColumn()
  user: User;

  @OneToMany(() => Orders, (orders) => orders.mechanic)
  orders: Orders[];

  @OneToMany(() => MechanicServiceEntity, (service) => service.mechanic)
  services: MechanicServiceEntity[];
}
