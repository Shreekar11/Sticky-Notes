import express, { Router } from "express";
const { signup } = require("../controllers/user.controller");
const { signin } = require("../controllers/user.controller");

const userRouter: Router = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);

module.exports = userRouter;