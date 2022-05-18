import User from 'entities/user.entity';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeUserDto, PostUserDto } from 'common/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  onApplicationBootstrap() {
    const simpleUser = new User();
    simpleUser.email = 'user@user.com';
    simpleUser.name = 'Обычный пользователь';
    simpleUser.password = 'user';
    simpleUser.refreshToken = '';

    this.userRepository.save(simpleUser);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(user: PostUserDto) {
    return this.userRepository.save(user);
  }

  async findById(id: string) {
    return this.userRepository.findOne(id);
  }

  async updateUser(id: string, changes: ChangeUserDto) {
    return this.userRepository.update(id, changes);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
