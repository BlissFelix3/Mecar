import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { Services } from 'src/common/enums';

@Entity('general_repair')
export class GeneralRepair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  service: Services;

  @ManyToOne(() => CarOwner, (owner) => owner.generalRepair)
  carOwner: CarOwner;

  @Column()
  car: string;

  @Column()
  brief: string;
}
