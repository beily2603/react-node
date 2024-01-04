import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.schema';
import { Public } from 'src/Decorators/public/public.decorator';


@Controller('auth')
export class AuthController {
  u: User = new User();
  constructor(private readonly authService: AuthService) { }
  
  @Public()
  @Post()
  async login(@Body('name') name: string, @Body('password') password: string) {
    // console.log('in authController \nname=' + name + " password=" + password);
    this.u.name = name;
    this.u.password = password;
    // console.log(this.u);
    return await this.authService.login(this.u);
  }

}
