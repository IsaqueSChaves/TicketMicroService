import { useState } from "react";
import Error from "@/components/error";
import Router from "next/router";
import axios from "axios";

export default function TicketDetails({ ticket }) {
	const [error, setError] = useState([]);

	const purchaseTicket = async (id) => {
		try {
			const { data } = await axios.post("/api/orders", { ticketId: id });
			const orderId = data.id;
			Router.push({
				pathname: "/orders/individual-order",
				query: { orderId },
			});
		} catch (error) {
			setError(error.response.data.errors);
		}
	};

	return (
		<div>
			<h2>Ticket Details</h2>
			<p>Title: {ticket.title}</p>
			<p>Price: {ticket.price}</p>
			<button
				onClick={() => purchaseTicket(ticket.id)}
				className="btn btn-outline-primary mt-1"
				type="submit"
			>
				Purchase
			</button>
			{error.length > 0 && (
				<>
					<Error errorsBack={error} />
				</>
			)}
		</div>
	);
}

TicketDetails.getInitialProps = async (context, client) => {
	const { ticketId } = context.query;
	const { data } = await client.get(`/api/tickets/${ticketId}`);
	return { ticket: data };
};
