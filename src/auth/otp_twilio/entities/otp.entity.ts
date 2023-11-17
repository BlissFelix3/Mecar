// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { User } from 'src/users/entities';
// @Entity()
// export class Otp {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   code: string;

//   @ManyToOne(() => User, (user) => user.otp)
//   @JoinColumn({ name: 'user_id' })
//   user: User;
// }
