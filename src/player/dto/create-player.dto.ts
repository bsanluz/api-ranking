import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreatePlayerDto{
    @IsNotEmpty()
    readonly name: string
    @IsNotEmpty()
    readonly phoneNumber: string
    @IsNotEmpty()
    @IsEmail()
    readonly email: string
}
