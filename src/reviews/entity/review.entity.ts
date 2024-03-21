import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Orders } from 'src/orders/entity/order.entity';
import { ReviewRating } from 'src/common/enums';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Orders, (orders) => orders.reviews)
  @JoinColumn()
  order: Orders;

  @Column({ type: 'enum', enum: ReviewRating })
  rating: ReviewRating;

  @Column()
  comments: string;
}
