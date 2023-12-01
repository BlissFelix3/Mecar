import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { Mechanic } from './entities/mechanic.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('mechanics')
export class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

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
}
