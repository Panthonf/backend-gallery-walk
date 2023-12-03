import server from './app.js';

const start = async () => {
    try {
        await server.listen({ port: 3000 });
        console.log(`Server listening on port http://localhost:${server.server.address().port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
