'use strict';

const Hapi = require('@hapi/hapi');
const actions = require('./actions');
const initialize = require('./initializers');
const qs = require('qs');

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

const init = async () => {
  const options = {port: 8081, host: 'localhost', query: {parser: query => qs.parse(query)}};

  const server = Hapi.server(options);

  await initialize(server);

  await actions(server);

  await server.start();

  console.log('Server is running on %s', server.info.uri);
};

init();
