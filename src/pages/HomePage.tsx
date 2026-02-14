
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

import { Link } from "react-router-dom";

function HomePage() {



  return (
    <>
      <h1>Home-Page</h1>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/account/login">Login</Link>
          </li>
          <li>
            <Link to="/account/register">Register</Link>
          </li>
          <li>
            <Link to="/account/profile">Profile</Link>
          </li>
          <li>
            <Link to="/account/logout">Logout</Link>
          </li>
          <li>
            <Link to="/Error">Error</Link>
          </li>
        </ul>
      </nav>


      <ThemeToggleButton />
    </>
  );
}

export default HomePage;
