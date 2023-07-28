import { Publisher, Subjects, ExpirationCompleteEvent } from "@isctickets/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
