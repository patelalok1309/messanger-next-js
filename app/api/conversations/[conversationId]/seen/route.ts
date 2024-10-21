import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();

        const { conversationId } = params;

        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        // Find the existing conversation
        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return NextResponse.json("Invalid ID", { status: 400 });
        }

        const lastMessage =
            conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        // Update seen of last message

        const updatedMessage = await db.message.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
        });

        return NextResponse.json(updatedMessage);
    } catch (error: any) {
        console.log("[ERROR MESSAGES SEEN", error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}
