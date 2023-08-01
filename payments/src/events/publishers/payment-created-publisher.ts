import { Subjects, Publisher, PaymentCreatedEvent } from "@isctickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}