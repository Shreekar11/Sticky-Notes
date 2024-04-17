"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cors = require("cors");
const cron = require("node-cron");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
app.use(express_1.default.urlencoded({ extended: true }));
const userRoutes = require("../routes/user.routes");
const noteRoutes = require("../routes/note.routes");
const adminRoutes = require("../routes/admin.routes");
const port = process.env.PORT;
app.use("/user", userRoutes);
app.use("/note", noteRoutes);
app.use("/admin", adminRoutes);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Connected successfully!");
}));
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
// Added cron
app.get("/ping", (req, res) => {
    res.status(200).json("pong....");
});
const API_ENDPOINT = "https://sticky-notes-9hjs.onrender.com";
const makeApiRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(API_ENDPOINT);
        return response.data;
    }
    catch (err) {
        console.error("API request failed:", err.message);
        throw err;
    }
});
const runApiRequestJob = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running API request job...");
    try {
        const responseData = yield makeApiRequest();
        return responseData;
    }
    catch (error) {
        return null;
    }
});
// Schedule the API request job to run every 15 minutes
cron.schedule("*/15 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = yield runApiRequestJob();
    if (responseData) {
        // Process the response data here
        console.log("API request successful:", responseData);
    }
    else {
        console.log("API request failed");
    }
}));
