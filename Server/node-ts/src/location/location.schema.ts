import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Area, Point } from "./entities/location.entity";

export type locationSchema = HydratedDocument<Location>;

@Schema()
export class Location {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    image: string;

    @Prop()
    imageUrl: string;

    @Prop()
    description?: string;

    @Prop()
    area: Area;

    @Prop()
    likes: number;

    @Prop()
    date: Date;

    @Prop()
    imagesList: Array<string>;

    @Prop()
    tempImagesList: Array<string>;

    @Prop()
    information: string;

    @Prop()
    userName: string;

}

export const locationSchema = SchemaFactory.createForClass(Location);