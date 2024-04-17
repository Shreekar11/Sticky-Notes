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
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getQuery = "SELECT * FROM notes";
        const result = yield db_1.client.query(getQuery);
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
const getUserNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.user_id;
    console.log(userId);
    try {
        const getQuery = `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.username, u.is_admin, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u 
      ON n.fk_user = u.user_id 
      WHERE fk_user=$1`;
        const result = yield db_1.client.query(getQuery, [userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Note not found",
            });
        }
        res.status(200).json({
            status: true,
            data: result.rows,
            message: `Retrived note with id ${userId}`,
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
const getPublicNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.user_id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;
    try {
        const getQuery = `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.username, u.is_admin, n.created_at, n.updated_at 
    FROM notes AS n 
    JOIN users 
    AS u ON n.fk_user = u.user_id 
    WHERE privacy=$1 
    AND n.fk_user != $2 
    LIMIT ${limit} OFFSET ${offset}`;
        const value = ["public", userId];
        const result = yield db_1.client.query(getQuery, value);
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Notes not found",
            });
        }
        res.status(200).json({
            status: true,
            data: result.rows,
            message: "Retrived all public notes",
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
const getPrivateNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.user_id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;
    try {
        const getQuery = `SELECT * FROM notes 
    WHERE privacy=$1 
    AND fk_user!=$2
    LIMIT ${limit} OFFSET ${offset}`;
        const value = ["private", userId];
        const result = yield db_1.client.query(getQuery, value);
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Notes not found",
            });
        }
        res.status(200).json({
            status: true,
            data: result.rows,
            message: "Retrived all private notes",
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
const getNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    try {
        const getQuery = `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.username, u.is_admin, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u 
      ON n.fk_user = u.user_id 
      WHERE note_id=$1 `;
        const result = yield db_1.client.query(getQuery, [noteId]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Note not found",
            });
        }
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
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, privacy } = req.body;
    try {
        const timestamp = new Date().toISOString();
        const noteQuery = `INSERT INTO notes(fk_user, title, content, privacy, created_at, updated_at) 
      VALUES($1, $2, $3, $4, $5, $6) 
      RETURNING title, content, created_at, updated_at`;
        const userId = req.user.user_id;
        const values = [userId, title, content, privacy, timestamp, timestamp];
        const result = yield db_1.client.query(noteQuery, values);
        res.status(200).json({
            status: true,
            message: "Sticky note created successfully!",
        });
    }
    catch (err) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
        console.log("Error: ", err);
    }
});
const editNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    const { title, content, privacy } = req.body;
    try {
        const previousQuery = "SELECT * FROM notes WHERE note_id=$1";
        const editParams = [noteId];
        const previousResult = yield db_1.client.query(previousQuery, editParams);
        if (previousResult.rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Note not found",
            });
        }
        const timestamp = new Date().toISOString();
        const editNoteQuery = "UPDATE notes SET title=$1, content=$2, privacy=$3, updated_at=$4 WHERE note_id=$5";
        const values = [title, content, privacy, timestamp, noteId];
        const result = yield db_1.client.query(editNoteQuery, values);
        res.status(200).json({
            status: true,
            note: {
                noteId,
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
        res.status(500).json({ status: false, message: err.message });
    }
});
const editPrivacy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    const { privacy } = req.body;
    try {
        const noteQuery = "SELECT * FROM notes WHERE note_id=$1";
        const noteValue = [noteId];
        const noteResult = yield db_1.client.query(noteQuery, noteValue);
        if (noteResult.rowCount == 0) {
            return res.status(404).json({
                status: false,
                message: "Note not found",
            });
        }
        const updateQuery = "UPDATE notes SET privacy=$1 WHERE note_id=$2";
        const updateValues = [privacy, noteId];
        const updateResult = yield db_1.client.query(updateQuery, updateValues);
        res.status(200).json({
            status: true,
            note: {
                note_id: noteId,
                title: noteResult.rows[0].title,
                content: noteResult.rows[0].content,
                privacy,
                created_at: noteResult.rows[0].created_at,
                updated_at: noteResult.rows[0].updated_at,
            },
            message: "Privacy updated successfully!",
        });
    }
    catch (err) {
        console.log("Error: ", err);
    }
});
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.noteId;
    try {
        const noteQuery = "SELECT * FROM notes WHERE note_id=$1";
        const noteValue = [noteId];
        const noteResult = yield db_1.client.query(noteQuery, noteValue);
        const deleteQuery = "DELETE FROM notes WHERE note_id=$1";
        const result = yield db_1.client.query(deleteQuery, [noteId]);
        res.status(200).json({
            status: true,
            data: noteResult.rows[0],
            message: "Note Deleted Successfully!",
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
        console.log("Error: ", err);
    }
});
module.exports = {
    createNote,
    editNote,
    getAllNotes,
    getUserNotes,
    getPublicNotes,
    getPrivateNotes,
    getNote,
    editPrivacy,
    deleteNote,
};
