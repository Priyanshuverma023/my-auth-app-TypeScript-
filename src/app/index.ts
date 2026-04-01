import express  from "express";
import type {Express} from 'express'
import {authRouter} from './auth/routes'
import {authenticationMiddlware} from './middleware/auth-middleware';

export function createApplication(): Express {
  const app = express()

  //Middleware - run on every request
  app.use(express.json())
  app.use(authenticationMiddlware())

  app.get('/',(req,res) => {
    return res.json({message: 'Welcome to myCode Auth Service'})
  })
  app.use('/auth',authRouter)

  return app
}