export type RoomStatus = "waiting" | "playing" | "finished";

export interface Room {
  roomCode: string;
  roomName: string;
  host: string;
  status: RoomStatus;
  createdAt: Date;
}