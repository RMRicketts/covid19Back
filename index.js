"use strict";

const Hapi = require("@hapi/hapi");
const actions = require("./actions");
const initialize = require("./initializers");
const qs = require("qs");
const reloadMongo = require("./scripts/refreshData.js");

process.on("unhandledRejection", err => {
  console.log(err);
});

const init = async () => {
  const options = {
    port: 8081,
    query: { parser: query => qs.parse(query) },
    routes: {
      cors: {
        origin: "ignore",
        additionalHeaders: [
          "Accept",
          "Access-Control-Request-Method",
          "Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization",
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "Accept-language",
          "accesstoken"
        ]
      }
    }
  };

  let server = Hapi.server(options);

  server.ext(`onPreResponse`, (request, h) => {
    if (
      request.response !== undefined &&
      typeof request.response.header === "object"
    ) {
      request.response.header("Access-Control-Allow-Origin", "*");
      request.response.header("Access-Control-Allow-Headers", "accesstoken");
    }
    return h.continue;
  });

  await initialize(server);

  await actions(server);

  await server.start();

  console.log("Server is running on %s", server.info.uri);
  reloadMongo();
};

init();
