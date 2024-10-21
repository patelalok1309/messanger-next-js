import db from "../libs/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma?.user.findUnique({
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
        return null;
    }
};

export default getCurrentUser;