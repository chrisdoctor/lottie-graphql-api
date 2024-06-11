import express from "express";
import { graphqlHTTP } from "express-graphql";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import schema from "./schema";

dotenv.config();

const app = express();

// Define MongoDB connection options
const mongoOptions: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any;

// Setup connection
mongoose.connect(process.env.MONGO_URI as string, mongoOptions);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
