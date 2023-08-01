import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@isctickets/common";
import { natsWrapper } from "../../../natsWrapper";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const id = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id,
        version: 0,
        price: 20,
        status: OrderStatus.Created,
        userId
    });

    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        ticket: {
            id: "IJPGSAGA",
        },
        version: 1,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it("updates the state from an order to order cancelled", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toBeCalledTimes(1);
});