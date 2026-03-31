import express from "express";
import type { Router } from "express";
import AuthenticationController from "./controller";
import { restrictAuthenticatedUser } from "../middleware/auth-middleware";

const authenticationController = new AuthenticationController()
export const authRouter: Router = express.Router()

authRouter.post('/sign-up', authenticationController.handleSignup.bind(authenticationController))
authRouter.post('/sign-in', authenticationController.handleSignin.bind(authenticationController))

// Protected route — must be logged in
authRouter.get('/me', restrictAuthenticatedUser(), authenticationController.handleMe.bind(authenticationController))

