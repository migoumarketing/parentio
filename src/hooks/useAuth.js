// src/hooks/useAuth.js

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { getCurrentUser, onAuthStateChange, signOut } from "../services/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  async function loadPremiumStatus(currentUser) {
    if (!currentUser?.id) {
      setIsPremium(false);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Erreur chargement Premium :", error);
        setIsPremium(false);
        return false;
      }

      const premiumValue = data?.is_premium === true;
      setIsPremium(premiumValue);
      return premiumValue;
    } catch (error) {
      console.error("Erreur Premium :", error);
      setIsPremium(false);
      return false;
    }
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await loadPremiumStatus(currentUser);
      } catch {
        setUser(null);
        setIsPremium(false);
      } finally {
        setLoadingAuth(false);
      }
    }

    loadUser();

    const { data } = onAuthStateChange(async (session) => {
      const nextUser = session?.user || null;

      setUser(nextUser);
      await loadPremiumStatus(nextUser);

      setLoadingAuth(false);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  async function logout() {
    await signOut();
    setUser(null);
    setIsPremium(false);
  }

  return {
    user,
    loadingAuth,
    logout,
    isLoggedIn: !!user,
    isPremium,
    refreshPremiumStatus: () => loadPremiumStatus(user)
  };
}
