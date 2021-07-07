DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS lifegroup;
DROP TABLE IF EXISTS lifegroup_member;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  discipler_id INTEGER,
  FOREIGN KEY (discipler_id) REFERENCES user (id)
);

CREATE TABLE lifegroup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  address TEXT,
  schedule TEXT,
  host_id INTEGER,
  leader_id INTEGER,
  FOREIGN KEY (host_id) REFERENCES user (id)
  FOREIGN KEY (leader_id) REFERENCES user (id)
);

CREATE TABLE lifegroup_member (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lifegroup_id INTEGER,
  user_id INTEGER,
  FOREIGN KEY (lifegroup_id) REFERENCES lifegroup (id),
  FOREIGN KEY (user_id) REFERENCES user (id)
);
