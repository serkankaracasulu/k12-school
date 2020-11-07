import mongoose from "mongoose";
import { logger } from "./logging";

export default function() {
  mongoose
    .connect(process.env.DB_URI || "mongodb://localhost/k12-school", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => {
      logger.info({
        message: `Connected to ${process.env.DB_URI}`
      });
    });
  mongoose.set("useCreateIndex", true);
}
