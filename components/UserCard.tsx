"use client";

import UserAvatar from "./UserAvatar";

interface Props {
  photo: string;
  name: string;
}

export default function UserCard({
  photo,
  name,
}: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-zinc-900 p-3">

      <UserAvatar
        photo={photo}
        name={name}
      />

      <div>

        <div className="font-bold">
          {name}
        </div>

        <div className="text-sm text-green-400">
          已登入
        </div>

      </div>

    </div>
  );
}