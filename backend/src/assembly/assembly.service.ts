import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assembly } from 'entities/assembly.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssemblyService {
  constructor(
    @InjectRepository(Assembly)
    private readonly assemblyRepository: Repository<Assembly>,
  ) {}

  async getAssemblyPathById(id: string) {
    const assembly = await this.assemblyRepository.findOne(id);
    console.log(assembly);
    return assembly.path;
  }
}
