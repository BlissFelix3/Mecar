import { Controller, Body, Post, UseGuards, Param, Get } from '@nestjs/common';
import { CarsService } from './cars.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Cars } from './entities/car.entity';
import { CarDto } from './dtos/createCarDto';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from 'src/common/enums';

@ApiTags(API_TAGS.CARS)
@Controller('cars')
export class CarsController {
  constructor(private readonly carService: CarsService) {}

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(UserRole.CAR_OWNER)
  @Post(':carOwnerId')
  async create(
    @Body() carDto: CarDto,
    @Param('carOwnerId') carOwnerId: string,
  ): Promise<Cars> {
    return this.carService.createCar(carDto, carOwnerId);
  }

  @Get(':carOwnerId/cars')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CAR_OWNER)
  async getCars(@Param('carOwnerId') carOwnerId: string): Promise<Cars[]> {
    return this.carService.getCars(carOwnerId);
  }
}
