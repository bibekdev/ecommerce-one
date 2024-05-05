import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Email is required' })
  password: string;
}
