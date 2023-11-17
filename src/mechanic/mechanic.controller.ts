import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { Mechanic } from './entities/mechanic.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums';

@Controller('mechanics')
export class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

  @Roles(UserRole.MECHANIC)
  @Post('create')
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
    @UploadedFiles()
    files: {
      companyImage?: Express.Multer.File[];
      idCardImage?: Express.Multer.File[];
      businessPermitImage?: Express.Multer.File[];
    },
    @Body() mechanicDto: CreateMechanicDto,
  ): Promise<Mechanic> {
    return this.mechanicService.createMechanic(mechanicDto, files);
  }
}
