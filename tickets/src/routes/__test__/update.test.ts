import { Ticket } from "../../models/ticket";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "aslkdfj",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "aslkdfj",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: ticket } = await request(app)
    .post("/api/tickets")
    .set("Cookie", userOne)
    .send({
      title: "asldkfj",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", userTwo)
    .send({
      title: "alskdjflskjdf",
      price: 1000,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const { body: ticket } = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "alskdfjj",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const { body: ticket } = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const { body: ticketResponse } = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send();

  expect(ticketResponse.title).toEqual("new title");
  expect(ticketResponse.price).toEqual(100);
});

it("rejects edit a reserved ticket", async () => {
  const cookie = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const { body: ticket } = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    })
    .expect(201);

  const ticketFound = await Ticket.findById(ticket.id);
  ticketFound!.set({ orderId });
  await ticketFound!.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(400);
});
