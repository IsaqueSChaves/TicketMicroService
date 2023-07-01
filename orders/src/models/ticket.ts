import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";
import mongoose from "mongoose";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  isReserved(): Promise<boolean>;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, title, price } = attrs;

  return new Ticket({
    _id: id,
    title: title,
    price: price,
  });
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.methods.findByEvent = async function (event: {
  id: string;
  version: number;
}) {
  const { id, version } = event;
  return Ticket.findOne({
    _id: id,
    version: version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
