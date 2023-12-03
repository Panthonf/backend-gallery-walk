"use strict";
// src/controllers/testController.ts
Object.defineProperty(exports, "__esModule", { value: true });
class testController {
    static async getExample(req, reply) {
        try {
            // Your logic for handling the GET request
            const data = { message: 'Hello, this is an example!' };
            reply.send(data);
        }
        catch (error) {
            // Handle errors
            console.error(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
    static async postExample(req, reply) {
        try {
            // Your logic for handling the POST request
            const requestData = req.body;
            const response = { message: 'Received POST request', data: requestData };
            reply.send(response);
        }
        catch (error) {
            // Handle errors
            console.error(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
exports.default = testController;
//# sourceMappingURL=testController.js.map