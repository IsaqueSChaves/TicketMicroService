import { Subjects, Listener, TicketUpdatedEvent } from "@isctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("ticket not found");
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
