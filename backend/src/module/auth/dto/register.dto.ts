import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsString()
  usuario: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
