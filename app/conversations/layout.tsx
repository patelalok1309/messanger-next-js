import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUser";
import Sidebar from "../components/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList users={users} initialItems={conversations} />
                {children}
            </div>
        </Sidebar>
    );
}
