import Link from "next/link";

export default function Header({ currentUser }) {
	return (
		<nav className="navbar navbar-light bg-light">
			<Link href="/" className="navbar-brand ms-3">
				GitTix
			</Link>

			<div>
				<ul className=" d-flex justify-content-around">
					{currentUser ? (
						<>
							<li className="nav-item me-3">
								<Link href="/orders">My Orders</Link>
							</li>
							<li className="nav-item me-3">
								<Link href="/tickets/new">Sell Tickets</Link>
							</li>
							<li className="nav-item me-3">
								<Link href="/auth/signout">Sign Out</Link>
							</li>
						</>
					) : (
						<>
							<li className="nav-item">
								<Link href="/auth/signin">Sign In</Link>
							</li>
							<li className="nav-item mx-3">
								<Link href="/auth/signup">Sign Up</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
}
