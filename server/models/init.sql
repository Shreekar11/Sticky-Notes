create table users(
    user_id serial primary key,
    username varchar(255) unique not null,
    email varchar(255) unique not null,
    password varchar(255) not null,
    is_admin boolean default false,
    created_at timestamp,
    updated_at timestamp
);

create table user_token(
    user_token_id serial primary key,
    fk_user int,
    token varchar(255) not null,
    created_at timestamp,
    constraint fk_user foreign key(fk_user) references users(user_id) on delete cascade on update cascade
);

create table notes(
    note_id serial primary key,
    fk_user int,
    title varchar(255) not null,
    content varchar(255) not null,
    privacy varchar(50) not null,
    created_at timestamp,
    updated_at timestamp
);