"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_middlewares_1 = require("../middlewares/user.middlewares");
const { createNote, editNote, editPrivacy, getAllNotes, getUserNotes, getPublicNotes, getPrivateNotes, getNote, deleteNote, } = require("../controllers/note.controller");
const noteRouter = express_1.default.Router();
noteRouter.post("/create-note", user_middlewares_1.isAuthenticated, createNote);
noteRouter.get("/get-all-notes", user_middlewares_1.isAuthenticated, getAllNotes);
noteRouter.get("/get-user-notes", user_middlewares_1.isAuthenticated, getUserNotes);
noteRouter.get("/get-public-notes", user_middlewares_1.isAuthenticated, getPublicNotes);
noteRouter.get("/get-private-notes", user_middlewares_1.isAuthenticated, getPrivateNotes);
noteRouter.get("/get-note/:noteId", user_middlewares_1.isAuthenticated, getNote);
noteRouter.put("/edit-note/:noteId", user_middlewares_1.isAuthenticated, editNote);
noteRouter.put("/edit-privacy/:noteId", user_middlewares_1.isAuthenticated, editPrivacy);
noteRouter.delete("/delete-note/:noteId", user_middlewares_1.isAuthenticated, deleteNote);
module.exports = noteRouter;
