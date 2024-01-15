import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from './entities';
import { UserService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from 'src/common/enums';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';

@ApiTags(API_TAGS.USER)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async viewProfile(@GetUser() user: User) {
    return this.userService.viewProfile(user);
  }

  @Get(':userId')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserProfile(
    @Param('userId') userId: string,
  ): Promise<{ user: User; profile?: CarOwner | Mechanic | null }> {
    return this.userService.getUserProfile(userId);
  }
}
