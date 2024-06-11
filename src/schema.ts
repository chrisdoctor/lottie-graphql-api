import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import mongoose from "mongoose";

// Mongoose item document
interface ItemDocument extends mongoose.Document {
  id: string;
  description: string;
}

const itemSchema = new mongoose.Schema({
  id: String,
  description: String,
});

const Item = mongoose.model<ItemDocument>("Item", itemSchema);

// The GraphQL Object type
const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: {
    id: { type: GraphQLID },
    description: { type: GraphQLString },
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
      },
      resolve(_parent, args) {
        const item = new Item({
          id: args.id,
          description: args.description,
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
