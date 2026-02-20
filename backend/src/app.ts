import cors from "cors";
import express, { Request, Response } from "express";
import "dotenv/config";
import userRoutes from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRoutes);

app.use(
  (error: Error, _: Request, res: Response, next: any) => {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error!",
    });
  }
);



export default app;
