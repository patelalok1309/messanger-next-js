import getUsers from "../actions/getUser";
import Sidebar from "../components/Sidebar";
import UserList from "./components/UserList";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const users = await getUsers();

    return (
        <Sidebar>
            <UserList items={users} />
            <div className="h-full">{children}</div>
        </Sidebar>
    );
}
