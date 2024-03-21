import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { OrderStatus, Services } from 'src/common/enums';

@Entity('general_repair')
export class GeneralRepair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  service: Services;

  @ManyToOne(() => CarOwner, (owner) => owner.generalRepair)
  carOwner: CarOwner;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.IN_PROGRESS })
  status: OrderStatus;

  @Column()
  car: string;

  @Column()
  brief: string;
}
