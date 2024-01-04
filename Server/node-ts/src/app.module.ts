import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from './location/location.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UserModule, LocationModule, AuthModule,  
    MongooseModule.forRoot('mongodb://localhost/PhotographLocations')
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }