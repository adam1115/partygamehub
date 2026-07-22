"use client";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";

import {
    sendMessage,
    subscribeRoomChat,
} from "@/services/chat.service";

interface ChatMessage {
    id: string;
    uid: string;
    name: string;
    avatar: string;
    message: string;
    created_at: string;
}

export default function RoomChat({
    roomCode,
}: {
    roomCode: string;
}) {

    const { user } = useAuth();

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [text, setText] =
        useState("");

    const bottomRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        const unsubscribe =
            subscribeRoomChat(
                roomCode,
                setMessages
            );

        return unsubscribe;

    }, [roomCode]);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    async function handleSend() {

        if (!user) return;

        if (!text.trim()) return;

        await sendMessage({
            roomCode,
            uid: user.uid,
            name: user.displayName || "",
            avatar: user.photoURL || "",
            message: text,
        });

        setText("");

    }

    return (

        <div className="rounded-2xl bg-zinc-900 p-5">

            <h2 className="mb-4 text-2xl font-bold">
                💬 聊天室
            </h2>

            <div className="mb-4 h-80 overflow-y-auto rounded-xl bg-zinc-800 p-4">

                {messages.map((msg) => {

                    const mine =
                        msg.uid === user?.uid;

                    return (

                        <div
                            key={msg.id}
                            className={`mb-4 flex ${mine
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >

                            <div
                                className={`flex max-w-[80%] gap-3 ${mine
                                    ? "flex-row-reverse"
                                    : ""
                                    }`}
                            >

                                <img
                                    src={msg.avatar}
                                    className="h-10 w-10 rounded-full"
                                />

                                <div>

                                    <div className="mb-1 flex gap-2 text-xs text-gray-400">

                                        <span>

                                            {msg.name}

                                        </span>

                                        <span>

                                            {new Date(
                                                msg.created_at
                                            ).toLocaleTimeString(
                                                "zh-TW",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}

                                        </span>

                                    </div>

                                    <div className="rounded-xl bg-zinc-700 px-4 py-3">

                                        {msg.message}

                                    </div>

                                </div>

                            </div>

                        </div>

                    );

                })}

                <div ref={bottomRef} />

            </div>

            <div className="flex gap-3">

                <input

                    value={text}

                    onChange={(e) =>
                        setText(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            handleSend();

                        }

                    }}

                    className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 outline-none"

                    placeholder="輸入聊天內容..."

                />

                <button

                    onClick={handleSend}

                    className="rounded-xl bg-purple-600 px-6 font-bold hover:bg-purple-500"

                >

                    送出

                </button>

            </div>

        </div>

    );

}