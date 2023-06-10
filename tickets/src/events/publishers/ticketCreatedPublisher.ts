import { Publisher, Subjects, TicketCreatedEvent } from "@isctickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
