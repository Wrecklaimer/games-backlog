CREATE DATABASE IF NOT EXISTS games_backlog;
 
USE games_backlog;

CREATE TABLE IF NOT EXISTS games (
  game_id int NOT NULL AUTO_INCREMENT,
  title varchar(100) NOT NULL,
  release_date date,
  platform varchar(100),
  genre varchar(100),
  game_status_id int NOT NULL DEFAULT 0,
  interest_level_id int NOT NULL DEFAULT 0,
  PRIMARY KEY (game_id)
);

CREATE TABLE IF NOT EXISTS game_statuses (
  status_id int NOT NULL,
  game_status varchar(20),
  PRIMARY KEY (status_id)
);

CREATE TABLE IF NOT EXISTS interest_levels (
  interest_id int NOT NULL,
  interest_level varchar(10),
  PRIMARY KEY (interest_id)
);

CREATE VIEW games_view AS
SELECT 
  games.game_id, 
  games.title,
  games.release_date,
  games.platform,
  games.genre,
  gstat.game_status,
  ilvl.interest_level
FROM games
LEFT JOIN game_statuses AS gstat ON games.game_status_id = gstat.status_id
LEFT JOIN interest_levels AS ilvl ON games.interest_level_id = ilvl.interest_id