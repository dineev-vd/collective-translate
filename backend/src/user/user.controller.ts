import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { MY_PROFILE_ENDPOINT, USER_ENDPOINT } from 'common/constants';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { UserService } from './user.service';

@Controller(USER_ENDPOINT)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }


    @UseGuards(JwtAuthGuard)
    @Get(MY_PROFILE_ENDPOINT)
    getProfile(@Request() { user }: ExtendedRequest) {
        return user;
    }

    @Get(":id")
    getUserById(@Param("id") id: string) {
        return this.userService.findById(id);
    }

}
