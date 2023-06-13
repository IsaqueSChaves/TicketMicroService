import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../natsWrapper";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { app } from "../../app";
import request from "supertest";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "Taylor",
    price: 145,
  });
  await ticket.save();
  return ticket;
};

it("delete orders for an particular user ", async () => {
  const ticket = await buildTicket();
  const cookie = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  const canceledOrder = await Order.findById(order.id);
  expect(canceledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("return unauthorized if another user tries delete order from other", async () => {
  const ticket = await buildTicket();
  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});

it("return not found if another user tries delete order that doesn't exist", async () => {
  const orderId = new mongoose.Types.ObjectId();

  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("cancel an published an event", async () => {
  const user = global.signin();
  const ticket = Ticket.build({
    title: "AM",
    price: 522,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
