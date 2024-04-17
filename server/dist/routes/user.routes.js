"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_middlewares_1 = require("../middlewares/user.middlewares");
const { signup } = require("../controllers/user.controller");
const { signin } = require("../controllers/user.controller");
const { logout } = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.post('/logout', user_middlewares_1.isAuthenticated, logout);
module.exports = userRouter;
