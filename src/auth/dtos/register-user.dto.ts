import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'Full Name is required' })
  name: string;

  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Email is required' })
  password: string;
}
