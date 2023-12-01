import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmailOrPhone(
    email: string,
    phoneNumber: string,
  ): Promise<User | null> {
    return (
      (await this.userRepository.findOne({
        where: [{ email }, { phoneNumber }],
      })) || null
    );
  }

  async findById(id: string): Promise<User | null> {
    return (await this.userRepository.findOne({ where: { id } })) || null;
  }

  async updateUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
