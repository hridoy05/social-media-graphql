import { Query } from './resolvers/index'
import {ApolloServer, gql} from "apollo-server"
import {typeDefs} from "./schema"


const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query
    }
})

server.listen().then(({url})=> {
    console.log(`Server running in ${url}`);
    
})