
import { useNavigate } from "react-router-dom"
import LogInBtn from "../Buttons/LogInBtn"

const LogInPage = () => {
    const navigate = useNavigate();

    const handleLogin=() => {
        navigate('/mainpage');
    };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <div className="bg-white shadow-md rounded-4xl p-10 max-w-md w-full">
        <h1 className="text-2xl mb-6">Login</h1>

        <div className="mb-4 text-left">
          <label className="block mb-1 font-semibold" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4 text-left">
          <label className="block mb-1 font-semibold" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center mb-6">
          <input type="checkbox" id="rememberMe" className="mr-2" />
          <label htmlFor="rememberMe" className="font-medium">Remember Me</label>
        </div>

        <LogInBtn  onClick={handleLogin}/>
      </div>
    </div>
  )
}

export default LogInPage
