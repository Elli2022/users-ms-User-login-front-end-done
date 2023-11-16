import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "../routes/authRoutes"; // Uppdatera sökvägen efter behov
import { logger } from "./libs/logger"; // Uppdatera sökvägen efter behov
import config from "./config"; // Uppdatera sökvägen efter behov

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(compression());

app.use((req, res, next) => {
  logger.info(`[EXPRESS] Inkommande förfrågan: ${req.method} ${req.path}`);
  next();
});

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Välkommen till API:et!" });
});

const port = config.NODE_PORT || 3000;
app.listen(port, () => {
  logger.info(`[${config.APP_NAME}] Server lyssnar på port ${port}`);
});

export default app;
