import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors());
app.listen(port, () => console.log(`App is running on port ${port}`));// 4
app.get("/", (req: Request, res: Response, next: NextFunction) =>
  res.status(200).json({ message: "api is live" })
);