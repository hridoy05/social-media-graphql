import { Context } from '..';
interface CanUserMutatePostParams {
    userId: number,
    postId: number,
    prisma: Context["prisma"]
}
export const canUserMutatePost = async ({
    userId,
    postId,
    prisma
} :CanUserMutatePostParams) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(!user){
        return {
            userErrors : [{
                message: "User not defind"
            }],
            post: null
        }
    }

    const post = await prisma.post.findUnique({
        where:{
            id: postId
        }
    })
    if(post?.authorId !== user.id){
        return {
            userErrors : [{
                message: "Post dont owned by users"
            }],
            post: null
        } 
    }
}