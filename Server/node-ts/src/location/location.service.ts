import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './location.schema';
import { jwtConstants } from 'src/config/token';
import { JwtService } from '@nestjs/jwt';
import { Area, IdeaLocation, search } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Location.name) private locationModel: Model<Location>,
    @InjectModel(IdeaLocation.name) private ideaModel: Model<IdeaLocation>
  ) { }

  likes: number;
  id: number;

  async create(request: any, createLocationDto: CreateLocationDto) {
    console.log('location in create: ', createLocationDto);
    if (await this.isAdmin(request)) {
      this.locationModel.countDocuments().exec().then(res => {
        const newId = res + 1;
        createLocationDto.id = newId;
        const createLocation = new this.locationModel(createLocationDto);
        return createLocation.save();
      });
    }
    else {
      this.ideaModel.countDocuments().exec().then(res => {
        const newId = res + 2;
        createLocationDto.id = newId;
        const createLocation = new this.ideaModel(createLocationDto);
        return createLocation.save();
      });
    }
  }

  async isAdmin(request: any): Promise<boolean> {
    const token = request.headers.authorization.split(' ')[1];
    const secretKey = jwtConstants.SECRETE_KEY;
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, { secret: secretKey });
      const role = decodedToken.role;
      if (role === "user" || role === "User") {
        return false;
      }
      else
        return true;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return false;
    }
  }

  async addLocation(request: any, createLocationDto: Location) {
    console.log('in locationService - addLocations');
    console.log(this.locationModel.countDocuments)
    const location = {
      id: 0,
      name: createLocationDto.name,
      address: createLocationDto.address,
      image: createLocationDto.image,
      imageUrl: createLocationDto.imageUrl,
      imagesList: createLocationDto.imagesList,
      tempImagesList: createLocationDto.tempImagesList,
      description: createLocationDto.description,
      area: createLocationDto.area,
      likes: createLocationDto.likes,
      date: Date.now(),
      information: createLocationDto.information,
      userName: createLocationDto.userName
    }
    this.create(request, location);
  }

  async getTempLocations(): Promise<Location[]> {
    console.log('in locationService - getTempLocations');
    return this.ideaModel.find().exec();
  }

  async getLocations(): Promise<Location[]> {
    console.log('in locationService - getLocations');
    return this.locationModel.find().exec();
  }

  index: number;

  levenshteinDistance(str1: string, str2: string): string {
    const len1 = str1.length;
    const len2 = str2.length;

    let matrix = Array(len1 + 1);
    for (let i = 0; i <= len1; i++) {
      matrix[i] = Array(len2 + 1);
    }

    for (let i = 0; i <= len1; i++) {
      matrix[i][0] = i;
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          );
        }
      }
    }

    return matrix[len1][len2];
  }

  async getBySearch(search: search) {
    const keys = Object.keys(Area);
    const values = Object.values(Area);
    keys.forEach((key, index) => {
      if (key === search.select)
        this.index = index;
    });
    const area = values.filter((key, index) => index === this.index)[0];
    let freeSearch = ' ';
    if (search.freeSearch != ' ')
      freeSearch = search.freeSearch.trim();
    let containsWord: Location[] = [];
    let levenshteinResult: [][] = [];
    let allLocations: Location[] = [];
    if (search.select === "allEarth") {
      this.locationModel.find({
        $or: [
          { "address": { $regex: freeSearch } }, { "name": { $regex: freeSearch } }, { "area": { $regex: freeSearch } }
        ]
      }).exec().then((response) => {
        console.log('response: ', response);
        containsWord = response;
        // console.log(containsWord);
      });
    }
    else {
      this.locationModel.find({
        $and: [
          {
            $or: [
              {
                $or: [
                  { "address": { $regex: freeSearch } }, { "name": { $regex: freeSearch } }, { "area": { $regex: freeSearch } }
                ]
              }, { "area": area }
            ]
          },
          { "area": area },
          {
            $or: [
              { "address": { $regex: freeSearch } }, { "name": { $regex: freeSearch } }, { "area": { $regex: freeSearch } }
            ]
          }
        ]
      }).exec().then((response) => {
        console.log('response: ', response);
        containsWord = response;
        // console.log(containsWord);
      });
    }

    const data = this.locationModel.find().exec().then((response) => {
      let locations: Location[] = [];
      if (search.select != 'allEarth')
        locations = response.filter(res => res.area === area);
      else
        locations = response;
      locations.forEach((key) => {
        const newData = containsWord.filter(contain => contain.name === key.name);
        if (!newData[0]) {
          const result = this.levenshteinDistance(key.name, freeSearch);
          if (levenshteinResult[result] === undefined) {
            levenshteinResult[result] = [key];
          }
          else
            levenshteinResult[result].push(key);
        }
      });

      const newLevenshteinResult: Location[] = [];
      allLocations = containsWord;
      for (let index = 0; index < levenshteinResult.length; index++) {
        if (levenshteinResult[index] != null)
          for (let i = 0; i < levenshteinResult[index].length; i++) {
            newLevenshteinResult.push(levenshteinResult[index][i]);
          }
      }
      console.log('containWord: ', containsWord);
      console.log('newLevenshteinResult: ', newLevenshteinResult);
      allLocations = containsWord.concat(newLevenshteinResult);
      return allLocations.filter((location, index) => index < 10);
    });
    return data;
  }


  async getToHome(param: string): Promise<Location[]> {
    if (param == "likes") {
      return this.locationModel.find().sort({ likes: -1 }).limit(3).exec();
    }
    if (param == "last") {
      return this.locationModel.find().sort({ date: -1 }).limit(3).exec();
    }
  }
  async getId() {
    this.ideaModel.countDocuments().exec().then(res => { console.log(res); return res; });
  }
  async addLike(id: number, request: any) {
    return this.locationModel.findOne({ "id": id }).then((response => {
      this.likes = response.likes;
      console.log('likes: ' + this.likes);
      console.log(response);
      this.locationModel.updateOne({ "id": id }, { "likes": this.likes + 1 }).exec();
    }));
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: number) {
    console.log('in locationService - findOne');
    return `This action returns a #${id} location`;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto, isTemp: any) {
    if (isTemp === 'false' || !isTemp) {
      console.log('!isTemp')
      this.locationModel.findOne({ "id": id }).then((res) => console.log(res));
      return this.locationModel.updateOne({ "id": id }, updateLocationDto).exec().then((response) => console.log(response));
    }
    else {
      console.log('temp');
      return this.ideaModel.updateOne({ "id": id }, updateLocationDto).exec();
    }
  }

  async remove(id: number, isTemp: any) {
    console.log(typeof isTemp);
    if (isTemp === 'true') {
      console.log('isTemp');
      const result = await this.ideaModel.findOne({ id }).exec();
      console.log(result);
      return this.ideaModel.deleteOne({ id }).exec();
    } else {
      console.log('!isTemp');
      const result = this.locationModel.find({ "id": id }).exec();
      console.log(result);
      return this.locationModel.deleteOne({ id }).exec();
    }
  }
}