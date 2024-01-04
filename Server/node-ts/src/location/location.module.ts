import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IdeaLocation, Location } from './entities/location.entity';
import { locationSchema } from './location.schema';

@Module({
  imports: [MongooseModule.forFeature([
  { name: IdeaLocation.name, schema: locationSchema },
  { name: Location.name, schema: locationSchema }])],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule { }
