import cloudinary from "@/lib/cloudinary";
import { InternalServerError } from "@/lib/handleError";
import { verifyUser } from "@/lib/verifyuser";
import Post from "@/models/post.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const user_Id = await verifyUser();
        if (!user_Id) return NextResponse.json({ message: "User Not found" }, { status: 404 })

        const { PostFiles, PostData } = await request.json();

        const { caption, location, tags, tagPeople, } = PostData

        if (!PostFiles && !PostData) return NextResponse.json({ message: "Invalid Post" })


        const uploadResponse = await Promise.all(PostFiles?.map((file: string) =>
            cloudinary.uploader.upload(file, {
                resource_type: "video", // This allows uploading both images and videos
                folder: 'Cross_Reels', // Optional: Specify folder name in Cloudinary
            })
        ));
        console.log(uploadResponse);



        const newPost = await Post.create({
            user: user_Id,
            files: uploadResponse,
            caption,
            tags,
            tagPeople,
            location,
        });

        await User.findOneAndUpdate(
            { _id: user_Id },
            { $push: { posts: (newPost)._id } }
        );

        return NextResponse.json({ message: "Post Created Successful", success: true }, { status: 201 })
    } catch (error) {
        return NextResponse.json(InternalServerError(error as Error))
    }
}