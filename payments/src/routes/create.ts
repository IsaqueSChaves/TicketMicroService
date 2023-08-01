import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@isctickets/common";
import { Request, Response, NextFunction, Router } from "express";
import { Payment } from "../models/payment";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";

const router = Router();

router.post(
    "/",
    requireAuth,
    [
        body("token").not().isEmpty().withMessage("Token is required"),
        body("orderId").not().isEmpty().withMessage("OrderId is required"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderId, token } = req.body;
            const order = await Order.findById(orderId);

            if (!order) {
                throw new NotFoundError();
            }
            const userPaying = req.currentUser!;

            if (order.userId !== userPaying.id) {
                throw new NotAuthorizedError();
            }

            if (order.status === OrderStatus.Cancelled) {
                throw new BadRequestError("Cannot pay for an order cancelled");
            }

            const { id: stripeId } = await stripe.charges.create({
                currency: "usd",
                amount: order.price * 100,
                source: token,
            });

            const payment = Payment.build({ stripeId, orderId });
            await payment.save();

            return res.status(201).send({ order });
        } catch (error) {
            next(error);
        }
    }
);

export { router as createChargeRouter };
