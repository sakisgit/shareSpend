
// src/components/error/ErrorPage.tsx
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Oops! The page you are looking for does not exist or has been moved. Don't worry, you can return to the homepage.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition"
      >
        Go Back Home
      </Link>
      <div className="mt-10">
        <img
          src="/assets/unDrawImages/undraw_page-eaten_b2rt.png"
          alt="Error Page (Eaten hehehe) Not Found..."
          className="w-80 md:w-96"
        />
      </div>
    </div>
  );
};

export default ErrorPage;
