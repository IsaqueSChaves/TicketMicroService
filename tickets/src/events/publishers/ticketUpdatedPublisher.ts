import { Publisher, Subjects, TicketUpdatedEvent } from "@isctickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}