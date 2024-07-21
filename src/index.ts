import express from "express";
import { connectMongoDB } from "./lib/mongodb";
import dotenv from "dotenv";
import router from "./routes";
const cors = require("cors");

dotenv.config();

const app = express();

connectMongoDB();

app.use(express.json());
app.use(cors());
app.use("/", router);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
