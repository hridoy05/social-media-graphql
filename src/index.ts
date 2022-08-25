import { Mutation } from './resolvers/Mutation/Mutation';
import { Query } from './resolvers/index'
import {ApolloServer, gql} from "apollo-server"
import {typeDefs} from "./schema"
import {PrismaClient, Prisma} from '@prisma/client'
import { getUserFromToken } from './utils/getUserFromToken';

const prisma = new PrismaClient()


export interface Context{
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>,
    userInfo:{
        userId: number
    }
}
const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query,
        Mutation
    },
    context: async ({req}: any) => {
        const userInfo = await getUserFromToken(req.headers.authorization)
        return {
            prisma,
            userInfo
        }
    }
})

server.listen().then(({url})=> {
    console.log(`Server running in ${url}`);
    
})