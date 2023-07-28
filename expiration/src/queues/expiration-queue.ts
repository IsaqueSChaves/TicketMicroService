import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-completedPublisher";
import { natsWrapper } from "../natsWrapper";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});


expirationQueue.process(async (job) => {
    const { data } = job;
    new ExpirationCompletedPublisher(natsWrapper.client).publish({
        orderId: data.orderId
    });
});

export { expirationQueue };