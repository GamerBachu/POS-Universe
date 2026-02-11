import { Routes, Route, Link } from 'react-router-dom';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { useEffect } from 'react';
import { userApi } from "@/api";

function Home() {

  useEffect(() => {

    userApi.post({
      username: "Abc",
      password: "ppp"
    });


  }, []);


  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <ThemeToggleButton></ThemeToggleButton>
    </>
  );
}

export default App;
