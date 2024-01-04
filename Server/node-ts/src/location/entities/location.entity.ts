
export enum Area {
    north = "צפון",
    Jerusalem = "ירושלים והסביבה",
    center = "מרכז",
    south = "דרום",
    YehudaAndShomron = "יהודה ושומרון",
    allEarth = "כל הארץ"
}

export class Point {
    lat: number;
    lng: number;
}

export class Location { 
    id: number;
    name: string;
    address: string;
    image: string;
    imageUrl: string;
    description?: string;
    area: Area;
    likes: number;
    date: Date;
    imagesList: Array<string>;
    tempImagesList: Array<string>;
    information: string;
    userName: string;
}

export interface search {
    freeSearch: string;
    select: string;
}

export interface del {
    id: number;
    isTemp: boolean;
}
export interface update {
    item: Location;
    isTemp: boolean;
}
export class IdeaLocation extends Location {}