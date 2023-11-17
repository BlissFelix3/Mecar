import { Module } from '@nestjs/common';
import { MechanicController } from './mechanic.controller';
import { MechanicService } from './mechanic.service';
import { Mechanic } from './entities/mechanic.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mechanic]), CloudinaryModule],
  controllers: [MechanicController],
  providers: [MechanicService, CloudinaryService],
  exports: [MechanicService],
})
export class MechanicModule {}
