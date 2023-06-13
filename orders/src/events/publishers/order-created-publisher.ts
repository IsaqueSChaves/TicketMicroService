import { Publisher, Subjects, OrderCreatedEvent } from "@isctickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
