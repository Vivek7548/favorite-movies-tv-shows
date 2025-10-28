import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

const favoriteSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["MOVIE", "TV_SHOW"]),
  director: z.string().min(1),
  budget: z.string().min(1),
  location: z.string().min(1),
  duration: z.string().min(1),
  yearTime: z.string().min(1),
  description: z.string().optional()
});

const updateSchema = favoriteSchema.partial();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/favorites", async (req, res, next) => {
  try {
    const takeParam = req.query.take ? Number(req.query.take) : 20;
    const take = Number.isNaN(takeParam) ? 20 : Math.min(Math.max(takeParam, 1), 100);
    const cursorParam = req.query.cursor ? Number(req.query.cursor) : undefined;
    const cursor = cursorParam && !Number.isNaN(cursorParam) ? cursorParam : undefined;

    const favorites = await prisma.favorite.findMany({
      take,
      orderBy: { id: "asc" },
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
    });

    const nextCursor = favorites.length === take ? favorites[favorites.length - 1].id : null;

    res.json({ data: favorites, nextCursor });
  } catch (error) {
    next(error);
  }
});

app.post("/favorites", async (req, res, next) => {
  try {
    const payload = favoriteSchema.parse(req.body);
    const created = await prisma.favorite.create({ data: payload });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

app.put("/favorites/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const payload = updateSchema.parse(req.body);
    const updated = await prisma.favorite.update({ where: { id }, data: payload });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete("/favorites/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    await prisma.favorite.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: "Validation error", issues: error.errors });
  }
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
