"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const authenticationController = new controller_1.default();
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/sign-up', authenticationController.handleSignup.bind(authenticationController));
exports.authRouter.post('/sign-in', authenticationController.handleSignin.bind(authenticationController));
// Protected route — must be logged in
exports.authRouter.get('/me', (0, auth_middleware_1.restrictAuthenticatedUser)(), authenticationController.handleMe.bind(authenticationController));
