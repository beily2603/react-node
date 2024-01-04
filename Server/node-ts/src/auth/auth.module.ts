import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User, userSchema } from 'src/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from './auth.guard';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from 'src/config/token';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/roles.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.SECRETE_KEY,
    signOptions: { expiresIn: '60s' },
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserService, JwtService, AuthGuard]

  // imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  // //  UserModule,

  //   JwtModule.register({
  //       global: true,
  //       secret: jwtConstants.SECRETE_KEY,
  //       signOptions: { expiresIn: '60s' },
  //   }),

  // ],
  // controllers: [AuthController],
  // providers: [AuthService,
  //   {
  //       provide: APP_GUARD,
  //       useClass: AuthGuard,
  //   },
  //   {
  //       provide: APP_GUARD,
  //       useClass: RolesGuard,
  //   },
  // ],
  // exports: [AuthService],
})
export class AuthModule { }
