"use client";

import ContextMenu from "@/app/components/ContextMenu";
import { pusherClient } from "@/app/libs/pusher";
import { FullMessageType } from "@/app/types";
import axios from "axios";
import { useEffect } from "react";

interface MessageContextMenuProps {
    isOpen?: boolean;
    position: { x: number; y: number };
    reference: React.RefObject<HTMLDivElement>;
    onClose: () => void;
    data: FullMessageType;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
    isOpen,
    onClose,
    position,
    reference,
    data,
}) => {
    const contextMenuOptions = [
        { value: "copy", label: "Copy Message" },
        { value: "delete", label: "Delete Message" },
        { value: "close", label: "Close" },
    ];

    const handleChangeContextMenu = (selected: Record<string, any>) => {
        console.log("selected", selected.value);
        if (selected.value === "delete") {
            handleDeleteMessage();
        }
        onClose();
    };

    const handleDeleteMessage = () => {
        axios
            .delete(`/api/messages/${data.id}`, {
                data: { conversationId: data.conversationId },
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };

    const handleOutSideClick = (event: MouseEvent) => {
        if (
            isOpen &&
            reference.current &&
            reference.current.contains(event.target as Node)
        ) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutSideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutSideClick);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <ContextMenu
            x={position.x}
            y={position.y}
            options={contextMenuOptions}
            onSelect={handleChangeContextMenu}
        />
    );
};

export default MessageContextMenu;
