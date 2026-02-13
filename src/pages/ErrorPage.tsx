import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[inherit] text-center p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-6xl font-bold">Error</h1>
      <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
      <p className="mb-8">An unexpected error has occurred.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;