import {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
} from "../controllers/itemsController.js";

// Item schema
const Item = {
  type: "object",
  properties: {
    id: { type: "string" },
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

const postItemOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name", "price"],
      properties: {
        name: { type: "string" },
        price: { type: "number" },
      },
    },
    response: {
      201: Item,
    },
  },
  handler: addItem,
};

const deleteItemOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "boolean" },
        },
      },
    },
  },
  handler: deleteItem,
};

const updateItemOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "boolean" },
          data: Item,
        },
      },
    },
  },
  handler: updateItem,
};

function itemRoutes(fastify, options, done) {
  fastify.get("/items", getItemsOpts);
  fastify.get("/items/:id", getItemOpts);
  fastify.post("/items", postItemOpts);
  fastify.delete("/items/:id", deleteItemOpts);
  fastify.put("/items/:id", updateItemOpts);
  done();
}

export default itemRoutes;
