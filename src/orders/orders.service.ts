import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './entity/order.entity';
import { NotFoundException } from '@nestjs/common';
import { ApprovedOrderDetailsDto } from './dto/approved-order-details.dto';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { Cars } from 'src/cars/entities/car.entity';
import {
  CancellationReason,
  OrderStatus,
  OrderCustomerType,
} from 'src/common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
  ) {}

  async getInProgressOrderDetails(
    orderId: string,
  ): Promise<ApprovedOrderDetailsDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['carOwner'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return ApprovedOrderDetailsDto.fromEntity(order);
  }

  async getCancelledOrderDetails(
    orderId: string,
  ): Promise<ApprovedOrderDetailsDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['carOwner'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return ApprovedOrderDetailsDto.fromEntity(order);
  }

  async getCompleteOrderDetails(
    orderId: string,
  ): Promise<ApprovedOrderDetailsDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['reviews', 'carOwner'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return ApprovedOrderDetailsDto.fromEntity(order);
  }
}

// const customerType = user.carOwner.orders.length === 0 ? OrderCustomerType.FIRST_TIME : OrderCustomerType.RETURNING;
