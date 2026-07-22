"use client";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface ChatMessage {
  roomCode: string;
  uid: string;
  name: string;
  avatar: string;
  message: string;
}

export async function sendMessage(
  data: ChatMessage
) {
  await supabase
    .from("chat_messages")
    .insert({
      room_code: data.roomCode,
      uid: data.uid,
      name: data.name,
      avatar: data.avatar,
      message: data.message,
    });
}

export async function sendSystemMessage(
  roomCode: string,
  message: string
) {
  await supabase
    .from("chat_messages")
    .insert({
      room_code: roomCode,
      uid: "system",
      name: "系統",
      avatar: "/system.png",
      message,
    });
}

export function subscribeRoomChat(
  roomCode: string,
  callback: (messages: any[]) => void
) {
  loadMessages(roomCode, callback);

  const channel = supabase
    .channel(`room-${roomCode}`)

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "chat_messages",
        filter: `room_code=eq.${roomCode}`,
      },
      () => {
        loadMessages(roomCode, callback);
      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
async function loadMessages(
  roomCode: string,
  callback: (messages: any[]) => void
) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_code", roomCode)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return;
  }

  callback(data || []);
}

export async function playerJoined(
  roomCode: string,
  playerName: string
) {
  await sendSystemMessage(
    roomCode,
    `🎉 ${playerName} 加入了房間`
  );
}

export async function playerLeft(
  roomCode: string,
  playerName: string
) {
  await sendSystemMessage(
    roomCode,
    `👋 ${playerName} 離開了房間`
  );
}

export async function playerReady(
  roomCode: string,
  playerName: string
) {
  await sendSystemMessage(
    roomCode,
    `✅ ${playerName} 已準備`
  );
}

export async function playerCancelReady(
  roomCode: string,
  playerName: string
) {
  await sendSystemMessage(
    roomCode,
    `❌ ${playerName} 取消準備`
  );
}

export async function gameStarted(
  roomCode: string
) {
  await sendSystemMessage(
    roomCode,
    `🎮 遊戲開始！`
  );
}

export async function playerKicked(
  roomCode: string,
  playerName: string
) {
  await sendSystemMessage(
    roomCode,
    `🚫 ${playerName} 被房主移出房間`
  );
}

export async function roomClosed(
  roomCode: string
) {
  await sendSystemMessage(
    roomCode,
    `🗑 房主已解散房間`
  );
}