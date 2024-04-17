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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../models/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_middlewares_1 = require("../middlewares/user.middlewares");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const timestamp = new Date().toISOString();
        const signupQuery = "INSERT INTO users(name, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING name, email, created_at";
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        const values = [name, email, hashPassword, timestamp, timestamp];
        const result = yield db_1.client.query(signupQuery, values);
        res.status(200).json({
            status: true,
            message: "User created successfully!",
        });
    }
    catch (err) {
        const duplicateError = err.message
            .split(" ")
            .pop()
            .replaceAll('"', "");
        if (duplicateError === "user_email_key") {
            res.status(409).json({ error: "User with this email already exists." });
        }
        else {
            console.log(err);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
});
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const signinQuery = "SELECT * FROM users WHERE email=$1";
        const param = [email];
        const data = yield db_1.client.query(signinQuery, param);
        console.log("user: ", data.rows[0]);
        if (data.rowCount == 1) {
            const auth = yield bcryptjs_1.default.compare(password, data.rows[0].password);
            if (auth) {
                const token = yield (0, user_middlewares_1.generateUserToken)(data.rows[0].user_id);
                const user = data.rows[0];
                delete user.password;
                return res.status(200).json({
                    status: true,
                    token: token,
                    user: user,
                    message: "User logged in successfully!",
                });
            }
            else {
                return res.status(404).json({
                    status: false,
                    message: "Invalid password",
                });
            }
        }
        else {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }
    }
    catch (err) {
        return res.status(400).json({
            status: false,
            message: err.message,
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        return res.status(404).json({ error: "You are already logged out" });
    }
    console.log(req.token);
    try {
        const removeUser = "DELETE FROM user_token WHERE token = $1";
        const value = [req.token];
        const result = yield db_1.client.query(removeUser, value);
        return res.status(200).json({
            status: true,
            message: "User logged out successfully!",
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ error: "An error occurred while logging out" });
    }
});
module.exports = { signup, signin, logout };
