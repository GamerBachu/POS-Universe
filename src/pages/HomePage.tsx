import { userApi } from "@/api";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {

  useEffect(() => {
    userApi.post({
      username: "Abc",
      password: "ppp"
    });
  }, []);

  return (
    <>
      <h1>Home</h1>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>


      <ThemeToggleButton />
    </>
  );
}

export default HomePage;
