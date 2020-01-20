START TRANSACTION;

CREATE DATABASE shop;

CREATE TABLE IF NOT EXISTS registration (
 id int not null,
 username text not null,
 password int not null
);

COMMIT;
