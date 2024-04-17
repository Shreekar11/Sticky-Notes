import { client } from "../models/db";
import { QueryResult } from "pg";
import { ReqMid } from "../types/user";

const getAllNotes = async (req: any, res: any) => {
  try {
    const getQuery: string = "SELECT * FROM notes";
    const result: QueryResult<any> = await client.query(getQuery);
    console.log(result.rows);
    res.status(200).json({
      status: true,
      data: result.rows,
      message: "Retrived all notes",
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log("Error: ", err);
  }
};

const getUserNotes = async (req: ReqMid, res: any) => {
  const userId = req.user.user_id;
  console.log(userId);

  try {
    const getQuery: string =
      "SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.name, u.is_admin, n.created_at, n.updated_at FROM notes AS n JOIN users AS u ON n.fk_user = u.user_id WHERE fk_user=$1";
    const result: QueryResult<any> = await client.query(getQuery, [userId]);
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
      message: `Retrived note with id ${userId}`,
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log("Error: ", err);
  }
};

const getPublicNotes = async (req: any, res: any) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  const offset = (page - 1) * limit;

  try {
    const value: any[] = ["public"];
    const getQuery: string = `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.name, u.is_admin, n.created_at, n.updated_at FROM notes AS n JOIN users AS u ON n.fk_user = u.user_id WHERE privacy=$1 LIMIT ${limit} OFFSET ${offset}`;
    const result: QueryResult<any> = await client.query(getQuery, value);
    if (result.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: "Notes not found",
      });
    }
    console.log(result.rows);
    res.status(200).json({
      status: true,
      data: result.rows,
      message: "Retrived all public notes",
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log("Error: ", err);
  }
};

const getPrivateNotes = async (req: any, res: any) => {
  try {
    const value: any[] = ["private"];
    const getQuery: string = "SELECT * FROM notes WHERE privacy=$1";
    const result: QueryResult<any> = await client.query(getQuery, value);
    if (result.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: "Notes not found",
      });
    }
    console.log(result.rows);
    res.status(200).json({
      status: true,
      data: result.rows,
      message: "Retrived all private notes",
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log("Error: ", err);
  }
};

const getNote = async (req: any, res: any) => {
  const noteId = req.params.noteId;
  console.log(noteId);

  try {
    const getQuery: string =
      "SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.name, u.is_admin, n.created_at, n.updated_at FROM notes AS n JOIN users AS u ON n.fk_user = u.user_id WHERE note_id=$1 ";
    const result: QueryResult<any> = await client.query(getQuery, [noteId]);
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
  } catch (err: any) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
    console.log("Error: ", err);
  }
};

const createNote = async (req: any, res: any) => {
  const { title, content, privacy } = req.body;

  console.log(req.body);

  try {
    const timestamp: string = new Date().toISOString();
    const noteQuery: string =
      "INSERT INTO notes(fk_user, title, content, privacy, created_at) VALUES($1, $2, $3, $4, $5) RETURNING title, content, created_at";

    const userId = req.user.user_id;
    const values = [userId, title, content, privacy, timestamp];
    const result: QueryResult<any> = await client.query(noteQuery, values);

    res.status(200).json({
      status: true,
      message: "Sticky note created successfully!",
    });
  } catch (err: any) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
    console.log("Error: ", err);
  }
};

const editNote = async (req: any, res: any) => {
  const noteId = req.params.noteId;

  const { title, content, privacy } = req.body;
  console.log("new note: ", req.body);

  try {
    const previousQuery: string = "SELECT * FROM notes WHERE note_id=$1";
    const editParams = [noteId];
    const previousResult: QueryResult<any> = await client.query(
      previousQuery,
      editParams
    );
    if (previousResult.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Note not found",
      });
    }
    console.log("previous note: ", previousResult.rows[0]);

    const timestamp: string = new Date().toISOString();

    const editNoteQuery: string =
      "UPDATE notes SET title=$1, content=$2, privacy=$3, updated_at=$4 WHERE note_id=$5";
    const values: any[] = [title, content, privacy, timestamp, noteId];
    const result: QueryResult<any> = await client.query(editNoteQuery, values);

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
  } catch (err: any) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const editPrivacy = async (req: any, res: any) => {
  const noteId = req.params.noteId;
  const { privacy } = req.body;

  console.log(req.body);

  try {
    const noteQuery: string = "SELECT * FROM notes WHERE note_id=$1";
    const noteValue: any[] = [noteId];
    const noteResult: QueryResult<any> = await client.query(
      noteQuery,
      noteValue
    );

    if (noteResult.rowCount == 0) {
      return res.status(404).json({
        status: false,
        message: "Note not found",
      });
    }

    const updateQuery: string = "UPDATE notes SET privacy=$1 WHERE note_id=$2";
    const updateValues: any[] = [privacy, noteId];
    const updateResult: QueryResult<any> = await client.query(
      updateQuery,
      updateValues
    );

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
  } catch (err) {
    console.log("Error: ", err);
  }
};

const deleteNote = async (req: ReqMid, res: any) => {
  const noteId = req.params.noteId;
  try {
    const noteQuery: string = "SELECT * FROM notes WHERE note_id=$1";
    const noteValue: any[] = [noteId];
    const noteResult: QueryResult<any> = await client.query(
      noteQuery,
      noteValue
    );

    const deleteQuery: string = "DELETE FROM notes WHERE note_id=$1";
    const result: QueryResult<any> = await client.query(deleteQuery, [noteId]);

    res.status(200).json({
      status: true,
      data: noteResult.rows[0],
      message: "Note Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    console.log("Error: ", err);
  }
};

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
