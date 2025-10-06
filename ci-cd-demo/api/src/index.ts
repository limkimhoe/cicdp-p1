import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

app.get("/api/health", async (_, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/tasks", async (_, res) => res.json(await prisma.task.findMany()));
app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;
  const task = await prisma.task.create({ data: { title } });
  res.status(201).json(task);
});

const PORT = Number(process.env.PORT || 5175);
app.listen(PORT, () => console.log(`API on :${PORT}`));
