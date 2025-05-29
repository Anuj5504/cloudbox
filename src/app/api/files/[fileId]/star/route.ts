import { db } from "@/db";
import { files } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, props: { params: Promise<{ fildeId: string }> }) {

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { fildeId } = await props.params;

        if (!fildeId) {
            return NextResponse.json({ error: "File id is required" }, { status: 401 });
        }

        const [file] = await db.select().from(files).where(
            and(
                eq(files.id, fildeId),
                eq(files.userId, userId)
            )
        );

        if (!fildeId) {
            return NextResponse.json({ error: "File not found" }, { status: 401 });
        }

        //toggle

        const updatedFiles = await db.update(files).set({ isStarred: !file.isStarred }).where(
            and(
                eq(files.id, fildeId),
                eq(files.userId, userId)
            )
        ).returning();

        const updatedFile = updatedFiles[0];

        return NextResponse.json(updatedFile);

    } catch (error) {
        return NextResponse.json({ error: "File id is required" }, { status: 401 });
    }
}