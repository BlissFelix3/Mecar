import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarOwnerDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  residentialAddress: string;
}
