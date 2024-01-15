import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseInterceptors,
  UploadedFiles,
  Headers,
  UseGuards,
  Param,
} from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { CreateMechanicDto } from './dtos/create-mechanic.dto';
import { Mechanic } from './entities/mechanic.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from 'src/common/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RenderService } from './services/render-service.service';
import { UserRole } from 'src/common/enums';
import { MechanicServiceEntity } from './services/entities/mechanic.service.entity';
import { AddServiceDto } from './services/dtos/add-service.dto';
import { UpdateServiceDto } from './services/dtos/update-service.dto';

@ApiTags(API_TAGS.MECHANIC)
@Controller('mechanics')
export class MechanicController {
  constructor(
    private readonly mechanicService: MechanicService,
    private readonly renderService: RenderService,
  ) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'companyImage', maxCount: 1 },
      { name: 'idCardImage', maxCount: 1 },
      { name: 'businessPermitImage', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMechanicDto })
  async createMechanic(
    @Headers('registration-token') registrationToken: string,
    @UploadedFiles()
    files: {
      companyImage?: Express.Multer.File[];
      idCardImage?: Express.Multer.File[];
      businessPermitImage?: Express.Multer.File[];
    },
    @Body() mechanicDto: CreateMechanicDto,
  ): Promise<Mechanic> {
    return this.mechanicService.createMechanic(
      mechanicDto,
      files,
      registrationToken,
    );
  }

  @Post(':mechanicId/services/create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC)
  async addService(
    @Param('mechanicId') mechanicId: string,
    @Body() addServiceDto: AddServiceDto,
  ): Promise<MechanicServiceEntity> {
    return this.renderService.addService(mechanicId, addServiceDto);
  }

  @Get(':mechanicId/services')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC)
  async getServices(
    @Param('mechanicId') mechanicId: string,
  ): Promise<MechanicServiceEntity[]> {
    return this.renderService.getAllServices(mechanicId);
  }

  @Patch(':mechanicId/services/:serviceId/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC)
  async updateService(
    @Param('mechanicId') mechanicId: string,
    @Param('serviceId') serviceId: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<MechanicServiceEntity> {
    return this.renderService.updateService(
      mechanicId,
      serviceId,
      updateServiceDto,
    );
  }

  @Delete(':mechanicId/services/:serviceId/delete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC)
  async deleteService(
    @Param('mechanicId') mechanicId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<{ message: string }> {
    return this.renderService.deleteService(mechanicId, serviceId);
  }

  @Patch(':mechanicId/services/:serviceId/pause')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC)
  async pauseService(
    @Param('mechanicId') mechanicId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<MechanicServiceEntity> {
    return this.renderService.pauseService(mechanicId, serviceId);
  }

  @Patch(':mechanicId/services/:serviceId/activate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC)
  async activateService(
    @Param('mechanicId') mechanicId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<MechanicServiceEntity> {
    return this.renderService.activatePausedService(mechanicId, serviceId);
  }
}
