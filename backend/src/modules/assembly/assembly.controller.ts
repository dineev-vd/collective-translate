import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { AssemblyService } from './assembly.service';

@Controller('assembly')
export class AssemblyController {
  constructor(private readonly assemblyService: AssemblyService) {}

  @Get(':id')
  async getAssemblyById(@Param('id') assemblyId: string, @Res() res: Response) {
    const assembly = await this.assemblyService.getAssemblyById(assemblyId);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURI(assembly.name + '.txt')}`,
    );
    const file = createReadStream(assembly.path);
    file.pipe(res);
  }
}
