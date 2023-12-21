import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { User } from './entities';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async viewProfile(@GetUser() user: User) {
    return this.userService.viewProfile(user);
  }
}
