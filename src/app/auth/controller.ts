import type { Request, Response } from 'express'
import { randomBytes, createHmac } from 'node:crypto'
import { signinPayloadModel, signupPayloadModel } from './models'
import { db } from './db'
import { usersTable } from './db/schema'
import { eq } from 'drizzle-orm'
import { createUserToken } from './utils/token'
import type { UserTokenPayload } from './utils/token'

class AuthenticationController {

    // SIGNUP
    public async handleSignup(req: Request, res: Response) {

        // Step 1: Validate request body with Zod
        const validationResult = await signupPayloadModel.safeParseAsync(req.body)
        if (validationResult.error)
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })

        const { firstName, lastName, email, password } = validationResult.data

        // Step 2: Check for duplicate email
        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if (userEmailResult.length > 0)
            return res.status(400).json({ error: 'duplicate entry', message: `user with email ${email} already exists` })

        // Step 3: Hash password with salt
        const salt = randomBytes(32).toString('hex')  // unique random salt
        const hash = createHmac('sha256', salt).update(password).digest('hex')
        //           👆 HMAC uses the salt as the key to hash the password

        // Step 4: Save to DB
        const [result] = await db.insert(usersTable).values({
            firstName, lastName, email,
            password: hash,  // store hash, never plain password
            salt             // store salt to verify later
        }).returning({ id: usersTable.id })

        return res.status(201).json({ message: 'user has been created successfully', data: { id: result?.id } })
    }

    // SIGNIN 
    public async handleSignin(req: Request, res: Response) {

        // Step 1: Validate
        const validationResult = await signinPayloadModel.safeParseAsync(req.body)
        if (validationResult.error)
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })

        const { email, password } = validationResult.data

        // Step 2: Find user
        const [userSelect] = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if (!userSelect)
            return res.status(404).json({ message: `user with email ${email} does not exist` })

        // Step 3: Re-hash incoming password with stored salt and compare
        const salt = userSelect.salt!
        const hash = createHmac('sha256', salt).update(password).digest('hex')
        if (userSelect.password !== hash)
            return res.status(400).json({ message: 'email or password is incorrect' })

        // Step 4: Generate JWT token
        const token = createUserToken({ id: userSelect.id })
        return res.json({ message: 'Signin Success', data: { token } })
    }

    // ME (protected route)
    public async handleMe(req: Request, res: Response) {
        // @ts-ignore
        const { id } = req.user! as UserTokenPayload

        const [userResult] = await db.select().from(usersTable).where(eq(usersTable.id, id))

        return res.json({
            firstName: userResult?.firstName,
            lastName: userResult?.lastName,
            email: userResult?.email
        })
    }
}

export default AuthenticationController