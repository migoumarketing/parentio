// src/hooks/useAuth.js

import { useEffect, useState } from "react";
import { getCurrentUser, onAuthStateChange, signOut } from "../services/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }

    loadUser();

    const { data } = onAuthStateChange((session) => {
      setUser(session?.user || null);
      setLoadingAuth(false);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  async function logout() {
    await signOut();
    setUser(null);
  }

  return {
    user,
    loadingAuth,
    logout,
    isLoggedIn: !!user,
  };
}
