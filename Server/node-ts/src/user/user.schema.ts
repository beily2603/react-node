import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from "./entities/user.entity";

export type userSchema = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    password: string;

    @Prop()
    role: Role;
}

export const userSchema = SchemaFactory.createForClass(User);