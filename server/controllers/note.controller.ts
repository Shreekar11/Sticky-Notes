import { client } from "../models/db";
import { QueryResult } from "pg";

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
  console.log(noteId);
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

    console.log("Entered Here");
    const editNoteQuery: string =
      "UPDATE notes SET title=$1, content=$2, privacy=$3, updated_at=$4 WHERE note_id=$5";
    const values: any[] = [title, content, privacy, timestamp, noteId];
    const result: QueryResult<any> = await client.query(editNoteQuery, values);

    console.log("Finished");

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

module.exports = { createNote, editNote, getAllNotes };
