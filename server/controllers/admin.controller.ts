import { QueryResult } from "pg";
import { client } from "../models/db";

const getAllUsers = async (req: any, res: any) => {
  try {
    const getQuery: string = "SELECT * FROM users";
    const result: QueryResult<any> = await client.query(getQuery);
    console.log(result.rows);
    res.status(200).json({
      status: true,
      data: result.rows,
      message: "Retrived all users",
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log("Error: ", err);
  }
};

const getUsersNotes = async (req: any, res: any) => {
  const userId = req.params.userId;
  try {
    const getQuery: string =
      `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.name, u.is_admin, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u 
      ON n.fk_user = u.user_id 
      WHERE fk_user=$1`;
    const result: QueryResult<any> = await client.query(getQuery, [userId]);
    console.log(result.rows);
    res.status(200).json({
      status: true,
      data: result.rows,
      message: "Retrived users notes",
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log("Error: ", err);
  }
};

const addNote = async (req: any, res: any) => {
  try {
    const { title, content, privacy } = req.body;
    const timestamp = new Date().toISOString();
    const insertQuery: string = `INSERT INTO notes(title, content, privacy, created_at, updated_at) 
    VALUES($1, $2, $3, $4, $5)`;
    const params: any[] = [title, content, privacy, timestamp, timestamp];
    const result: QueryResult<any> = await client.query(insertQuery, params);
    res.status(200).json({
      status: true,
      message: "Note added successfully",
    });
  } catch (err: any) {
    console.log("Error: ", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const getAllNotes = async (req: any, res: any) => {

  const page = req.query.page ? parseInt(req.query.page) : 1; 
  const limit = req.query.limit ? parseInt(req.query.limit) : 10; 

  const offset = (page - 1) * limit;

  try {
    const getQuery: string =
      `SELECT n.fk_user, n.note_id, n.title, n.content, n.privacy, u.name, u.is_admin, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u ON n.fk_user = u.user_id 
      LIMIT ${limit} OFFSET ${offset}`;
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

const getANote = async (req: any, res: any) => {
  const noteId = req.params.noteId;
  console.log(noteId);

  try {
    const getQuery: string =
      `SELECT n.note_id, n.title, n.content, n.privacy, u.name, n.created_at, n.updated_at 
      FROM notes AS n 
      JOIN users AS u ON n.fk_user = u.user_id 
      WHERE note_id=$1 `;
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

const editNote = async (req: any, res: any) => {
  try {
    const id = req.params.id;

    const newTitle = req.body.title;
    const newContent = req.body.content;
    const newPrivacy = req.body.privacy;

    console.log("new note: ", req.body);
    const previousQuery: string = "SELECT * FROM notes WHERE note_id=$1";
    const editParams = [id];
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

    const prevTitle = previousResult.rows[0].title;
    const prevContent = previousResult.rows[0].content;
    const prevPrivacy = previousResult.rows[0].privacy;

    const timestamp: string = new Date().toISOString();

    const title = newTitle || prevTitle;
    const content = newContent || prevContent;
    const privacy = newPrivacy || prevPrivacy;

    const editNoteQuery: string =
      "UPDATE notes SET title=$1, content=$2, privacy=$3, updated_at=$4 WHERE note_id=$5";
    const values: any[] = [title, content, privacy, timestamp, id];
    const result: QueryResult<any> = await client.query(editNoteQuery, values);

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
  } catch (err: any) {
    console.log("Error: ", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const deleteNote = async (req: any, res: any) => {
  try {
    const noteId = req.params.noteId;
    const getQuery: string = "SELECT * FROM notes WHERE note_id=$1";
    const param = [noteId];
    const previousResult: QueryResult<any> = await client.query(
      getQuery,
      param
    );

    const deleteQuery: string = `DELETE FROM notes WHERE note_id = $1`;
    const deleteParam: any[] = [noteId];
    const result: QueryResult<any> = await client.query(
      deleteQuery,
      deleteParam
    );
    res.status(200).json({
      status: true,
      data: previousResult.rows[0],
      message: "Note deleted successfully",
    });
  } catch (err: any) {
    console.log("Error: ", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const deleteAllNotes = async (req: any, res: any) => {
  try {
    const query: string = `DELETE FROM notes`;
    const result: QueryResult<any> = await client.query(query);
    res.status(200).json({ status: true, message: "All notes deleted" });
  } catch (err: any) {
    console.log("Error: ", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const getQuery: string = "SELECT * FROM users WHERE user_id=$1";
    const param = [id];
    const previousResult: QueryResult<any> = await client.query(
      getQuery,
      param
    );

    const deleteQuery: string = `DELETE FROM notes WHERE user_id=$1`;
    const deleteParam: any[] = [id];
    const result: QueryResult<any> = await client.query(
      deleteQuery,
      deleteParam
    );
    res.status(200).json({
      status: true,
      data: previousResult.rows[0],
      message: "User deleted successfully",
    });
  } catch (err: any) {
    console.log("Error: ", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const roleChange = async (req: any, res: any) => {
  try {
    const userId = req.params.userId;

    const userQuery: string = "SELECT is_admin FROM users WHERE user_id=$1";
    const userParams: any[] = [userId];
    const userResult: QueryResult<any> = await client.query(
      userQuery,
      userParams
    );

    const role = userResult.rows[0].is_admin;
    console.log(role);

    const query: string = `UPDATE users SET is_admin=$1 WHERE user_id=$2`;
    const params: any[] = [!role, userId];
    const result: QueryResult<any> = await client.query(query, params);

    res.status(200).json({
      status: true,
      message: "Role changed to admin",
    });
  } catch (err: any) {
    console.log("Error: ", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

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
