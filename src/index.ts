import express from "express";
import { graphqlHTTP } from "express-graphql";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import schema from "./schema.ts";
import cors from "cors";

dotenv.config();

const app = express();

// Increase the limit for incoming requests
app.use(express.json({ limit: "5mb" }));

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

// Setup CORS options
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ORIGIN_APP_PROD
      : process.env.ORIGIN_APP_DEV,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS middleware
app.use(cors(corsOptions));

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development", // Enable only when in dev node
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
