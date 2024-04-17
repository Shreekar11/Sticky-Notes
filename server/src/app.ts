import axios from "axios";
import express, { Request, Response, Application, urlencoded } from "express";
require("dotenv").config();
const cors = require("cors");
const cron = require("node-cron");

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require("../routes/user.routes");
const noteRoutes = require("../routes/note.routes");
const adminRoutes = require("../routes/admin.routes");

const port = process.env.PORT;

app.use("/user", userRoutes);
app.use("/note", noteRoutes);
app.use("/admin", adminRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Connected successfully!");
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

// Added cron

app.get("/ping", (req, res) => {
  res.status(200).json("pong....");
});

const API_ENDPOINT = "https://sticky-notes-9hjs.onrender.com";

const makeApiRequest = async () => {
  try {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  } catch (err: any) {
    console.error("API request failed:", err.message);
    throw err;
  }
};

const runApiRequestJob = async () => {
  console.log("Running API request job...");
  try {
    const responseData = await makeApiRequest();
    return responseData;
  } catch (error) {
    return null;
  }
};

// Schedule the API request job to run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  const responseData = await runApiRequestJob();
  if (responseData) {
    // Process the response data here
    console.log("API request successful:", responseData);
  } else {
    console.log("API request failed");
  }
});
