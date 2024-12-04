const Hapi = require('@hapi/hapi');
const fetch = require('node-fetch');
const path = require('path');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                index: true,
            },
        },
    });

    server.route({
        method: 'POST',
        path: '/api/login',
        handler: async (request, h) => {
            const { username, password } = request.payload;

            try {
                const response = await fetch('https://dummyjson.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    return h.response(error).code(response.status);
                }

                const data = await response.json();
                return h.response(data).code(200);
            } catch (error) {
                return h.response({ error: error.message }).code(500);
            }
        },
    });

    server.route({
        method: 'GET',
        path: '/api/products',
        handler: async (request, h) => {
            try {
                const response = await fetch('https://dummyjson.com/products');
                const data = await response.json();
                return h.response(data).code(200);
            } catch (error) {
                return h.response({ error: error.message }).code(500);
            }
        },
    });

    server.route({
        method: 'GET',
        path: '/api/profile',
        handler: async (request, h) => {
            const { token } = request.query;

            try {
                const response = await fetch('https://dummyjson.com/auth/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                return h.response(data).code(200);
            } catch (error) {
                return h.response({ error: error.message }).code(500);
            }
        },
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
