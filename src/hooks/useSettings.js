import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useSettings(user) {
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  async function loadSettings() {
    if (!user) return;

    setLoadingSettings(true);

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setSettings(data.config || {});
    }

    setLoadingSettings(false);
  }

  async function saveSettings(config) {
    if (!user) return;

    const payload = {
      user_id: user.id,
      config,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("settings")
      .upsert(payload, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Erreur settings :", error);
    }
  }

  useEffect(() => {
    loadSettings();
  }, [user]);

  return {
    settings,
    loadingSettings,
    saveSettings,
  };
}
