const { importSchema } = require("graphql-import");
const http = require("http");
const proxyMiddleware = require("http-proxy-middleware");
const { ApolloServer: exp } = require("apollo-server-express");
const express = require("express");
process.env.NODE_ENV = "test";

require("dotenv").config({ path: "../../.env.test" });
const resolvers = require("../../graphql/resolvers");
const typeDefs = importSchema("graphql/types/schema.graphql");

const PORT = 6000;
const app = express();
const server = new exp({
  typeDefs,
  resolvers,
  engine: false
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {});
module.exports.server = server;
