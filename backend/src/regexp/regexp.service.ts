import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegularExpression } from 'entities/regexp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegexpService {
    /**
     *
     */
    constructor(
        @InjectRepository(RegularExpression)
        private readonly regexpRepository: Repository<RegularExpression>
    ) { }

    async getAll() {
        this.regexpRepository.find({});
    }
}
