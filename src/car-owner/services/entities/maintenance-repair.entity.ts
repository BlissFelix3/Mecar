import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { MaintenanceType } from 'src/common/enums';

@Entity('maintenance_repair')
export class MaintenanceRepair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CarOwner, (owner) => owner.maintenanceRepair)
  carOwner: CarOwner;

  @Column()
  location: string;

  @Column()
  carName: string;

  @Column({ nullable: true })
  maintenanceType?: MaintenanceType;

  @Column({ nullable: true })
  amount?: number;

  @Column({ type: 'timestamp with time zone' })
  day: Date;

  @Column()
  time: string;
}
