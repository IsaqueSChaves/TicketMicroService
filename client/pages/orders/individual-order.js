import StripeCheckout from "react-stripe-checkout";
import { useState, useEffect } from "react";
import Error from "@/components/error";
import axios from "axios";
import Router from "next/router";

export default function OrderDetails({ order, currentUser }) {
	const [error, setError] = useState([]);
	const [timeLeft, setTimeLeft] = useState("");

	const sendToThePaymentsService = async (orderId, tokenId) => {
		try {
			const { data } = await axios.post("/api/payments", {
				orderId,
				token: tokenId,
			});
			Router.push("/orders");
		} catch (error) {
			setError(error.response.data.errors);
		}
	};

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};

		findTimeLeft();

		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, []);

	return (
		<div>
			{timeLeft > 0 ? (
				<>
					<h1>Time left to pay: {timeLeft} seconds</h1>
					<StripeCheckout
						token={({ id }) => sendToThePaymentsService(order.id, id)}
						stripeKey="pk_test_51NDeawHUuAWDpf6N2dl2STh6lqFAhHu4MNw5hCXN7nwe1RhI2u708HwlnHKNlaloQLT7ZJRQd1ms9Y13fckz7vWo00zBSM6fHy"
						amount={order.ticket.price * 100}
						email={currentUser.email}
					/>
				</>
			) : (
				<h1>Your time was expired</h1>
			)}
			{error.length > 0 && <Error errorsBack={error} />}
		</div>
	);
}

OrderDetails.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	const { data } = await client.get(`/api/orders/${orderId}`);
	return { order: data };
};
