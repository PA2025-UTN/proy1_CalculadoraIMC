import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: 'El email no es válido' })
  @IsString({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

