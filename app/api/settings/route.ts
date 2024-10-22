import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();

        const { name, image } = body;

        if (!currentUser?.id) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const updatedUser = await db.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                name: name,
                image: image,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.log("[SETTINGS_ERROR]", error);
        return NextResponse.json("Internal server error ! while setting up", {
            status: 500,
        });
    }
}