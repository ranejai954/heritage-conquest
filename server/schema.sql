-- Heritage Conquest — MySQL schema
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(120) NULL,
  points        INT          NOT NULL DEFAULT 0,
  crystals      INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS monument_progress (
  id                 CHAR(36)     NOT NULL PRIMARY KEY,
  user_id            CHAR(36)     NOT NULL,
  monument_slug      VARCHAR(80)  NOT NULL,
  minigame_completed TINYINT(1)   NOT NULL DEFAULT 0,
  quiz_completed     TINYINT(1)   NOT NULL DEFAULT 0,
  points_earned      INT          NOT NULL DEFAULT 0,
  crystals_earned    INT          NOT NULL DEFAULT 0,
  badge_earned       TINYINT(1)   NOT NULL DEFAULT 0,
  attempts_used      INT          NOT NULL DEFAULT 0,
  created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_monument (user_id, monument_slug),
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
