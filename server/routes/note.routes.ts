import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middlewares";
const { createNote } = require("../controllers/note.controller");
const { editNote } = require("../controllers/note.controller");
const { getAllNotes } = require("../controllers/note.controller");
const { editPrivacy } = require("../controllers/note.controller");
const { getNote } = require("../controllers/note.controller");

const noteRouter: Router = express.Router();

noteRouter.post("/create-note", isAuthenticated, createNote);
noteRouter.get("/get-all-notes", isAuthenticated, getAllNotes);
noteRouter.get("/get-note/:noteId", isAuthenticated, getNote);
noteRouter.put("/edit-note/:noteId", isAuthenticated, editNote);
noteRouter.put("/edit-privacy/:noteId", isAuthenticated, editPrivacy);

module.exports = noteRouter;