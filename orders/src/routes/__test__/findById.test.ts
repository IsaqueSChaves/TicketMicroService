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

it("fetches orders for an particular user ", async () => {
  const ticket = await buildTicket();
  const cookie = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(fetchedOrder.ticket.id).toEqual(ticket.id);
});

it("return unauthorized if another user tries fetch order from other", async () => {
  const ticket = await buildTicket();
  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});

it("return not found if another user tries fetch order that doesn't exist", async () => {
  const orderId = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});
