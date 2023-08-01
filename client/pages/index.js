import Router from "next/router";

const Home = ({ currentUser, tickets }) => {
	const individualTicket = async (ticketId) => {
		try {
			Router.push({
				pathname: "/tickets/indivdual-ticket",
				query: { ticketId },
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					{tickets.length > 0 &&
						tickets.map((ticket, i) => (
							<tr
								onClick={() => individualTicket(ticket.id)}
								key={i}
								style={{
									backgroundColor: "#007bff",
									color: "#ffffff",
									cursor: "pointer",
								}}
							>
								<td>{ticket.title}</td>
								<td>{ticket.price}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

Home.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get("/api/tickets");
	return { tickets: data };
};

export default Home;
