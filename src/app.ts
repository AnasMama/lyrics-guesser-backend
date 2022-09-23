import express, { Application, Request, Response} from "express";
import * as dotenv from "dotenv";
import router from "./router";
import cors from 'cors';

dotenv.config();

const app: Application = express();

const PORT = process.env.SERVER_PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials : true
};

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
