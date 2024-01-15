import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class VinDto {
  @IsNotEmpty()
  @IsString()
  @Length(17, 17, { message: 'VIN must be 17 characters long' })
  @Matches(/^[0-9A-HJ-NPR-Z]{17}$/, { message: 'Invalid VIN format' })
  vin: string;
}
