import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserRole } from 'src/shared/enums';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true, unique: true })
  registrationToken: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column('simple-array', { default: [UserRole.USER] })
  roles: UserRole[];

  @OneToOne(() => CarOwner, (carOwner) => carOwner.user)
  @JoinColumn()
  carOwner: CarOwner;

  @OneToOne(() => Mechanic, (mechanic) => mechanic.user)
  @JoinColumn()
  mechanic: Mechanic;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
