CREATE DATABASE IF NOT EXISTS games_backlog;
 
USE games_backlog;

CREATE TABLE IF NOT EXISTS games (
  game_id int NOT NULL AUTO_INCREMENT,
  title varchar(100) NOT NULL,
  release_date date,
  platform varchar(100),
  genre varchar(100),
  current_status varchar(20),
  interest varchar(10),
  PRIMARY KEY (game_id)
);
