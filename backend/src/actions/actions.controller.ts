import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PostActionDto } from 'common/dto/action.dto';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { ActionsService } from './actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async postActions(
    @Request() { user }: ExtendedRequest,
    @Body() actions: PostActionDto[],
  ) {
    return Promise.all(
      actions.map((action) => {
        return this.actionsService.processAction(action, user);
      }),
    );
  }
}
