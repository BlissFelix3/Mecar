import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { UserRole } from 'src/common/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CarOwner)
    private readonly carOwnerRepository: Repository<CarOwner>,
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
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

  async viewProfile(user: User) {
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!foundUser) throw new NotFoundException('USER_NOT_FOUND');

    return foundUser;
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getUserProfile(
    userId: string,
  ): Promise<{ user: User; profile?: CarOwner | Mechanic | null }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile;

    if (user.roles.includes(UserRole.CAR_OWNER)) {
      profile = await this.carOwnerRepository.findOne({
        where: { user: { id: userId } },
      });
    } else if (user.roles.includes(UserRole.MECHANIC)) {
      profile = await this.mechanicRepository.findOne({
        where: { user: { id: userId } },
      });
    }

    return { user, profile };
  }
}
