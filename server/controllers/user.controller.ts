import { Request, Response } from "express";
import { client } from "../models/db";
import { QueryResult } from "pg";
import bcrypt from "bcryptjs";
import { generateUserToken } from "../middlewares/user.middlewares";

const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const timestamp: string = new Date().toISOString();
    const signupQuery: string =
      "INSERT INTO users(name, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING name, email, created_at";

    const hashPassword = await bcrypt.hash(password, 10);
    const values: any[] = [name, email, hashPassword, timestamp, timestamp];

    const result: QueryResult<any> = await client.query(signupQuery, values);

    res.status(200).json({
      status: true,
      message: "User created successfully!",
    });
  } catch (err: any) {
    const duplicateError: string = err.message
      .split(" ")
      .pop()
      .replaceAll('"', "");

    if (duplicateError === "user_email_key") {
      res.status(409).json({ error: "User with this email already exists." });
    } else {
      console.log(err);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const signinQuery = "SELECT * FROM users WHERE email=$1";
    const param = [email];
    const data: QueryResult<any> = await client.query(signinQuery, param);
    console.log("user: ", data.rows[0]);

    if (data.rowCount == 1) {
      const auth = await bcrypt.compare(password, data.rows[0].password);
      if (auth) {
        const token = await generateUserToken(data.rows[0].user_id);
        const user = data.rows[0];
        delete user.password;
        return res.status(200).json({
          status: true,
          token: token,
          user: user,
          message: "User logged in successfully!",
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Invalid password",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (err: any) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { signup, signin };
