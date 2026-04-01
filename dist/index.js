"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const app_1 = require("./app");
async function main() {
    try {
        const server = (0, node_http_1.createServer)((0, app_1.createApplication)());
        const PORT = 8080;
        server.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
        });
    }
    catch (error) {
        console.error(`Error starting server`);
        throw error;
    }
}
main();
