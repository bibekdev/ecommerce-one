import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractFromSessionCookie(request);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secret',
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Token expired. Please login');
    }
    return true;
  }

  private extractFromSessionCookie(request: Request) {
    const token = request.session.jwt;
    if (!token) {
      throw new UnauthorizedException('Please login in ');
    }
    return token;
  }
}
