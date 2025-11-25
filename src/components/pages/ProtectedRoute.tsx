
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from '../../supabaseClient/supabaseClient';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
    };

    checkSession();

    // Listen για auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading){
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <img 
            src="/assets/spinner.gif"
            alt="Spinner"
            className="w-20 h-20 mb-6"
          />
          <div className="text-xl font-semibold text-gray-700 animate-pulse">
            Loading...
          </div>
        </div>
     );
  };

  if (!session) {
    return <Navigate to="/loginpage" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
