import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool, initSchema } from "./db.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const PORT = Number(process.env.PORT || 4000);

function sign(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Session expired, please log in again" });
  }
}

async function findUser(where, value) {
  const [rows] = await pool.query(
    `SELECT id, email, display_name, points, crystals FROM users WHERE ${where} = ? LIMIT 1`,
    [value],
  );
  return rows[0] || null;
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, display_name } = req.body || {};
  if (!email || !password || String(password).length < 6)
    return res.status(400).json({ error: "Email and a 6+ character password are required" });
  const existing = await findUser("email", email);
  if (existing) return res.status(409).json({ error: "That email is already registered" });

  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(String(password), 10);
  await pool.query(
    "INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)",
    [id, email, hash, display_name || String(email).split("@")[0]],
  );
  const user = await findUser("id", id);
  res.json({ token: sign(user), user });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  const row = rows[0];
  if (!row || !(await bcrypt.compare(String(password || ""), row.password_hash)))
    return res.status(401).json({ error: "Invalid email or password" });
  const user = await findUser("id", row.id);
  res.json({ token: sign(user), user });
});

app.get("/api/me", auth, async (req, res) => {
  const user = await findUser("id", req.userId);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  res.json({ user });
});

app.get("/api/progress", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT monument_slug, minigame_completed, quiz_completed, points_earned,
            crystals_earned, badge_earned, attempts_used
     FROM monument_progress WHERE user_id = ?`,
    [req.userId],
  );
  res.json({
    rows: rows.map((r) => ({
      ...r,
      minigame_completed: !!r.minigame_completed,
      quiz_completed: !!r.quiz_completed,
      badge_earned: !!r.badge_earned,
    })),
  });
});

// Upsert progress for one monument, then recompute the player's totals.
app.post("/api/progress", auth, async (req, res) => {
  const {
    monument_slug,
    minigame_completed = false,
    quiz_completed = false,
    points_earned = 0,
    crystals_earned = 0,
    badge_earned = false,
    attempts_used = 0,
  } = req.body || {};
  if (!monument_slug) return res.status(400).json({ error: "monument_slug is required" });

  await pool.query(
    `INSERT INTO monument_progress
       (id, user_id, monument_slug, minigame_completed, quiz_completed,
        points_earned, crystals_earned, badge_earned, attempts_used)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       minigame_completed = VALUES(minigame_completed),
       quiz_completed = VALUES(quiz_completed),
       points_earned = VALUES(points_earned),
       crystals_earned = VALUES(crystals_earned),
       badge_earned = VALUES(badge_earned),
       attempts_used = VALUES(attempts_used)`,
    [
      crypto.randomUUID(),
      req.userId,
      monument_slug,
      minigame_completed ? 1 : 0,
      quiz_completed ? 1 : 0,
      points_earned,
      crystals_earned,
      badge_earned ? 1 : 0,
      attempts_used,
    ],
  );

  await pool.query(
    `UPDATE users u SET
       u.points = (SELECT COALESCE(SUM(points_earned),0) FROM monument_progress WHERE user_id = u.id),
       u.crystals = (SELECT COALESCE(SUM(crystals_earned),0) FROM monument_progress WHERE user_id = u.id)
     WHERE u.id = ?`,
    [req.userId],
  );

  res.json({ ok: true });
});

initSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`Heritage Conquest API on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Could not connect to MySQL:", err.message);
    process.exit(1);
  });
