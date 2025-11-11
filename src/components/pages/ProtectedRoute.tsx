
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from '../../supabaseClient/supabaseClient';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Navigate to="/loginpage" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
