"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const models_1 = require("./models");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const token_1 = require("./utils/token");
class AuthenticationController {
    // SIGNUP
    async handleSignup(req, res) {
        // Step 1: Validate request body with Zod
        const validationResult = await models_1.signupPayloadModel.safeParseAsync(req.body);
        if (validationResult.error)
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues });
        const { firstName, lastName, email, password } = validationResult.data;
        // Step 2: Check for duplicate email
        const userEmailResult = await db_1.db.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email));
        if (userEmailResult.length > 0)
            return res.status(400).json({ error: 'duplicate entry', message: `user with email ${email} already exists` });
        // Step 3: Hash password with salt
        const salt = (0, node_crypto_1.randomBytes)(32).toString('hex'); // unique random salt
        const hash = (0, node_crypto_1.createHmac)('sha256', salt).update(password).digest('hex');
        // Step 4: Save to DB
        const [result] = await db_1.db.insert(schema_1.usersTable).values({
            firstName, lastName, email,
            password: hash, // store hash, never plain password
            salt // store salt to verify later
        }).returning({ id: schema_1.usersTable.id });
        return res.status(201).json({ message: 'user has been created successfully', data: { id: result?.id } });
    }
    // SIGNIN 
    async handleSignin(req, res) {
        // Step 1: Validate
        const validationResult = await models_1.signinPayloadModel.safeParseAsync(req.body);
        if (validationResult.error)
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues });
        const { email, password } = validationResult.data;
        // Step 2: Find user
        const [userSelect] = await db_1.db.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email));
        if (!userSelect)
            return res.status(404).json({ message: `user with email ${email} does not exist` });
        // Step 3: Re-hash incoming password with stored salt and compare
        const salt = userSelect.salt;
        const hash = (0, node_crypto_1.createHmac)('sha256', salt).update(password).digest('hex');
        if (userSelect.password !== hash)
            return res.status(400).json({ message: 'email or password is incorrect' });
        // Step 4: Generate JWT token
        const token = (0, token_1.createUserToken)({ id: userSelect.id });
        return res.json({ message: 'Signin Success', data: { token } });
    }
    // ME (protected route)
    async handleMe(req, res) {
        // @ts-ignore
        const { id } = req.user;
        const [userResult] = await db_1.db.select().from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id));
        return res.json({
            firstName: userResult?.firstName,
            lastName: userResult?.lastName,
            email: userResult?.email
        });
    }
}
exports.default = AuthenticationController;
