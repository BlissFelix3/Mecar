import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /* Login with either email or phone number */
  // @IsNotEmpty()
  // @IsString()
  // identifier: string;

  @IsNotEmpty()
  @IsString()
  emailOrPhone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
