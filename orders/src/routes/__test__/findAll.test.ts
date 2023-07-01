import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import request from "supertest";
import mongoose from "mongoose";

const buildTicket = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: "Taylor",
    price: 145,
    id,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for an particular user ", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const user = global.signin();
  const user2 = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  expect(response.body.length == 2);
  expect(response.body[0].ticketId == ticketTwo.id);
  expect(response.body[1].ticketId == ticketThree.id);
});
