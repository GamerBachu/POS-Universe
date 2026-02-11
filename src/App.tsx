import { Routes, Route, Link } from 'react-router-dom';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';

function App() {
  return (
    <MainLayout>
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
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <ThemeToggleButton />
    </MainLayout>
  );
}

export default App;
