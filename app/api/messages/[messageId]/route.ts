import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
    messageId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = await request.json();
        const messageId = params.messageId;

        if (!messageId || !conversationId) {
            return NextResponse.json("Message or conversation Id not found", {
                status: 404,
            });
        }

        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const existingMessage = await db.message.findUnique({
            where: {
                id: messageId,
            },
            include: {
                sender: true,
            },
        });

        if (!existingMessage) {
            return NextResponse.json("Message not found", { status: 404 });
        }

        if (existingMessage.sender.id !== currentUser.id) {
            return NextResponse.json("Unauthorized", { status: 403 });
        }

        // Fetch the conversation with message ids before deleting the message
        const messagesInConversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
            },
            select: {
                messagesIds: true,
                messages: true,
            },
        });

        const filteredMessageIds = messagesInConversation?.messagesIds.filter(
            (id) => id !== messageId
        ) as string[];

        // Delete the message first
        await db.message.delete({
            where: {
                id: messageId,
            },
        });

        // Update the conversation by setting the filtered messages ids
        const updatedConversation = await db.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                messagesIds: {
                    set: filteredMessageIds,
                },
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                    },
                },
            },
        });

        // Inform other users via Pusher
        updatedConversation.users.map((user) => {
            pusherServer.trigger(user?.email!, "message:delete", {
                messageId: messageId,
            });
        });

        // Now fetch the updated last message in the conversation
        const lastMessage =
            updatedConversation.messages[
                updatedConversation.messages.length - 1
            ];

        console.log("[lastMessage]", lastMessage?.body);

        // Trigger the conversation update with the new last message
        await pusherServer.trigger(currentUser.email, "conversation:update", {
            id: conversationId,
            messages: [lastMessage],
        });

        return NextResponse.json(updatedConversation);
    } catch (error: any) {
        console.log("[ERROR_DELETING_MESSAGE]", error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}
