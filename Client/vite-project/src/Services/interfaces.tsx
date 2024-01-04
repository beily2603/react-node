export enum Area {
    north = "צפון",
    Jerusalem = "ירושלים והסביבה",
    center = "מרכז",
    south = "דרום",
    YehudaAndShomron = "יהודה ושומרון",
    allEarth = "כל הארץ"
}
export interface location {
    id: number;
    name: string;
    address: string;
    imageUrl: string;
    description: string;
    area: string;
    likes: number;
    date: Date;
    imagesList: Array<string>;
    tempImagesList: Array<string>;
    point: Point;
    information: string;
    userName?: string;
}
export interface Point{
    lat: number;
    lng: number;
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
    item: location;
    isTemp: boolean;
}