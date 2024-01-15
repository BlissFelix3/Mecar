import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGeneralRepairDto } from './dtos/general-repair.dto';
import { CreateMaintenanceRepairDto } from './dtos/maintenance-repair.dto';
import { User } from 'src/users/entities';
import { CarOwner } from '../entities/car-owner.entity';
import { Cars } from 'src/cars/entities/car.entity';
import { GeneralRepair } from './entities/general-repair.entity';
import { MaintenanceRepair } from './entities/maintenance-repair.entity';
import { addHours } from 'date-fns';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(CarOwner)
    private readonly carOwnerRepository: Repository<CarOwner>,
    @InjectRepository(MaintenanceRepair)
    private readonly maintenanceOrderRepository: Repository<MaintenanceRepair>,
    @InjectRepository(GeneralRepair)
    private readonly repairOrderRepository: Repository<GeneralRepair>,
    @InjectRepository(Cars)
    private readonly carsRepository: Repository<Cars>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMaintenanceRepair(
    createMaintenanceRepairDto: CreateMaintenanceRepairDto,
    registrationToken: string,
  ): Promise<MaintenanceRepair> {
    const user = await this.userRepository.findOne({
      where: { registrationToken },
    });

    if (!user) {
      throw new NotFoundException('Car Owner not found');
    }

    const carOwner = await this.carOwnerRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!carOwner) {
      throw new NotFoundException('Car Owner profile not found');
    }

    const [make, model, year] = createMaintenanceRepairDto.car.split(' ');

    const car = await this.carsRepository.findOne({
      where: { make, model, year: +year, owner: carOwner.id },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    // Hardcoded time in GMT+1
    const hardcodedTime = '12:00';
    const dateInGMT1 = addHours(createMaintenanceRepairDto.day, 1);

    const maintenanceRepair = this.maintenanceOrderRepository.create({
      ...createMaintenanceRepairDto,
      carOwner,
      carName: createMaintenanceRepairDto.car,
      day: dateInGMT1,
      time: hardcodedTime,
    });

    await this.maintenanceOrderRepository.save(maintenanceRepair);

    return maintenanceRepair;
  }

  async createGeneralRepair(
    createGeneralRepairDto: CreateGeneralRepairDto,
    registrationToken: string,
  ): Promise<GeneralRepair> {
    const user = await this.userRepository.findOne({
      where: { registrationToken },
    });

    if (!user) {
      throw new NotFoundException('Car Owner not found');
    }

    const carOwner = await this.carOwnerRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!carOwner) {
      throw new NotFoundException('Car Owner profile not found');
    }

    const generalRepair = this.repairOrderRepository.create({
      ...createGeneralRepairDto,
      carOwner,
    });

    await this.repairOrderRepository.save(generalRepair);

    return generalRepair;
  }
}
