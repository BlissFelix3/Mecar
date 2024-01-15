import { Module } from '@nestjs/common';
import { CarOwnerController } from './car-owner.controller';
import { CarOwnerService } from './car-owner.service';
import { RequestService } from './services/request-service.service';
import { GeneralRepair } from './services/entities/general-repair.entity';
import { MaintenanceRepair } from './services/entities/maintenance-repair.entity';
import { Cars } from 'src/cars/entities/car.entity';
import { CarOwner } from './entities/car-owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarOwner,
      User,
      GeneralRepair,
      MaintenanceRepair,
      Cars,
    ]),
  ],
  controllers: [CarOwnerController],
  providers: [CarOwnerService, RequestService],
  exports: [CarOwnerService, RequestService],
})
export class CarOwnerModule {}
