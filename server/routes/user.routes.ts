import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middlewares";
const { signup } = require("../controllers/user.controller");
const { signin } = require("../controllers/user.controller");
const { logout } = require("../controllers/user.controller");

const userRouter: Router = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.post('/logout', isAuthenticated, logout)

module.exports = userRouter;