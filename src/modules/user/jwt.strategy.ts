import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from './repositories/user.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';
import { User } from 'src/shared/entities/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: number; userName: string }): Promise<User> {
    const { id, userName } = payload;
    const user = await this.userRepository.findOne({ id, userName });

    if (user) {
      return user;
    }

    throw new UnauthorizedException();
  }
}
