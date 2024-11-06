import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
