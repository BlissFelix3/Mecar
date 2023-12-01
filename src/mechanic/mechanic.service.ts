import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { User } from 'src/users/entities';
import { UserRole } from 'src/shared/enums';

@Injectable()
export class MechanicService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createMechanic(
    mechanicDto: CreateMechanicDto,
    files: {
      companyImage?: Express.Multer.File[];
      idCardImage?: Express.Multer.File[];
      businessPermitImage?: Express.Multer.File[];
    },
    registrationToken: string,
  ): Promise<any> {
    try {
      const { companyImage, idCardImage, businessPermitImage } = files;

      const uploadCompanyImage: any = companyImage
        ? this.cloudinaryService.uploadCompanyImage(
            companyImage[0],
            mechanicDto.cacNumber,
          )
        : null;

      const uploadIDCardImage: any = idCardImage
        ? this.cloudinaryService.uploadIDCardImage(
            idCardImage[0],
            mechanicDto.cacNumber,
          )
        : null;

      const uploadBusinessPermitImage: any = businessPermitImage
        ? this.cloudinaryService.uploadBusinessPermit(
            businessPermitImage[0],
            mechanicDto.cacNumber,
          )
        : null;

      let [companyImageUrl, idCardImageUrl, businessPermitImageUrl] =
        await Promise.all([
          uploadCompanyImage,
          uploadIDCardImage,
          uploadBusinessPermitImage,
        ]);

      companyImageUrl = companyImageUrl?.secure_url || '';
      idCardImageUrl = idCardImageUrl?.secure_url || '';
      businessPermitImageUrl = businessPermitImageUrl?.secure_url || '';

      const user = await this.userRepository.findOne({
        where: { registrationToken },
      });

      if (!user) {
        throw new NotFoundException('Car Owner not found');
      }

      if (!user.roles.includes(UserRole.MECHANIC)) {
        user.roles = [UserRole.MECHANIC];
        await this.userRepository.save(user);
      }

      const mechanic = this.mechanicRepository.create({
        ...mechanicDto,
        companyImage: companyImageUrl,
        idCardImage: idCardImageUrl,
        businessPermitImage: businessPermitImageUrl,
        user,
      });

      await this.mechanicRepository.save(mechanic);

      return mechanic;
    } catch (error) {
      throw new BadRequestException('Failed to create mechanic');
    }
  }

  async getMechanicRole(userId: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    return mechanic;
  }
}
