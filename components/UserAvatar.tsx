"use client";

interface Props {
  photo: string;
  name: string;
  size?: number;
}

export default function UserAvatar({
  photo,
  name,
  size = 42,
}: Props) {
  return (
    <img
      src={photo}
      alt={name}
      width={size}
      height={size}
      className="rounded-full border-2 border-purple-500"
    />
  );
}