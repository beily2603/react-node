import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/Decorators/public/public.decorator';
import { Role } from './entities/user.entity';
import { Roles } from 'src/Decorators/roles/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @Post()
  // addUser(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Public()
  @Post()
  // @ApiOperation({ summary: 'Sign up' })
  async signup(@Body('name') name: string, @Body('password') password: string) {
    // console.log('in controller- signup');
    return await this.userService.signup(name, password);
  }

  @Roles(Role.Admin)
  @Get('/getUsers')
  getUsers() {
    console.log('in userController - getUsers');
    return this.userService.getUser();
  }

  @Public()
  @Get('/userName')
  async findName(@Req() request): Promise<string> {
    return this.userService.findName(request);
  }

  @Get('/findOne')
  findOne(@Body('name') name: string, @Body('password') password: string) {
    // console.log('userController - findOne');
    return this.userService.findOne(name, password);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
