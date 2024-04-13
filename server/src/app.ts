import express, { Request, Response, Application, urlencoded } from "express";
require("dotenv").config();
const cors = require("cors");

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const userRoutes = require("../routes/user.routes")
const port = process.env.PORT;

app.use("/user", userRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Connected");
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});


