"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddlware = authenticationMiddlware;
exports.restrictAuthenticatedUser = restrictAuthenticatedUser;
const token_1 = require("../auth/utils/token");
function authenticationMiddlware() {
    return function (req, res, next) {
        const header = req.headers['authorization'];
        if (!header)
            return next(); // no token? just continue
        if (!header.startsWith('Bearer'))
            return res.status(400).json({ error: 'authoriztion header must start with Bearer' });
        const token = header.split(' ')[1];
        if (!token)
            return res.status(400).json({ error: 'token missing after Bearer' });
        const user = (0, token_1.verifyUserToken)(token);
        // @ts-ignore
        req.user = user;
        next();
    };
}
function restrictAuthenticatedUser() {
    return function (req, res, next) {
        // @ts-ignore
        if (!req.user)
            return res.status(401).json({ error: 'Authentication Required' });
        return next();
    };
}
