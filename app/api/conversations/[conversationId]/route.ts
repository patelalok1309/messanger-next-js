import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const existingConversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });

        if (!existingConversation) {
            return NextResponse.json("Invalid ID", { status: 400 });
        }

        const deletedConversaton = await db.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id],
                },
            },
        });

        return NextResponse.json(deletedConversaton);
    } catch (error: any) {
        console.log("[ERROR_DELETING_CONVERSATION]", error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}