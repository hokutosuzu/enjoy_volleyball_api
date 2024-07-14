import { CreateUserDto } from 'src/shared/dtos/user/create-user.dto';
import { User } from 'src/shared/entities/user/user.entity';
import { EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseRepository } from 'src/shared/repositories/BaseRepository';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { userName, password, status } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ userName, password: hashedPassword, status });
    await this.save(user);
    return user;
  }
}
