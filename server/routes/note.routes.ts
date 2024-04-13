import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middlewares";
const { createNote } = require("../controllers/note.controller");

const noteRouter: Router = express.Router();

noteRouter.post("/create-note", isAuthenticated, createNote);

module.exports = noteRouter;