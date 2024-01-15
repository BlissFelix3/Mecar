import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { Review } from './entity/review.entity';
import { ReviewService } from './reviews.service';
import { ReviewDto } from './dtos/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CAR_OWNER)
  async addReview(@Body() addReviewDto: ReviewDto): Promise<Review> {
    return this.reviewService.addReview(addReviewDto);
  }
}
