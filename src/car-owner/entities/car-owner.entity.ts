import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities';
import { Cars } from 'src/cars/entities/car.entity';
import { GeneralRepair } from '../services/entities/general-repair.entity';
import { MaintenanceRepair } from '../services/entities/maintenance-repair.entity';
import { Orders } from 'src/orders/entity/order.entity';

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

  @OneToMany(() => Cars, (cars) => cars.owner)
  cars: Cars[];

  @OneToMany(() => Orders, (orders) => orders.carOwner)
  orders: Orders[];

  @OneToMany(() => GeneralRepair, (generalRepair) => generalRepair.carOwner)
  generalRepair: GeneralRepair[];

  @OneToMany(
    () => MaintenanceRepair,
    (maintenanceRepair) => maintenanceRepair.carOwner,
  )
  maintenanceRepair: MaintenanceRepair[];
}
