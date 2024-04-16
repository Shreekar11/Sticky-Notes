import express, { Router } from "express";
const {
  getAllUsers,
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
adminRouter.post("/add-note", addNote);
adminRouter.get("/get-all-notes", getAllNotes);
adminRouter.get("/get-a-note/:noteId", getANote);
adminRouter.put("/edit-note/:id", editNote);
adminRouter.put("/role-change/:id", roleChange);
adminRouter.delete("/delete-note/:id", deleteNote);
adminRouter.delete("/delete-all-notes", deleteAllNotes);
adminRouter.delete("/delete-user/:id", deleteUser);

module.exports = adminRouter;
