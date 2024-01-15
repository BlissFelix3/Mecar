import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Services } from 'src/common/enums';

export class CreateGeneralRepairDto {
  @IsNotEmpty()
  @IsString()
  car: string;

  @IsEnum(Services)
  service: Services;

  @IsNotEmpty()
  @IsString()
  brief: string;
}
