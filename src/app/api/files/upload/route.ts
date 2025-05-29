import { db } from "@/db";
import { files } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { form, image } from "@heroui/theme";
import { or, and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";


const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
})


export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData=await request.formData();
        const formFile = formData.get("file") as File;
        const formUserId=formData.get("userId") as string;
        const formParentId=formData.get("parentId") as string || null;

        if(formUserId!=userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(!formFile) {
            return NextResponse.json({ error: "No file provided" }, { status: 401 });
        }

        if(formParentId) {
            const [parentFolder] = await db.select().from(files).where(
                and(
                    eq(files.id,formParentId),
                    eq(files.userId,userId),
                    eq(files.isFolder,true)
                )
            )

            if(!parentFolder) {
                return NextResponse.json({ error: "Parent folder does not exist" }, { status: 401 });
            }
        }

        if(!formFile.type.startsWith("image/") && formFile.type !== "application/pdf") {
            return NextResponse.json({ error: "Invalid file type. Only images and PDFs are allowed." }, { status: 400 });
        }


        const buffer=await formFile.arrayBuffer();
        const fileBuffer=Buffer.from(buffer);
        const originalFileName=formFile.name;

        const fileExtention=originalFileName.split(".").pop()||'';


        if(fileExtention.length===0) {
            return NextResponse.json({ error: "No file extention" }, { status: 401 });
        }


        const folderPath = formParentId ? `/cloudbox/${userId}/folder/${formParentId}` : `/cloudbox/${userId}`;
        const uniqueFilename=`${uuidv4()}.${fileExtention}`;
        
           const uploadResponse= await imagekit.upload({
            file:fileBuffer,
            fileName:uniqueFilename,
            folder:folderPath,
            useUniqueFileName:false
        })

        const fileData={
            name:originalFileName,
            path:uploadResponse.filePath,
            size:formFile.size,
            type:formFile.type,
            fileUrl:uploadResponse.url,
            thumbnailUrl:uploadResponse.thumbnailUrl || null,
            userId,
            parentId:formParentId,
            isFolder:false,
            isStarred:false,
            isTrash:false
        }

       const [newFile] = await db.insert(files).values(fileData).returning();

       return NextResponse.json(newFile);

    } catch (error) {
        return NextResponse.json({ error: "Error while uploading image in imagekit" }, { status: 401 });
    }
}