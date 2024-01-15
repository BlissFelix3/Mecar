import { ReviewRating } from 'src/common/enums';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class ReviewDto {
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsEnum(ReviewRating)
  rating: ReviewRating;

  @IsNotEmpty()
  @IsString()
  comments: string;
}
