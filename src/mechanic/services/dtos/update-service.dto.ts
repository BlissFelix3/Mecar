import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ServiceCategory, ServiceStatus } from 'src/common/enums';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  serviceTitle?: string;

  @IsEnum(ServiceCategory)
  @IsOptional()
  category?: ServiceCategory;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsOptional()
  workDays?: string;

  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;
}
