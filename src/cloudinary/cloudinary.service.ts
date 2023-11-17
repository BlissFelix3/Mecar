// cloudinary/cloudinary.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {}
  folder = this.configService.get('CLOUDINARY_FOLDER') || 'development';
  subFolder =
    this.configService.get('CLOUDINARY_SUBFOLDER') || 'localhost:3000';

  async uploadImage(
    file: any,
    type: string,
    id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        v2.uploader
          .upload_stream(
            {
              resource_type: 'image',
              public_id: `${this.folder}/${this.subFolder}/images/${type}/${id}`,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else if (result) {
                // Check if result is defined
                resolve(result);
              } else {
                reject(new Error('Upload result is undefined.'));
              }
            },
          )
          .end(file.buffer);
      });
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  // businessPermitImage
  // idCardImage
  // companyImage

  async uploadBusinessPermit(
    file: any,
    id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadImage(file, 'business-permit', id);
  }

  async uploadIDCardImage(
    file: any,
    id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadImage(file, 'id-card', id);
  }

  async uploadCompanyImage(
    file: any,
    id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadImage(file, 'company-image', id);
  }
}
