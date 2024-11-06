import { USER_ROLES } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsEnum(USER_ROLES)
  @IsNotEmpty()
  readonly role: USER_ROLES;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
