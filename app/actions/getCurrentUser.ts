import { authOptions } from "../libs/auth";
import db from "../libs/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
    try {
        const session = await getSession();

        console.log("session", session);

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await db?.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        });

        if (!currentUser) {
            return null;
        }
        console.log("currentUser", currentUser);

        return currentUser;
    } catch (error: any) {
        console.log("[ERROR_GETTING_CURRENT_USER]", error);
        return null;
    }
};

export default getCurrentUser;