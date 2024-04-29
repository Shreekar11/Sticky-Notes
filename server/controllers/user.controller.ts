import { Request, Response } from "express";
import { client } from "../models/db";
import { QueryResult } from "pg";
import bcrypt from "bcryptjs";
import { generateUserToken } from "../middlewares/user.middlewares";
import { ReqMid } from "../types/user";

const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const timestamp: string = new Date().toISOString();
    const signupQuery: string =
      "INSERT INTO users(username, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING username, email, created_at";

    const hashPassword = await bcrypt.hash(password, 10);
    const values: any[] = [username, email, hashPassword, timestamp, timestamp];

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
  const { username, password } = req.body;

  try {
    const signinQuery = "SELECT * FROM users WHERE username=$1";
    const param = [username];
    const data: QueryResult<any> = await client.query(signinQuery, param);

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

const logout = async (req: ReqMid, res: any) => {
  if (!req.token) {
    return res.status(404).json({ error: "You are already logged out" });
  }

  try {
    const removeUser: string = "DELETE FROM user_token WHERE token = $1";
    const value: any[] = [req.token];
    const result: QueryResult<any> = await client.query(removeUser, value);

    return res.status(200).json({
      status: true,
      message: "User logged out successfully!",
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "An error occurred while logging out" });
  }
};

module.exports = { signup, signin, logout };
