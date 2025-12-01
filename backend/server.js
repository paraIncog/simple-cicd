const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// DB connection (values will come from docker-compose env vars)
const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "myapp",
  port: 5432
});

app.get("/api/hello", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    res.json({
      message: "Hello from backend!",
      time: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
