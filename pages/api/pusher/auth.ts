import { authOptions } from "@/app/libs/auth";
import { pusherServer } from "@/app/libs/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const session = await getServerSession(request, response, authOptions);

    if (!session?.user?.email) {
        return response.status(401).json({ error: "Not signed in" });
    }

    const socketId = await request.body.socket_id;
    const channel = await request.body.channel_name;
    const data = {
        user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return response.send(authResponse);
}
