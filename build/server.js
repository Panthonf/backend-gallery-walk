"use strict";
// index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const test_1 = require("./routes/test");
const server = (0, fastify_1.default)();
server.get("/", function (request, reply) {
    reply.send({ hello: "world" });
});
server.register(test_1.default);
server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=server.js.map