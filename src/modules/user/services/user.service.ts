import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from 'src/shared/entities/user/user.entity';
import { CreateUserDto } from 'src/shared/dtos/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from 'src/shared/dtos/user/credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  async signIn(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { userName, password } = credentialsDto;

    const user = await this.userRepository.findOne({
      userName,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, userName: user.userName };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException(
      'ユーザー名またはパスワードが正しくありません',
    );
  }
}
