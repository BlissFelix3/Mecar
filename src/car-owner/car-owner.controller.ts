import { Controller, Post, Request, Body } from '@nestjs/common';
import { CarOwnerService } from './car-owner.service';
import { CreateCarOwnerDto } from './dto/create-car-owner.dto';
import { CarOwner } from './entities/car-owner.entity';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums';

@Controller('car-owners')
export class CarOwnerController {
  constructor(private readonly carOwnerService: CarOwnerService) {}

  @Roles(UserRole.CAR_OWNER)
  @Post('create')
  async createCarOwner(
    @Body() createCarOwnerDto: CreateCarOwnerDto,
  ): Promise<CarOwner> {
    return this.carOwnerService.createCarOwner(createCarOwnerDto);
  }
}
