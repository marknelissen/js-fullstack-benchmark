import crypto from "crypto";
import express from "express";

const server = express();

// server.use(helmet());
// server.use(express.json());

server.get("/api/id", (req, res) => {
  res.json({ id: crypto.randomUUID() });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
