
import { Post, prisma, Prisma } from "@prisma/client";
import { Context } from "../../index";

interface PostCreateArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}
export const postResolvers = {
    postCreate: async (
        _: any,
        { post }: PostCreateArgs,
        { prisma }: Context
      ): Promise<PostPayloadType> => {
        const { title, content } = post;
        if (!title || !content) {
          return {
            userErrors: [
              {
                message: " you must provide title and content to create a post",
              },
            ],
            post: null,
          };
        }
    
        return {
          userErrors: [
            {
              message: "No errors",
            },
          ],
          post: prisma.post.create({
            data: {
              title,
              content,
              authorId: 1,
            },
          }),
        };
      },
      postUpdate: async (
        _: any,
        { post, postId }: { postId: string; post: PostCreateArgs["post"] },
        { prisma }: Context
      ): Promise<PostPayloadType> => {
        const { title, content } = post;
        if (!title && !content) {
          return {
            userErrors: [
              {
                message: "need to have at field to update",
              },
            ],
            post: null,
          };
        }
    
        const existingProduct = await prisma.post.findUnique({
          where: {
            id: Number(postId),
          },
        });
    
        if (!existingProduct) {
          return {
            userErrors: [
              {
                message: "Post does not exist",
              },
            ],
            post: null,
          };
        }
        let payLoadToUpdate = {
          title,
          content,
        };
        if (!title) delete payLoadToUpdate.title;
        if (!content) delete payLoadToUpdate.content;
        return {
          userErrors: [],
          post: prisma.post.update({
            data: {
              ...payLoadToUpdate,
            },
            where: {
              id: Number(postId),
            },
          }),
        };
      },
    
      postDelete: async (_:any, {postId}:{postId: string},{prisma}:Context): Promise<PostPayloadType> =>{
        const existingPost = await prisma.post.findUnique({
            where:{
                id: Number(postId)
            }
        })
        if (!existingPost) {
            return {
              userErrors: [
                {
                  message: "Post does not exist",
                },
              ],
              post: null,
            };
          }
          await prisma.post.delete({
            where:{
                id: Number(postId)
            }
          })
    
          return{
            userErrors:[],
            post:existingPost
          }
      }
}