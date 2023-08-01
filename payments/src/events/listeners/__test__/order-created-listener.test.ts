import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@isctickets/common";
import { natsWrapper } from "../../../natsWrapper";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const id = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();

    const data: OrderCreatedEvent["data"] = {
        id,
        userId,
        status: OrderStatus.Created,
        ticket: {
            price: 220,
            id: "IJPGSAGA",
            title: "Artick Monkeys"
        },
        version: 0,
        expiresAt: "OUGAAS"
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it("replicates the order info", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toBeCalledTimes(1);
});