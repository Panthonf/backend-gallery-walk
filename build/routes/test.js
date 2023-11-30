"use strict";
// src/routes/exampleRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const testController_1 = require("../controllers/testController");
function exampleRoutes(fastify, options, done) {
    fastify.get('/example', testController_1.default.getExample);
    // You can add more routes as needed
    done();
}
exports.default = exampleRoutes;
//# sourceMappingURL=test.js.map