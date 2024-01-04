import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './entities/user.entity';
import { jwtConstants } from 'src/config/token';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService, @InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async addUser(userName: string, uesrPassword: string): Promise<User> {
    const id = this.userModel.length;
    const user = {
      id: id,
      name: userName,
      password: uesrPassword,
      role: Role.User
    }
    // console.log(user);
    return this.create(user);
  }

  isExists(user: User): boolean {
    var tempUser = this.userModel.findOne({ id: user.id, name: user.name, password: user.password, roles: user.role });
    if (tempUser != null)
      return true;
    return false;
  }

  async signup(userName: string, userPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({ name: userName, password: userPassword });
    return new Promise<boolean>((resolve, reject) => {
      if (!user) {
        this.addUser(userName, userPassword).then(() => {
          resolve(true);
        });
      }
      else {
        throw new Error(`User ${userName} already exists`);
      }
    });
  }

  async getUser(): Promise<User[]> {
    // console.log('in userService - getUsers');
    return this.userModel.find().exec();
  }

  async findName(req: any): Promise<string> {
    const token = req.headers.authorization.split(' ')[1];
    const secretKey = jwtConstants.SECRETE_KEY;
    try {
      return await this.jwtService.verifyAsync(token, { secret: secretKey }).then((response) => { return response.username });
    }
    catch (error) {
      return error.message;
    }
  }

  findOne(name: string, password: string): Promise<User> {
    // console.log('in userService - findOne ', name, ' ', password);
    return this.userModel.findOne({ name: name, password: password }).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
