import { items } from "../Items.js";

const getItems = (req, reply) => {
  reply.send(items);
};

const getItem = (req, reply) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === Number(id));

  if (!item) {
    return reply
      .code(404)
      .send({ success: false, message: `Item ${id} not found` });
  }
  reply.send(item);
};

export { getItems, getItem };
