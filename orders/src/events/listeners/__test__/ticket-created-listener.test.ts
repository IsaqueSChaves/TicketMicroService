import { TicketCreatedListener } from "../ticket-created-listener";
import { TicketCreatedEvent } from "@isctickets/common";
import { natsWrapper } from "../../../natsWrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const id = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id,
    title: "A.M.",
    price: 100,
    userId,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves an ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalledTimes(1);
});
