import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import mongoose from "mongoose";
import { ItemDocument } from "./interfaces/ItemDocument";

const LottieFileSchema: mongoose.Schema = new mongoose.Schema({
  filename: { type: String, required: true },
  contents: { type: String, required: true },
});

const ItemSchema: mongoose.Schema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String], required: true },
  dateUploaded: { type: String, required: true },
  lottieFile: { type: LottieFileSchema, required: true },
});

const Item = mongoose.model<ItemDocument>("Item", ItemSchema);

// The GraphQL Object type for LottieFile
const LottieFileType = new GraphQLObjectType({
  name: "LottieFile",
  fields: {
    filename: { type: GraphQLString },
    contents: { type: GraphQLString }, // Assuming contents are stored as JSON string
  },
});

// The GraphQL Object type for the main item in db
const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: {
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    author: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    dateUploaded: { type: GraphQLString },
    lottieFile: { type: LottieFileType },
  },
});

const LottieFileInputType = new GraphQLInputObjectType({
  name: "LottieFileInput",
  fields: {
    filename: { type: GraphQLString },
    contents: { type: GraphQLString },
  },
});

// Query Object type
const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    item: {
      type: ItemType,
      args: { id: { type: GraphQLString } },
      resolve(_parent, args) {
        return Item.findOne({ id: args.id });
      },
    },
    searchItems: {
      type: new GraphQLList(ItemType),
      args: { keyword: { type: GraphQLString } },
      resolve(_parent, args) {
        const keywordRegex = new RegExp(args.keyword, "i");
        return Item.find({
          $or: [
            { description: { $regex: keywordRegex } },
            { tags: { $regex: keywordRegex } },
          ],
        });
      },
    },
  },
});

// Mutation for adding new item
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addItem: {
      type: ItemType,
      args: {
        id: { type: GraphQLString },
        description: { type: GraphQLString },
        author: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        dateUploaded: { type: GraphQLString },
        lottieFile: { type: LottieFileInputType },
      },
      resolve(_parent, args) {
        const item = new Item({
          id: args.id,
          description: args.description,
          author: args.author,
          tags: args.tags,
          dateUploaded: args.dateUploaded,
          lottieFile: args.lottieFile,
        });
        return item.save();
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
