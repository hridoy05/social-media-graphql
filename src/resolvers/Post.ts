import { Context } from ".."

interface PostParentType {
    authorId: number
}


export const Post ={
    user: (parent: PostParentType, {userId}: {userId: string}, {prisma}: Context)=> {
        return prisma.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
    }
    
}