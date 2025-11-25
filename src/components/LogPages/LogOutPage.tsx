
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient/supabaseClient";
import LogInBtn from "../Buttons/LogInBtn";
import Footer from "../homepage/Footer/Footer";

const LogOutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            // Αν είμαστε στο /logoutpage, κάνε logout
            if (location.pathname === '/logoutpage') {
                try {
                    // Κάνε logout από Supabase
                    await supabase.auth.signOut();
                    
                    // Καθάρισε το localStorage
                    localStorage.removeItem('rememberMe');
                    
                    // Redirect στο homepage
                    navigate('/', { replace: true });
                } catch (error) {
                    console.error('Error during logout:', error);
                    // Ακόμα και αν υπάρχει error, πήγαινε στο homepage
                    navigate('/', { replace: true });
                } finally {
                    setLoading(false);
                }
            } else {
                // Αν είμαστε στο /sharespend, ελέγξε session
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session) {
                    // Αν υπάρχει session, redirect στο mainpage
                    navigate('/mainpage', { replace: true });
                } else {
                    setLoading(false);
                }
            }
        };

        checkSession();

        // Listen για auth changes (μόνο για /sharespend)
        if (location.pathname === '/sharespend') {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session) {
                    navigate('/mainpage', { replace: true });
                } else {
                    setLoading(false);
                }
            });

            return () => subscription.unsubscribe();
        }
    }, [navigate, location.pathname]);

    const handleLogin = () => {
        navigate('/loginpage');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl">
                    {location.pathname === '/logoutpage' ? 'Logging out...' : 'Loading...'}
                </div>
            </div>
        );
    }

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
                    
                    <LogInBtn onClick={() => navigate('/loginpage')}/>

            </div>
        </div>

        <Footer/>
    </>
  )
}

export default LogOutPage;
