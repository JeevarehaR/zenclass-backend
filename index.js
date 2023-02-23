import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
// console.log(MONGO_URL);

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}

export const client = await createConnection();

app.get("/", function (request, response) {
  response.send("Hello 🙋‍♂️, 🌏🎊✨🤩 Welcome to my App!");
});

app.use("/user", userRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
