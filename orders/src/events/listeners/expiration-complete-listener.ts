import { Subjects, Listener, ExpirationCompleteEvent, OrderStatus } from "@isctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const { orderId } = data;

        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        });

        await order.populate("ticket");
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id.toString(),
            version: order.version,
            ticket: {
                id: order.ticket.id.toString(),
            },
        });

        msg.ack();
    }
}
