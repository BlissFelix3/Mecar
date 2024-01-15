import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entity/order.entity';
import { ReviewDto } from './dtos/review.dto';
import { Review } from './entity/review.entity';
import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from 'src/common/enums';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async addReview(addReviewDto: ReviewDto): Promise<Review> {
    const order = await this.orderRepository.findOne({
      where: { id: addReviewDto.orderId },
      relations: ['reviews'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Order must be completed before adding a review',
      );
    }

    const existingReview = order.reviews;
    if (existingReview) {
      throw new BadRequestException('Review already exists for this order');
    }

    const review = this.reviewRepository.create({
      order,
      rating: addReviewDto.rating,
      comments: addReviewDto.comments,
    });

    await this.reviewRepository.save(review);
    return review;
  }
}
