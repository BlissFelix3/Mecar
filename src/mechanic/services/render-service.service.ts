import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mechanic } from '../entities/mechanic.entity';
import { MechanicServiceEntity } from './entities/mechanic.service.entity';
import { Repository } from 'typeorm';
import { AddServiceDto } from './dtos/add-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ServiceStatus } from 'src/common/enums';

@Injectable()
export class RenderService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(MechanicServiceEntity)
    private readonly mechanicServiceRepository: Repository<MechanicServiceEntity>,
  ) {}

  private async getMechanicById(mechanicId: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { id: mechanicId },
      relations: ['services'],
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    return mechanic;
  }

  private async getServiceByIdAndMechanicId(
    serviceId: string,
    mechanicId: string,
  ): Promise<MechanicServiceEntity> {
    const service = await this.mechanicServiceRepository.findOne({
      where: { id: serviceId, mechanic: { id: mechanicId } },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async addService(
    mechanicId: string,
    addServiceDto: AddServiceDto,
  ): Promise<MechanicServiceEntity> {
    const mechanic = await this.getMechanicById(mechanicId);

    const service = await this.mechanicServiceRepository.create({
      ...addServiceDto,
      mechanic,
      status: ServiceStatus.ACTIVE,
    });

    await this.mechanicServiceRepository.save(service);

    return service;
  }

  async getAllServices(mechanicId: string): Promise<MechanicServiceEntity[]> {
    const mechanic = await this.getMechanicById(mechanicId);

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    return mechanic.services;
  }

  async updateService(
    mechanicId: string,
    serviceId: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<MechanicServiceEntity> {
    await this.getMechanicById(mechanicId);
    const service = await this.getServiceByIdAndMechanicId(
      serviceId,
      mechanicId,
    );

    Object.assign(service, updateServiceDto);

    const updatedService = await this.mechanicServiceRepository.save(service);

    return updatedService;
  }

  async deleteService(
    mechanicId: string,
    serviceId: string,
  ): Promise<{ message: string }> {
    await this.getMechanicById(mechanicId);
    const service = await this.getServiceByIdAndMechanicId(
      serviceId,
      mechanicId,
    );

    await this.mechanicServiceRepository.remove(service);

    return { message: 'Service has been successfully deleted' };
  }

  async pauseService(
    mechanicId: string,
    serviceId: string,
  ): Promise<MechanicServiceEntity> {
    await this.getMechanicById(mechanicId);
    const service = await this.getServiceByIdAndMechanicId(
      serviceId,
      mechanicId,
    );

    if (service.status === ServiceStatus.PAUSED) {
      throw new BadRequestException('Service is already paused');
    }

    service.status = ServiceStatus.PAUSED;

    await this.mechanicServiceRepository.save(service);

    return service;
  }

  async activatePausedService(
    mechanicId: string,
    serviceId: string,
  ): Promise<MechanicServiceEntity> {
    await this.getMechanicById(mechanicId);

    const service = await this.getServiceByIdAndMechanicId(
      serviceId,
      mechanicId,
    );

    if (!service.status.includes(ServiceStatus.PAUSED)) {
      throw new BadRequestException('Service already active');
    }

    service.status = ServiceStatus.ACTIVE;

    await this.mechanicServiceRepository.save(service);

    return service;
  }
}
