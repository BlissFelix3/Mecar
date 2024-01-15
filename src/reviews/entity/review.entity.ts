import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from 'src/orders/entity/order.entity';
import { ReviewRating } from 'src/common/enums';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.reviews)
  @JoinColumn()
  order: Order;

  @Column({ type: 'enum', enum: ReviewRating })
  rating: ReviewRating;

  @Column()
  comments: string;
}
