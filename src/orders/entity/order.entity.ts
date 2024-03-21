import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { Review } from 'src/reviews/entity/review.entity';
import {
  OrderStatus,
  MaintenanceType,
  Services,
  CancellationReason,
} from 'src/common/enums';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carOwnerName: string;

  @Column()
  carOwnerPhoneNumber: string;

  @Column()
  carOwnerAddress: string;

  @Column()
  orderBrief: string;

  @Column()
  carName: string;

  @Column({ nullable: true })
  maintenanceType?: MaintenanceType;

  @Column()
  location: string;

  @Column()
  maintenanceDate: string;

  @Column()
  maintenanceTime: string;

  @Column()
  chasisNumber: string;

  @Column()
  plateNumber: string;

  @Column()
  model: string;

  // Additional fields for completed orders
  @Column({ nullable: true })
  completionDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountPaid?: number;

  @Column({ nullable: true })
  images?: string;

  // Additional fields for cancelled orders
  @Column({ nullable: true })
  cancellationDate?: Date;

  @Column({ type: 'enum', enum: CancellationReason, nullable: true })
  cancellationReason?: CancellationReason;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.IN_PROGRESS })
  status: OrderStatus;

  @Column({ type: 'enum', enum: Services })
  orderType: Services;

  @CreateDateColumn({ type: 'varchar' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'varchar' })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.order)
  reviews: Review[];

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.orders)
  mechanic: Mechanic;

  @ManyToOne(() => CarOwner, (carOwner) => carOwner.orders)
  carOwner: CarOwner;
}
