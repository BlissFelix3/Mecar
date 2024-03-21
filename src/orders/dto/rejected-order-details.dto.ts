import { ApiProperty } from '@nestjs/swagger';
import { Orders } from '../entity/order.entity';
import { CancellationReason } from 'src/common/enums';

export class CancelledOrderDetailsDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  carOwnerName: string;

  @ApiProperty()
  carOwnerPhoneNumber: string;

  @ApiProperty()
  carOwnerAddress: string;

  @ApiProperty()
  cancellationDate: Date;

  @ApiProperty({ type: String, enum: CancellationReason, required: false })
  cancellationReason?: CancellationReason;

  @ApiProperty()
  orderBrief: string;

  static fromEntity(order: Orders): CancelledOrderDetailsDto {
    // Mapping logic from the Order entity to the DTO
    return {
      orderId: order.id,
      carOwnerName: order.carOwner.name,
      carOwnerPhoneNumber: order.carOwner.phone,
      carOwnerAddress: order.carOwner.residentialAddress,
      cancellationDate: order.updatedAt,
      cancellationReason: order.cancellationReason,
      orderBrief: order.orderBrief,
    };
  }
}
