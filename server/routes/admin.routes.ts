import express, { Router } from "express";
const {
  getAllUsers,
  getUsersNotes,
  addNote,
  getAllNotes,
  getANote,
  editNote,
  deleteNote,
  deleteAllNotes,
  deleteUser,
  roleChange,
} = require("../controllers/admin.controller");

const adminRouter: Router = express.Router();

adminRouter.get("/get-all-users", getAllUsers);
adminRouter.get("/get-users-notes/:userId", getUsersNotes);
adminRouter.post("/add-note", addNote);
adminRouter.get("/get-all-notes", getAllNotes);
adminRouter.get("/get-a-note/:noteId", getANote);
adminRouter.put("/edit-note/:noteId", editNote);
adminRouter.put("/role-change/:userId", roleChange);
adminRouter.delete("/delete-note/:noteId", deleteNote);
adminRouter.delete("/delete-all-notes", deleteAllNotes);
adminRouter.delete("/delete-user/:userId", deleteUser);

module.exports = adminRouter;
