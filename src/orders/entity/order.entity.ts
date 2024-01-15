import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { Review } from 'src/reviews/entity/review.entity';
import { OrderStatus, MaintenanceType, Services } from 'src/common/enums';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column({ nullable: true })
  carOwnerId: string;

  @Column()
  status: OrderStatus;

  @Column({ type: 'enum', enum: Services })
  orderType: Services;

  @Column({ nullable: true })
  maintenanceType?: MaintenanceType;

  @Column()
  carId: string;

  @Column()
  location: string;

  @Column()
  maintenanceDate: string;

  @Column()
  maintenanceTime: string;

  // Add more fields as needed

  @OneToMany(() => Review, (review) => review.order)
  reviews: Review[];

  // @ManyToOne(() => Mechanic, (mechanic) => mechanic.orders)
  // mechanic: Mechanic;

  // @ManyToOne(() => CarOwner, (carOwner) => carOwner.orders)
  // carOwner: CarOwner;
}
