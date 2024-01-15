import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Mechanic, CarOwner])],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
