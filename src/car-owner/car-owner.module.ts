import { Module } from '@nestjs/common';
import { CarOwnerController } from './car-owner.controller';
import { CarOwnerService } from './car-owner.service';
import { CarOwner } from './entities/car-owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities';

@Module({
  imports: [TypeOrmModule.forFeature([CarOwner])],
  controllers: [CarOwnerController],
  providers: [CarOwnerService],
  exports: [CarOwnerService],
})
export class CarOwnerModule {}
