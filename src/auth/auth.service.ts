import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async registerUser(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('User already registered');
    }

    const user = await this.userModel.create({
      ...registerUserDto,
    });

    return user;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({
      email: loginUserDto.email,
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const matchedPassword = await user.comparePassword(loginUserDto.password);
    if (!matchedPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, user };
  }
}
