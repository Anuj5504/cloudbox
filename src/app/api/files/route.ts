import { db } from "@/db";
import { files } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { Equal } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams=request.nextUrl.searchParams;
        const queryUserId=searchParams.get("userId");
        const parentId=searchParams.get("parentId");

        if(!queryUserId || queryUserId!==userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let userFiles;

        if(parentId) {
            userFiles=await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    eq(files.parentId,parentId)
                )
            )
        }
        else {
            userFiles=await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    isNull(files.parentId)
                )
            )
        }

        if(!userFiles) {
            return NextResponse.json({ error: "Error in fetching user files from database" }, { status: 501 });
        }

        return NextResponse.json({success:true,message:"Fetched data",userFiles});
    } catch (error) {
         return NextResponse.json({ error: "Failed to fetching files" }, { status: 401 });
    }
}