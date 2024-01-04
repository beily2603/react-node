import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from 'src/config/token';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) { }

  async login(user: User) {
    let token;
    // console.log('in authService');
    // console.log(this.userService.isExists(user));
    if (!(this.userService.isExists(user))) {
      throw new UnauthorizedException();
    }
    const exsitsUser = await this.userService.findOne(user.name, user.password);
    const payload = { sub: exsitsUser.id, username: exsitsUser.name, role: exsitsUser.role };
    // console.log(payload);
    try {
      token = await this.jwtService.signAsync(payload, { secret: jwtConstants.SECRETE_KEY });
      // console.log("token: " + token);
    } catch (err) {
      console.log(err);
    }
    return {
      access_token: token,
    };
  }
}