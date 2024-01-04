import { Area, Point } from "../entities/location.entity"

export class CreateLocationDto {
    id: number;
    name: string;
    address: string;
    image: string;
    imageUrl: string;
    imagesList: Array<string>;
    tempImagesList: Array<string>;
    description?: string;
    area: Area;
    likes: number;
    information: string;
    userName?:  string; 
}
