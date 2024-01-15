import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';

@Entity('cars')
export class Cars {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  vin: string;

  @ManyToOne(() => CarOwner, (owner) => owner.cars)
  @JoinColumn()
  owner: string;
}
