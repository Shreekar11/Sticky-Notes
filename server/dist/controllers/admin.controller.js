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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../models/db");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getQuery = "SELECT * FROM users";
        const result = yield db_1.client.query(getQuery);
        console.log(result.rows);
        res.status(200).json({
            status: true,
            data: result.rows,
            message: "Retrived all users",
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
        console.log("Error: ", err);
    }
});
const getUsersNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const getQuery = `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.username, u.is_admin, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u 
      ON n.fk_user = u.user_id 
      WHERE fk_user=$1`;
        const result = yield db_1.client.query(getQuery, [userId]);
        console.log(result.rows);
        res.status(200).json({
            status: true,
            data: result.rows,
            message: "Retrived users notes",
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
        console.log("Error: ", err);
    }
});
const addNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, privacy } = req.body;
        const timestamp = new Date().toISOString();
        const insertQuery = `INSERT INTO notes(title, content, privacy, created_at, updated_at) 
    VALUES($1, $2, $3, $4, $5)`;
        const params = [title, content, privacy, timestamp, timestamp];
        const result = yield db_1.client.query(insertQuery, params);
        res.status(200).json({
            status: true,
            message: "Note added successfully",
        });
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;
    try {
        const getQuery = `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.username, u.is_admin, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u ON n.fk_user = u.user_id 
      LIMIT ${limit} OFFSET ${offset}`;
        const result = yield db_1.client.query(getQuery);
        console.log(result.rows);
        res.status(200).json({
            status: true,
            data: result.rows,
            message: "Retrived all notes",
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
        console.log("Error: ", err);
    }
});
const getANote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    console.log(noteId);
    try {
        const getQuery = `SELECT n.note_id, n.title, n.content, n.privacy, u.username, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u ON n.fk_user = u.user_id 
      WHERE note_id=$1 `;
        const result = yield db_1.client.query(getQuery, [noteId]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Note not found",
            });
        }
        console.log(result.rows);
        res.status(200).json({
            status: true,
            data: result.rows,
            message: `Retrived note with id ${noteId}`,
        });
    }
    catch (err) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
        console.log("Error: ", err);
    }
});
const editNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newTitle = req.body.title;
        const newContent = req.body.content;
        const newPrivacy = req.body.privacy;
        console.log("new note: ", req.body);
        const previousQuery = "SELECT * FROM notes WHERE note_id=$1";
        const editParams = [id];
        const previousResult = yield db_1.client.query(previousQuery, editParams);
        if (previousResult.rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Note not found",
            });
        }
        console.log("previous note: ", previousResult.rows[0]);
        const prevTitle = previousResult.rows[0].title;
        const prevContent = previousResult.rows[0].content;
        const prevPrivacy = previousResult.rows[0].privacy;
        const timestamp = new Date().toISOString();
        const title = newTitle || prevTitle;
        const content = newContent || prevContent;
        const privacy = newPrivacy || prevPrivacy;
        const editNoteQuery = "UPDATE notes SET title=$1, content=$2, privacy=$3, updated_at=$4 WHERE note_id=$5";
        const values = [title, content, privacy, timestamp, id];
        const result = yield db_1.client.query(editNoteQuery, values);
        res.status(200).json({
            status: true,
            note: {
                id,
                title,
                content,
                privacy,
                created_at: previousResult.rows[0].created_at,
                updated_at: timestamp,
            },
            message: "Note updated successfully!",
        });
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.noteId;
        const getQuery = "SELECT * FROM notes WHERE note_id=$1";
        const param = [noteId];
        const previousResult = yield db_1.client.query(getQuery, param);
        const deleteQuery = `DELETE FROM notes WHERE note_id = $1`;
        const deleteParam = [noteId];
        const result = yield db_1.client.query(deleteQuery, deleteParam);
        res.status(200).json({
            status: true,
            data: previousResult.rows[0],
            message: "Note deleted successfully",
        });
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});
const deleteAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `DELETE FROM notes`;
        const result = yield db_1.client.query(query);
        res.status(200).json({ status: true, message: "All notes deleted" });
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const getQuery = "SELECT * FROM users WHERE user_id=$1";
        const param = [id];
        const previousResult = yield db_1.client.query(getQuery, param);
        const deleteQuery = `DELETE FROM notes WHERE user_id=$1`;
        const deleteParam = [id];
        const result = yield db_1.client.query(deleteQuery, deleteParam);
        res.status(200).json({
            status: true,
            data: previousResult.rows[0],
            message: "User deleted successfully",
        });
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});
const roleChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const userQuery = "SELECT is_admin FROM users WHERE user_id=$1";
        const userParams = [userId];
        const userResult = yield db_1.client.query(userQuery, userParams);
        const role = userResult.rows[0].is_admin;
        console.log(role);
        const query = `UPDATE users SET is_admin=$1 WHERE user_id=$2`;
        const params = [!role, userId];
        const result = yield db_1.client.query(query, params);
        res.status(200).json({
            status: true,
            message: "Role changed to admin",
        });
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});
module.exports = {
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
};
