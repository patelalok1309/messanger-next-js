import db from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return [];
    }

    try {
        const conversations = await db.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc",
            },
            where: {
                userIds: {
                    has: currentUser.id,
                },
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true,
                    },
                },
            },
        });

        return conversations;
    } catch (error) {
        console.log("[ERROR GET_CONVERSATIONS]", error);
        return [];
    }
};

export default getConversations;