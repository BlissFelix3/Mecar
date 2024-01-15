import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cars } from './entities/car.entity';
import { CarDto } from './dtos/createCarDto';
import { VinDto } from './dtos/vinDto';
import { validate } from 'class-validator';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Cars)
    private readonly carsRepository: Repository<Cars>,
    @InjectRepository(CarOwner)
    private readonly carOwnerRepository: Repository<CarOwner>,
  ) {}

  private async validateVin(vin: string): Promise<void> {
    const vinDto = new VinDto();
    vinDto.vin = vin;

    const errors = await validate(vinDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }

  async createCar(carDto: CarDto, carOwnerId: string): Promise<Cars> {
    await this.validateVin(carDto.vin);

    const existingCar = await this.carsRepository.findOne({
      where: { vin: carDto.vin },
    });

    if (existingCar) {
      throw new BadRequestException('Car with this VIN already exists');
    }

    const carOwner = await this.carOwnerRepository.findOne({
      where: { id: carOwnerId },
    });

    if (!carOwner) {
      throw new NotFoundException('Car Owner not found');
    }

    const car = this.carsRepository.create(carDto);
    await this.carsRepository.save(car);

    return car;
  }

  async getCars(carOwnerId: string): Promise<Cars[]> {
    const carOwner = await this.carOwnerRepository.findOne({
      where: { id: carOwnerId },
    });

    if (!carOwner) {
      throw new NotFoundException('Car Owner not found');
    }

    return carOwner.cars;
  }
}
