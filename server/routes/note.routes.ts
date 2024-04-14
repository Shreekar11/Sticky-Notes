import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middlewares";
const { createNote } = require("../controllers/note.controller");
const { editNote } = require("../controllers/note.controller");
const { getAllNotes } = require("../controllers/note.controller");

const noteRouter: Router = express.Router();

noteRouter.post("/create-note", isAuthenticated, createNote);
noteRouter.get("/get-all-notes", isAuthenticated, getAllNotes);
noteRouter.put("/edit-note/:noteId", isAuthenticated, editNote);

module.exports = noteRouter;