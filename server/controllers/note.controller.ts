import { client } from "../models/db";
import { QueryResult } from "pg";

const createNote = async (req: any, res: any) => {
  const { title, content, visibility } = req.body;

  console.log("user data: ", req.user);

  try {
    const timestamp: string = new Date().toISOString();
    const noteQuery: string =
      "INSERT INTO notes(fk_user, title, content, visibility, created_at) VALUES($1, $2, $3, $4, $5) RETURNING title, content, created_at";

    const userId = req.user.user_id;
    const values = [userId, title, content, visibility, timestamp];
    const result: QueryResult<any> = await client.query(noteQuery, values);

    res.status(200).json({
      status: true,
      message: "Sticky note created successfully!",
    });
  } catch (err: any) {
    res.status(404).json({
      status: false,
      message: err.message,
    });
    console.log("Error: ", err);
  }
};

module.exports = { createNote };
