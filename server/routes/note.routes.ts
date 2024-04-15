import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middlewares";
const { createNote } = require("../controllers/note.controller");
const { editNote } = require("../controllers/note.controller");
const { getAllNotes } = require("../controllers/note.controller");
const { editPrivacy } = require("../controllers/note.controller");
const { getUserNotes } = require("../controllers/note.controller");
const { getNote } = require("../controllers/note.controller");
const { deleteNote } = require("../controllers/note.controller");

const noteRouter: Router = express.Router();

noteRouter.post("/create-note", isAuthenticated, createNote);
noteRouter.get("/get-all-notes", isAuthenticated, getAllNotes);
noteRouter.get("/get-user-notes", isAuthenticated, getUserNotes);
noteRouter.get("/get-note/:noteId", isAuthenticated, getNote);
noteRouter.put("/edit-note/:noteId", isAuthenticated, editNote);
noteRouter.put("/edit-privacy/:noteId", isAuthenticated, editPrivacy);
noteRouter.delete("/delete-note/:noteId", isAuthenticated, deleteNote);

module.exports = noteRouter;