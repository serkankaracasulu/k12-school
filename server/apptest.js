const http = require("http");
const mongoose = require("mongoose");
const { logger, logging } = require("./startup/logging");
logging();
require("dotenv").config();
const { model } = require("./models/index");
const { ApolloServer } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const express = require("express");
require("./startup/validation")();
const error = require("./startup/error");
const resolvers = require("./graphql/resolvers");
const typeDefs = importSchema("./graphql/types/schema.graphql");
const institiution = require("./testData/instiution.js");
const user = require("./testData/user.js");
async function auth(req, res, next) {
  const user = await model.User.findOne({});
  const token = user.generateAuthToken();
  req.activeUser = user;
  next();
}
mongoose
  .connect("mongodb://localhost/k12-school-testserver", {
    useNewUrlParser: true,
  })
  .then(async () => {
    logger.info({
      message: `Connected to "mongodb://localhost/k12-school-testserver"`,
    });
    await model.User.deleteMany({});
    await model.Institution.deleteMany();
    await model.User.insertMany(user);
    await model.Institution.insertMany(institiution);
  });
mongoose.set("useCreateIndex", true);
logger.info({
  message: "---------------Starting...-------------------------",
});
const PORT = 6000;
const app = express();

app.use(error);
app.use(auth);
const server = new ApolloServer({
  typeDefs,
  engine: process.env.APOLLO_KEY,
  resolvers,
  context: ({ req }) => ({
    activeUser: req ? req.activeUser : null,
  }),
});
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, () => {
  logger.info({
    message: `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath} for test server`,
  });
  logger.info({
    message: `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`,
  });
});
