import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginGoogleDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  avatar: string;
}