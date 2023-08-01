import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

const createOrder = async () => {
    const id = new Types.ObjectId().toHexString();
    const userId = new Types.ObjectId().toHexString();
    const order = Order.build({
        id,
        userId,
        status: OrderStatus.Created,
        version: 0,
        price: 150
    });
    await order.save();
    return order;
};

const cancelOrder = async () => {
    const order = await createOrder();
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    return order;
};

it("should return 404 when purchasing an order that not exist", async () => {
    const orderId = new Types.ObjectId().toHexString();
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({ token: "OJASGP", orderId })
        .expect(404);
});

it("should return 401 when purchasing an order doesnt belong the user", async () => {
    const { id: orderId } = await createOrder();
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({ token: "OJASGP", orderId })
        .expect(401);
});
it("should return 400 when purchasing a cancelled order", async () => {
    const { id: orderId, userId } = await cancelOrder();
    const cookie = global.signin(userId);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({ token: "OJASGP", orderId })
        .expect(400);
});

it("should return a 201 with valid inputs", async () => {
    const { id: orderId, userId, price } = await createOrder();
    const cookie = global.signin(userId);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({ token: "tok_visa", orderId })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect((chargeOptions.amout / 100) === price);
    expect(chargeOptions.currency === "usd");
    expect(chargeOptions.source === "tok_visa");
});

it("should save to the payments database", async () => {
    const { id: orderId, userId } = await createOrder();
    const cookie = global.signin(userId);

    let payments = await Payment.find({});
    expect(payments.length === 0);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({ token: "tok_visa", orderId })
        .expect(201);

    payments = await Payment.find({});
    expect(payments.length === 1);
}); 