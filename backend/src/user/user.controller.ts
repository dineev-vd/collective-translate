import { Controller, Get, UseGuards, Request, Param, Req } from '@nestjs/common';
import { MY_PROFILE_ENDPOINT, USER_ENDPOINT } from 'common/constants';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'guards/simple-guards.guard';
import { ProjectService } from 'project/project.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { UserService } from './user.service';

@Controller(USER_ENDPOINT)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get(MY_PROFILE_ENDPOINT)
  getProfile(@Request() { user }: ExtendedRequest) {
    return user;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/projects')
  getProjectsByUser(
    @Req() { user }: ExtendedRequest,
    @Param('id') id: string
  ) {
    if (user && user.id.toString() == id)
      return this.projectService.findProjectsByUser(id, { withPrivate: true });

    return this.projectService.findProjectsByUser(id);
  }
}
