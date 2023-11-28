import { items } from "../Items.js";

// I

// Options for get all items
const getItemsOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            price: { type: "integer" },
          },
        },
      },
    },
  },
};

const getItemOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          price: { type: "number" },
        },
      },
    },
  },
};

function itemRoutes(fastify, options, done) {
  // GET /items
  fastify.get("/items", getItemsOpts, (request, reply) => {
    reply.send(items);
  });

  // GET /items/:id
  fastify.get("/items/:id", getItemOpts, (request, reply) => {
    const { id } = request.params;
    const item = items.find((item) => item.id === Number(id));
    reply.send(item);
  });

  done();
}

export default itemRoutes;
