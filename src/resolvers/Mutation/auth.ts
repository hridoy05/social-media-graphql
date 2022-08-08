import { prisma } from '@prisma/client';
import { Context } from "../../index";
import validator from 'validator'
import bcrypt from "bcryptjs"
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
    user: null
}
export const authResolvers = {
    signup: async(_:any, {email, name,password,bio}:SignupArgs,{prisma}:Context): Promise<UserPayload>=> {


        const isEmail = validator.isEmail(email)
        if(!isEmail){
            return {
                userErrors: [{
                    message: "Invalid email"
                }],
                user: null
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
                user: null
            }
        }



        if(!name || !bio){
            return {
                userErrors:[
                    {message: "invalid name or bio"}
                ],
                user: null
            }
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword
            }
        })
        return {
            userErrors: [],
            user: null
        }

        // return prisma.user.create({
        //     data: {
        //         email,
        //         name,
        //         password
        //     }
        // })
    }
}