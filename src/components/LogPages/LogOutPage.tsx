
import { Link } from "react-router-dom"
import Footer from "../homepage/Footer/Footer"

const WelcomePage = () => {
  return (
    <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <div className="bg-white shadow-md rounded-2xl p-10 max-w-md w-full">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Welcome to ShareSpend
            </h1>
            <h2 className="text-lg text-gray-700 mb-8">
            Please log in to continue
            </h2>

            <Link
            to="/LogInPage"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-lg font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all"
            >
            <img
                src="/assets/log-in.png"
                alt="Log In"
                className="w-5 h-5"
            />
            <span>Log In</span>
            </Link>
        </div>
        </div>
        
        <Footer/>
    </>
  )
}

export default WelcomePage
