
import { useNavigate } from "react-router-dom";
import LogInBtn from "../Buttons/LogInBtn";
import Footer from "../homepage/Footer/Footer";

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleLogin=() => {
        navigate('/loginpage');
    };
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

                <LogInBtn onClick={handleLogin}/>
                
            </div>
        </div>

        <Footer/>
    </>
  )
}

export default WelcomePage
