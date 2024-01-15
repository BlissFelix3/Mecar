import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ServiceCategory } from 'src/common/enums';

export class AddServiceDto {
  @IsNotEmpty()
  @IsString()
  serviceTitle: string;

  @IsNotEmpty()
  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  workDays: string[];
}
