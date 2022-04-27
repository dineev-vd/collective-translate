import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assembly } from 'entities/assembly.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssemblyService {
  constructor(
    @InjectRepository(Assembly)
    private readonly assemblyRepository: Repository<Assembly>,
  ) { }

  async getAssemblyById(id: string) {
    return this.assemblyRepository.findOne(id);
  }

  async getAssembliesByLanguageId(id: string) {
    return this.assemblyRepository.find({ where: { language: { id: id } } })
  }
}
