import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { CarOwnerService } from './car-owner.service';
import { CreateCarOwnerDto } from './dto/create-car-owner.dto';
import { CarOwner } from './entities/car-owner.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { API_TAGS } from 'src/common/enums';
import { RequestService } from './services/request-service.service';
import { CreateGeneralRepairDto } from './services/dtos/general-repair.dto';
import { CreateMaintenanceRepairDto } from './services/dtos/maintenance-repair.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MaintenanceRepair } from './services/entities/maintenance-repair.entity';
import { GeneralRepair } from './services/entities/general-repair.entity';

@ApiTags(API_TAGS.CAR_OWNER)
@Controller('car-owners')
export class CarOwnerController {
  constructor(
    private readonly carOwnerService: CarOwnerService,
    private readonly requestService: RequestService,
  ) {}

  @UseGuards(RolesGuard)
  @Post('create')
  async createCarOwner(
    @Headers('registration-token') registrationToken: string,
    @Body() createCarOwnerDto: CreateCarOwnerDto,
  ): Promise<CarOwner> {
    return this.carOwnerService.createCarOwner(
      createCarOwnerDto,
      registrationToken,
    );
  }

  @Post('maintenance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CAR_OWNER)
  async createMaintenanceRepair(
    @Headers('registration-token') registrationToken: string,
    @Body() createMaintenanceRepairDto: CreateMaintenanceRepairDto,
  ): Promise<MaintenanceRepair> {
    return this.requestService.createMaintenanceRepair(
      createMaintenanceRepairDto,
      registrationToken,
    );
  }

  @Post('general')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CAR_OWNER)
  async createGeneralRepair(
    @Headers('registration-token') registrationToken: string,
    @Body() createGeneralRepairDto: CreateGeneralRepairDto,
  ): Promise<GeneralRepair> {
    return this.requestService.createGeneralRepair(
      createGeneralRepairDto,
      registrationToken,
    );
  }
}
