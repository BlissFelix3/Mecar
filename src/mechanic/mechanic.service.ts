import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';

@Injectable()
export class MechanicService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createMechanic(
    mechanicDto: CreateMechanicDto,
    files: {
      companyImage?: Express.Multer.File[];
      idCardImage?: Express.Multer.File[];
      businessPermitImage?: Express.Multer.File[];
    },
  ): Promise<any> {
    try {
      const { companyImage, idCardImage, businessPermitImage } = files;

      const uploadCompanyImage: any = companyImage
        ? this.cloudinaryService.uploadCompanyImage(
            companyImage,
            mechanicDto.cacNumber,
          )
        : null;

      const uploadIDCardImage: any = idCardImage
        ? this.cloudinaryService.uploadIDCardImage(
            idCardImage,
            mechanicDto.cacNumber,
          )
        : null;

      const uploadBusinessPermitImage: any = businessPermitImage
        ? this.cloudinaryService.uploadBusinessPermit(
            businessPermitImage,
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

      const mechanic = this.mechanicRepository.create({
        ...mechanicDto,
        companyImage: companyImageUrl,
        idCardImage: idCardImageUrl,
        businessPermitImage: businessPermitImageUrl,
      });

      return await this.mechanicRepository.save(mechanic);
    } catch (error: any) {
      console.error('Error creating mechanic:', error.message);
      throw new BadRequestException('Failed to create mechanic');
    }
  }
}
