import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@isctickets/common";
import { natsWrapper } from "../../../natsWrapper";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const id = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        id: id,
        title: "A.M.",
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: userId,
        ticket,
        expiresAt: new Date()
    });

    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { order, listener, data, msg };
};

it("updates the order status to cancelled", async () => {
    const { order, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
    const { order, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);


    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toBeCalledTimes(1);
});
