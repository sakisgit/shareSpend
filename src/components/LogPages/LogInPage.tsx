
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../supabaseClient/supabaseClient";
import LogInBtn from "../Buttons/LogInBtn";

const LogInPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null> (null);
    const [rememberMe, setRemberMe] = useState(true);

    const handleLogin= async () => {
      setError(null);

      const {data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
          setError(error.message);
      } else {
          // Αν rememberMe = true, αποθήκευσε στο localStorage
          if (rememberMe) {
              // Το Supabase το κάνει αυτόματα με persistSession: true
              // Αλλά μπορούμε να set-άρουμε expiry
              localStorage.setItem('rememberMe', 'true');
          } else {
              localStorage.setItem('rememberMe', 'false');
          }
          
          navigate('/mainpage');
      };
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <div className="bg-white shadow-md rounded-4xl p-10 max-w-md w-full">
        <h1 className="text-2xl mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 text-left">
          <label 
            className="block mb-1 font-semibold" 
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your email"
            autoFocus
          />
        </div>

        <div className="mb-4 text-left">
          <label className="block mb-1 font-semibold" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center mb-6">
          <input 
            type="checkbox" 
            id="rememberMe" 
            className="mr-2" 
            checked={rememberMe}
            onChange={(e)=> setRemberMe(e.target.checked)}
          />
          <label 
            htmlFor="rememberMe" 
            className="font-medium"
          >
            Remember Me
          </label>
        </div>

        <LogInBtn  onClick={handleLogin}/>
      </div>
    </div>
  )
}

export default LogInPage
