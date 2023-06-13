import { Subjects, Publisher, OrderCancelledEvent } from "@isctickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
