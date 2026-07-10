import express from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";

import workspaceRoutes from "./routes/workspaceRoutes";

import authRoutes from "./routes/authRoutes";

import projectRoutes from "./routes/projectRoutes";

import taskRoutes from "./routes/taskRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

import userRoutes from "./routes/userRoutes";

const app = express();

// GLOBAL MIDDLEWARE FIRST

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL as string],

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// HEALTH ROUTE

app.get("/", (req, res) => {
  res.json({
    message: "Project SaaS API Running 🚀",
  });
});

// API ROUTES AFTER MIDDLEWARE

app.use(
  "/api/auth",

  authRoutes,
);

app.use(
  "/api/users",

  userRoutes,
);

app.use(
  "/api/workspaces",

  workspaceRoutes,
);

app.use(
  "/api/projects",

  projectRoutes,
);

app.use(
  "/api/tasks",

  taskRoutes,
);

app.use(
  "/api/dashboard",

  dashboardRoutes,
);

export default app;
