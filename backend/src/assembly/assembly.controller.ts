import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { AssemblyService } from './assembly.service';

@Controller('assembly')
export class AssemblyController {
  constructor(private readonly assemblyService: AssemblyService) {}

  @Get(':id')
  async getAssemblyById(@Param('id') assemblyId: string, @Res() res: Response) {
    const path = await this.assemblyService.getAssemblyPathById(assemblyId);
    const file = createReadStream(path);
    file.pipe(res);
  }
}
