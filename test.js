'use strict';

const Hapi = require('@hapi/hapi');

const server = Hapi.server({
  port: 8081,
  host: 'localhost',
  routes: {
    cors: true,
    payload: {
      maxBytes: 16384
    },
    security: {
      hsts: {
        maxAge: 15552000,
        includeSubdomains: true
      },
      xframe: true,
      xss: true,
      noOpen: false,
      noSniff: true
    },
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {

    return 'Hello, world!';
  }
});

server.route({
  method: 'GET',
  path: '/alive',
  handler: (request, h) => {

    return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
  }
});

const init = async () => {

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
