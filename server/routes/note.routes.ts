import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middlewares";
const {
  createNote,
  editNote,
  editPrivacy,
  getAllNotes,
  getUserNotes,
  getPublicNotes,
  getPrivateNotes,
  getNote,
  deleteNote,
} = require("../controllers/note.controller");

const noteRouter: Router = express.Router();

noteRouter.post("/create-note", isAuthenticated, createNote);
noteRouter.get("/get-all-notes", isAuthenticated, getAllNotes);
noteRouter.get("/get-user-notes", isAuthenticated, getUserNotes);
noteRouter.get("/get-public-notes", isAuthenticated, getPublicNotes);
noteRouter.get("/get-private-notes", isAuthenticated, getPrivateNotes);
noteRouter.get("/get-note/:noteId", isAuthenticated, getNote);
noteRouter.put("/edit-note/:noteId", isAuthenticated, editNote);
noteRouter.put("/edit-privacy/:noteId", isAuthenticated, editPrivacy);
noteRouter.delete("/delete-note/:noteId", isAuthenticated, deleteNote);

module.exports = noteRouter;
