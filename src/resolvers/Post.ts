import { Context } from ".."
import { userLoader } from "../loaders/userLoaders"

interface PostParentType {
    authorId: number
}


export const Post ={
    user: (parent: PostParentType, {userId}: {userId: string}, {prisma}: Context)=> {
        return userLoader.load(parent.authorId)
    }
    
}