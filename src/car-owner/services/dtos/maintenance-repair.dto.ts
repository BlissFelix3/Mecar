import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MaintenanceType } from 'src/common/enums';
import { Transform } from 'class-transformer';

export class CreateMaintenanceRepairDto {
  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  car: string;

  @IsEnum(MaintenanceType)
  @IsNotEmpty()
  maintenanceType: MaintenanceType;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  day: Date;

  @IsNotEmpty()
  @IsString()
  time: string;
}
