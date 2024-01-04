import { Controller, Get, Post, Body, Patch, Param, Req, Put, Header, Delete, HttpCode } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { del, Location, search, update } from './entities/location.entity';
import { Public } from 'src/Decorators/public/public.decorator';
import { Role } from 'src/user/entities/user.entity';
import { Roles } from 'src/Decorators/roles/roles.decorator';
import { log } from 'console';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }
  
  @Post()
  create(@Body() location: Location, @Req() request) {
    console.log('in locationController - create');
    console.log(location)
    return this.locationService.addLocation(request, location);
  }

  @Public()
  @Get('search/:freeSearch/:select')
  search(@Param() search: search) {
    return this.locationService.getBySearch(search);
  }

  @Public()
  @Get('getToHome/:param')
  getToHome(@Param('param') param: string) {
    return this.locationService.getToHome(param);
  }

  @Public()
  @Get('getTempLocations')
  findTemp() {
    console.log('in locationController - findTempAll');
    return this.locationService.getTempLocations();
  }

  @Public()
  @Get('getLocations')
  findAll() {
    return this.locationService.getLocations();
  }

  @Public()
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Get('isAdmin')
  async isAdmin(@Req() request): Promise<boolean> {
    return this.locationService.isAdmin(request);
  }

  @Roles(Role.User)
  @Put('addLike/:id')
  addLike(@Param('id') id: number, @Req() request: any) {
    console.log('locationController - addLike ' + id);
    return this.locationService.addLike(id, request);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update: update) {
    console.log('locationController - update ',id, update.item);
    return this.locationService.update(+id, update.item, update.isTemp);
  }

  @Delete('delete/:id/:isTemp')
  remove(@Param() del: del) {
    console.log('locationController - remove ' + del.id);
    return this.locationService.remove(del.id, del.isTemp);
  }
}