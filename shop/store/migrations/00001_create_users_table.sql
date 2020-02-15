CREATE TABLE customer(
   id serial PRIMARY KEY,
   username VARCHAR UNIQUE NOT NULL,
   password VARCHAR NOT NULL
);
