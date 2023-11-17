import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarOwnerDto } from './dto/create-car-owner.dto';
import { CarOwner } from './entities/car-owner.entity';
// import { User } from '../users/entities/user.entity';

@Injectable()
export class CarOwnerService {
  constructor(
    @InjectRepository(CarOwner)
    private readonly carOwnerRepository: Repository<CarOwner>,
  ) {}

  async createCarOwner(
    createCarOwnerDto: CreateCarOwnerDto,
  ): Promise<CarOwner> {
    return await this.carOwnerRepository.save(createCarOwnerDto);
  }
}
