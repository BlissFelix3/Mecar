import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  newPassword?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  confirmNewPassword?: string;
}
