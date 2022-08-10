import { prisma } from '@prisma/client';
import { Context } from "../../index";
import validator from 'validator'
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import { JWT_SIGNATURE } from '../../keys';
import { Token } from 'graphql';

interface SignupArgs{
    credentials: {
        email: string;
        password: string
       }
    name: string;
    bio: string;
   

}
interface SigninArgs{
    credentials: {
        email: string;
        password: string
       }
}

interface UserPayload{
    userErrors: {
        message: String
    }[];
    token : String| null
}
export const authResolvers = {
    signup: async(_:any, {credentials, name,bio}:SignupArgs,{prisma}:Context): Promise<UserPayload>=> {
        const {email, password} = credentials
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
        await prisma.profile.create({
            data:{
                bio,
                userId: user.id
            }
        })
        const token = JWT.sign({
            userId: user.id,
        }, JWT_SIGNATURE, {
            expiresIn: 3600000
        })
        return {
            userErrors: [],
            token: token
        }
   
    },
    signin: async (_:any,{credentials}: SigninArgs, {prisma}: Context): Promise<UserPayload> =>{
        const {email, password} = credentials
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return {
                userErrors:[{
                    message: "Invalid credentials"
                }],
                token: null
            }
        }
       const isMatch = await bcrypt.compare(password,user.password)
       if(!isMatch){
        return {
            userErrors:[{
                message: "Invalid credentials"
            }],
            token: null
        }
       }
       
       return {
        userErrors:[],
        token: JWT.sign({userId: user.id}, JWT_SIGNATURE, {
            expiresIn: 3600000
        })
       }
    }
}