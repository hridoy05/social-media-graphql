import { prisma } from '@prisma/client';
import { Context } from "../../index";
import validator from 'validator'
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import { JWT_SIGNATURE } from '../../keys';
interface SignupArgs{
    email: string;
    name: string;
    bio: string;
    password: string

}

interface UserPayload{
    userErrors: {
        message: String
    }[];
    token : String| null
}
export const authResolvers = {
    signup: async(_:any, {email, name,password,bio}:SignupArgs,{prisma}:Context): Promise<UserPayload>=> {


        const isEmail = validator.isEmail(email)
        if(!isEmail){
            return {
                userErrors: [{
                    message: "Invalid email"
                }],
                token : null
            }
        }

        const isValidPassWord = validator.isLength(password, {
            min: 5
        })
        if(!isValidPassWord){
            return {
                userErrors: [{
                    message: "Invalid password"
                }],
                token : null
            }
        }



        if(!name || !bio){
            return {
                userErrors:[
                    {message: "invalid name or bio"}
                ],
                token: null
            }
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword
            }
        })
        const token = await JWT.sign({
            userId: user.id ,
            email: user.email
        },JWT_SIGNATURE,{
            expiresIn: 3600000
        })
        return {
            userErrors: [],
            token: token
        }

        
    }
}