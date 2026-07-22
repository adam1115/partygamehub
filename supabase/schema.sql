create table if not exists chat_messages (

    id bigint generated always as identity primary key,

    room_code text not null,

    uid text not null,

    name text not null,

    avatar text not null,

    message text not null,

    created_at timestamptz default now()

);

create index if not exists idx_room_code
on chat_messages(room_code);

alter table chat_messages enable row level security;

create policy "Anyone can read chat"
on chat_messages
for select
using (true);

create policy "Anyone can insert chat"
on chat_messages
for insert
with check (true);