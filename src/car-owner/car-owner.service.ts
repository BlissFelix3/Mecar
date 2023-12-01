import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarOwnerDto } from './dto/create-car-owner.dto';
import { CarOwner } from './entities/car-owner.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from 'src/shared/enums';

@Injectable()
export class CarOwnerService {
  constructor(
    @InjectRepository(CarOwner)
    private readonly carOwnerRepository: Repository<CarOwner>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCarOwner(
    createCarOwnerDto: CreateCarOwnerDto,
    registrationToken: string,
  ): Promise<CarOwner> {
    const user = await this.userRepository.findOne({
      where: { registrationToken },
    });

    if (!user) {
      throw new NotFoundException('Car Owner not found');
    }

    if (!user.roles.includes(UserRole.CAR_OWNER)) {
      user.roles = [UserRole.CAR_OWNER];
      await this.userRepository.save(user);
    }

    const carOwner = this.carOwnerRepository.create({
      ...createCarOwnerDto,
      user,
    });

    await this.carOwnerRepository.save(carOwner);

    return carOwner;
  }

  async getCarOwnerRole(userId: string): Promise<CarOwner> {
    const carOwner = await this.carOwnerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!carOwner) {
      throw new NotFoundException('Car Owner not found');
    }

    return carOwner;
  }
}
