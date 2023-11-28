import { getItems, getItem } from "../controllers/itemsController.js";

// Item schema
const Item = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    price: { type: "number" },
  },
};

// Options for get all items
const getItemsOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: Item,
      },
    },
  },
  handler: getItems,
};

const getItemOpts = {
  schema: {
    response: {
      200: Item,
    },
  },
  handler: getItem,
};

function itemRoutes(fastify, options, done) {
  fastify.get("/items", getItemsOpts);
  fastify.get("/items/:id", getItemOpts);
  done();
}

export default itemRoutes;
