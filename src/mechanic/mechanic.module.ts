import { Module } from '@nestjs/common';
import { MechanicController } from './mechanic.controller';
import { MechanicService } from './mechanic.service';
import { Mechanic } from './entities/mechanic.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { User } from 'src/users/entities';
import { MechanicServiceEntity } from './services/entities/mechanic.service.entity';
import { RenderService } from './services/render-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mechanic, User, MechanicServiceEntity]),
    CloudinaryModule,
  ],
  controllers: [MechanicController],
  providers: [MechanicService, RenderService, CloudinaryService],
  exports: [MechanicService, RenderService],
})
export class MechanicModule {}
