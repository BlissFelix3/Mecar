// import {
//   IsString,
//   IsOptional,
//   IsArray,
//   IsNumber,
//   IsNotEmpty,
// } from 'class-validator';

// export class ApprovedOrderDetailsDto {
//   @IsString()
//   @IsNotEmpty()
//   orderId: string;
// }

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/common/enums';
import { Orders } from '../entity/order.entity';

export class ApprovedOrderDetailsDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  carOwnerName: string;

  @ApiProperty()
  carOwnerPhoneNumber: string;

  @ApiProperty()
  carOwnerAddress: string;

  @ApiProperty()
  orderBrief: string;

  // Additional properties for orders with status IN_PROGRESS
  @ApiProperty({ required: false })
  carName?: string;

  @ApiProperty({ required: false })
  model?: string;

  @ApiProperty({ required: false })
  chasisNumber?: string;

  @ApiProperty({ required: false })
  plateNumber?: string;

  @ApiProperty({ required: false })
  maintenanceSchedule?: string;

  // Additional properties for orders with status COMPLETED
  @ApiProperty({ required: false })
  completionDate?: Date;

  @ApiProperty({ required: false })
  paymentAmount?: number;

  // @ApiPropertyOptional({ type: 'string', format: 'binary' })
  // images?: Express.Multer.File;

  @ApiProperty({ required: false })
  review?: {
    stars: number;
    comments: string;
  };

  static fromEntity(order: Orders): ApprovedOrderDetailsDto {
    // Mapping logic from the Order entity to the DTO
    const dto: ApprovedOrderDetailsDto = {
      orderId: order.id,
      carOwnerName: order.carOwner.name,
      carOwnerPhoneNumber: order.carOwner.phone,
      carOwnerAddress: order.carOwner.residentialAddress,
      orderBrief: order.orderBrief,
      carName: order.carName,
      model: order.model,
      chasisNumber: order.chasisNumber,
      plateNumber: order.plateNumber,
      maintenanceSchedule: order.maintenanceDate,
    };

    if (order.status === OrderStatus.COMPLETED) {
      dto.completionDate = order.completionDate;
      dto.paymentAmount = order.amountPaid;

      const review = order.reviews[0];

      if (review) {
        dto.review = {
          stars: review.rating,
          comments: review.comments,
        };
      }
    }

    return dto;
  }
}
