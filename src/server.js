import server from './app.js';

const PORT = process.env.PORT || 3000;

server.get('/', async (request, reply) => {
    return { hello: 'world' };
});

const start = async () => {
    try {
        await server.listen({ port: PORT });
        console.log(`Server listening on port http://localhost:${server.server.address().port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
