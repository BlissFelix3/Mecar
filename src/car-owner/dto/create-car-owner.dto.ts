import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateCarOwnerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  residentialAddress: string;
}
