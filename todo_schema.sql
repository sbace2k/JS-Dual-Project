USE todoApp;

create table users (
    user_id int primary key auto_increment,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null
);

create table tasks (
    task_id int primary key auto_increment,
    user_id int,
    task varchar(255) not null,
    completed boolean default false,
    created_at timestamp default current_timestamp,
    deadline date,
    foreign key (user_id) references users(user_id) on delete cascade
);