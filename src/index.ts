import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.SERVER_PORT || 8085;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server iii");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
