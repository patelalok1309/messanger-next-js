"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import ImageModal from "./ImageModal";
import MessageContextMenu from "./MessageContextMenu";

interface MessageBoxProps {
    isLast?: boolean;
    data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const contextMenuRef = useRef<HTMLDivElement>(null);

    const isOwn = useMemo(() => {
        return session?.data?.user?.email === data?.sender?.email;
    }, [data?.sender?.email, session]);

    const seenList = useMemo(() => {
        return (data.seen || [])
            .filter((user) => user.email !== data?.sender?.email)
            .map((user) => user.name)
            .join(", ");
    }, [data.seen, data?.sender?.email]);

    const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
    const avatar = clsx(isOwn && "order-2");
    const body = clsx("flex flex-col gap-2 relative", isOwn && "items-end");

    const message = clsx(
        " text-sm w-fit overflow-hidden",
        isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
        data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
    );

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuPosition({ x: e.pageX, y: e.pageY });
        setShowMenu(true);
    };

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body} onContextMenu={handleContextMenu}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), "p")}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image
                            onClick={() => setImageModalOpen(true)}
                            alt="Image"
                            height="288"
                            width="288"
                            src={data.image}
                            className="w-auto h-auto object-cover cursor-pointer hover:scale-110 transition translate"
                            priority={true}
                        />
                    ) : (
                        <>
                            <div>{data.body}</div>
                            <MessageContextMenu
                                isOpen={showMenu}
                                position={menuPosition}
                                reference={contextMenuRef}
                                onClose={() => setShowMenu(false)}
                                data={data}
                            />
                        </>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-gray-500">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBox;
