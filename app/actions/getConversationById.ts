import db from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
            return null;
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include : {
                users : true
            }
        });

        return conversation;
    } catch (error: any) {
        console.log("[ERROR_GETTING_CONVERSATION_BY_ID]", error);
        return null;
    }
};

export default getConversationById;