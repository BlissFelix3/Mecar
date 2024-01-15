import { IsNotEmpty, IsString } from 'class-validator';

export class CarDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  year: number;

  @IsNotEmpty()
  @IsString()
  vin: string;
}
