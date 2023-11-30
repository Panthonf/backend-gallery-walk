import { items } from "../Items.js";
import { v4 as uuidv4 } from "uuid";

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

const addItem = (req, reply) => {
  const { name, price } = req.body;
  const item = {
    id: uuidv4(),
    name,
    price,
  };
  items.push(item);
  reply.code(201).send(item);
};

const deleteItem = (req, reply) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === id);

  if (!item) {
    return reply
      .code(404)
      .send({ success: false, message: `Item ${id} not found` });
  }

  const index = items.findIndex((item) => item.id === id);
  items.splice(index, 1);
  reply.send({ success: true, message: `Item ${id} deleted` });
};

const updateItem = (req, reply) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const itemIndex = items.findIndex((item) => item.id === Number(id));

  if (itemIndex === -1) {
    return reply
      .code(404)
      .send({ success: false, message: `Item ${id} not found` });
  }

  const updatedItem = {
    ...items[itemIndex], // Preserve other properties of the item
    name: name,
    price: price,
  };

  items[itemIndex] = updatedItem;

  reply.send({
    success: true,
    message: `Item ${id} updated`,
    data: updatedItem,
  });
};

export { getItems, getItem, addItem, deleteItem, updateItem };
