import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns an error if ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "AM",
    price: 522,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "POGJGASDPJO",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserved an ticket", async () => {
  const ticket = Ticket.build({
    title: "AM",
    price: 522,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});