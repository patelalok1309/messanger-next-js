"use client";

import { useEffect, useRef, useState } from "react";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";

import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        const id = Array.isArray(conversationId)
            ? conversationId[0]
            : conversationId;
        pusherClient.subscribe(id);
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }

                return [...current, message];
            });

            bottomRef?.current?.scrollIntoView();
        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }

                    return currentMessage;
                })
            );
        };

        const messageDeleteHandler = (deletedMessage: any) => {
            setMessages((currentMessages) =>
                currentMessages.filter(
                    (message) => message.id !== deletedMessage
                )
            );
        };

        const singleMessageDeleteHandler= (deletedMessage : any) => {
            console.log("deletedMessage" , deletedMessage)
            setMessages((currentMessages) =>
                currentMessages.filter(
                    (message) => message.id !== deletedMessage.messageId
                )
            );
        }

        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("message:update", updateMessageHandler);
        pusherClient.bind("messages:delete", messageDeleteHandler);
        pusherClient.bind("message:delete" , singleMessageDeleteHandler);

        return () => {
            pusherClient.unsubscribe(id);
            pusherClient.unbind("messages:new", messageHandler);
            pusherClient.unbind("message:update", updateMessageHandler);
            pusherClient.unbind("messages:delete", messageDeleteHandler);
            pusherClient.bind("message:delete" , singleMessageDeleteHandler);
        };
    }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    );
};

export default Body;
