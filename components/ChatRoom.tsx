"use client";

import { useEffect, useState } from "react";

import {
  ChatMessage,
  getMessages,
  sendMessage,
  subscribeMessages,
  unsubscribeMessages,
} from "@/services/chat.service";

interface Props {
  roomCode: string;
  uid: string;
  name: string;
  avatar: string;
}

export default function ChatRoom({
  roomCode,
  uid,
  name,
  avatar,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  async function loadMessages() {
    const data = await getMessages(roomCode);
    setMessages(data);
  }

  useEffect(() => {
    loadMessages();

    const channel = subscribeMessages(
      roomCode,
      () => {
        loadMessages();
      }
    );

    return () => {
      unsubscribeMessages(channel);
    };
  }, [roomCode]);

  async function handleSend() {
    if (!text.trim()) return;

    await sendMessage({
      room_code: roomCode,
      uid,
      name,
      avatar,
      message: text.trim(),
    });

    setText("");
  }

  return (
    <div className="rounded-2xl bg-zinc-900 p-6">

      <h2 className="mb-5 text-2xl font-bold">
        💬 聊天室
      </h2>

      <div className="mb-5 h-96 overflow-y-auto rounded-xl bg-zinc-800 p-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            尚無訊息
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="mb-4 flex items-start gap-3"
          >
            <img
              src={msg.avatar}
              alt=""
              className="h-10 w-10 rounded-full"
            />

            <div>

              <div className="font-bold text-purple-400">
                {msg.name}
              </div>

              <div className="mt-1 rounded-lg bg-zinc-700 px-4 py-2">
                {msg.message}
              </div>

            </div>
          </div>
        ))}

      </div>

      <div className="flex gap-3">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="輸入聊天內容..."
          className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 outline-none"
        />

        <button
          onClick={handleSend}
          className="rounded-xl bg-purple-600 px-6 font-bold hover:bg-purple-500"
        >
          發送
        </button>

      </div>

    </div>
  );
}