import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMechanicDto {
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @IsNotEmpty()
  @IsString()
  businessAddress: string;

  @IsNotEmpty()
  @IsString()
  cacNumber: string;

  @IsNotEmpty()
  @IsString()
  workshopAddress: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  homeAddress: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  companyImage: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  idCardImage: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  businessPermitImage: Express.Multer.File;
}
