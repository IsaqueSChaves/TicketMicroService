import Link from "next/link";

export default function Header({ currentUser }) {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/" className="navbar-brand">
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {currentUser ? (
            <Link href="/auth/signout">Sign Out</Link>
          ) : (
            <>
              <li className="nav-item">
                <Link href="/auth/signin">Sign In</Link>
              </li>
              <li className="nav-item">
                <Link href="/auth/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
