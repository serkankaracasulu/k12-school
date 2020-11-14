import dotenv from 'dotenv';
import 'reflect-metadata';

import { ApolloServer, PubSub } from 'apollo-server-express';
import express from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import http from 'http';
import path from 'path';
import { buildSchema } from 'type-graphql';

import homework from './controllers/homework';
import * as studentProfile from './controllers/studentProfile';
import * as userProfile from './controllers/userProfile';
import dataLoaders from './dataLoaders';
import { resolvers } from './graphql/';
import { authChecker } from './helper/auth-cheker';
import tokenVerify from './helper/tokenVerify';
import auth from './middleware/auth';
import db from './startup/db';
import { logger, logging } from './startup/logging';
import { CContext } from './types';

console.log("1",process.env.DB_URI)
dotenv.config();
logging();
db();
(async () => {
  /*
  const pubSub = new RedisPubSub({
    connection: {
      host: "localhost",
      port: 6379,
    },
  });
  */
  const pubsub = new PubSub();
  logger.info({
    message: "---------------Starting...-------------------------",
  });
  const PORT = 4000;
  const app = express();
  app.use(auth);
  app.get("/students/profile", studentProfile.profile);
  app.get("/users/profile", userProfile.profile);
  app.get("/homework", homework);
  app.use("/static", express.static(path.join(__dirname, "public")));
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: resolvers,
      dateScalarMode: "isoDate",
      authChecker,
      pubSub:pubsub,
    }),
    engine: true,
    context: ({ req, connection }) => {
      const context: CContext = {
        dataloaders: dataLoaders(req ? req.activeUser : undefined),
      };
      if (req?.activeUser) context.activeUser = req.activeUser;
      if (connection) {
        return { ...connection.context, ...context };
      }
      return context;
    },
    subscriptions: {
      onConnect: (connectionParams: any) => {
        let activeUser = null;
        if (connectionParams.authorization) {
          const token = connectionParams.authorization.split(" ");
          if (token.length === 2) {
            activeUser = tokenVerify(token[1]);
            if (activeUser) return { activeUser };
          }
        }
        throw Error("Missing auth token!");
      },
    },
  });
  server.applyMiddleware({ app });
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen(PORT, () => {
    logger.info({
      message: `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    });
    logger.info({
      message: `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`,
    });
  });
})();
