import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { ServiceCategory, ServiceStatus } from 'src/common/enums';

@Entity('mechanic_services')
export class MechanicServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceTitle: string;

  @Column({ type: 'enum', enum: ServiceCategory })
  category: ServiceCategory;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: number;

  @Column('simple-array')
  workDays: string[];

  @Column({ type: 'enum', enum: ServiceStatus })
  status: ServiceStatus;

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.services)
  mechanic: Mechanic;
}
