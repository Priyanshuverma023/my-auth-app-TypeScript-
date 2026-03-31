import type { Request, Response, NextFunction } from 'express'
import { verifyUserToken } from '../auth/utils/token'
import { error } from 'node:console'

export function authenticationMiddlware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization']
        if(!header) return next () // no token? just continue

        if(!header.startsWith('Bearer'))
            return res.status(400).json({error: 'authoriztion header must start with Bearer'})

        const token = header.split(' ')[1]
        if(!token)
            return res.status(400).json({error: 'token missing after Bearer'})

        const user = verifyUserToken(token)
    // @ts-ignore
        req.user = user;
        next();
    }
}

export function restrictAuthenticatedUser() {
    return function(req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        if(!req.user) return res.status(401).json({error: 'Authentication Required'})
            return next()
    }
}