import express, { Express, Request, Response } from "express";
import http from "http";
import { initSocket } from "./socket";
import cors from "cors";
import inboxRoutes from "./routes/inbox/index";

const app: Express = express();
const port = Number(process.env.SERVER_PORT) || 8085;
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

initSocket(server);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/inbox", inboxRoutes);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
