import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Req,
  Post,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { MY_PROFILE_ENDPOINT, USER_ENDPOINT } from 'util/constants';
import { ChangeUserDto, GetUserDto } from 'dto/user.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'guards/simple-guards.guard';
import { ProjectService } from 'modules/project/project.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(USER_ENDPOINT)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ type: GetUserDto })
  @UseGuards(JwtAuthGuard)
  @Get(MY_PROFILE_ENDPOINT)
  getProfile(@Request() { user }: ExtendedRequest): GetUserDto {
    return user;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  changeUser(
    @Param('id') id: string,
    @Body() changes: ChangeUserDto,
    @Req() { user }: ExtendedRequest,
  ) {
    if (user.id.toString() !== id) {
      throw new ForbiddenException();
    }

    return this.userService.updateUser(id, changes);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/projects')
  getProjectsByUser(@Req() { user }: ExtendedRequest, @Param('id') id: string) {
    if (user && user.id.toString() == id)
      return this.projectService.findProjectsByUser(id, { withPrivate: true });

    return this.projectService.findProjectsByUser(id);
  }
}
