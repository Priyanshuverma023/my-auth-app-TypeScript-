"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplication = createApplication;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./auth/routes");
const auth_middleware_1 = require("./middleware/auth-middleware");
function createApplication() {
    const app = (0, express_1.default)();
    //Middleware - run on every request
    app.use(express_1.default.json());
    app.use((0, auth_middleware_1.authenticationMiddlware)());
    app.get('/', (req, res) => {
        return res.json({ message: 'Welcome to myCode Auth Service' });
    });
    app.use('/auth', routes_1.authRouter);
    return app;
}
