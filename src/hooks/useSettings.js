import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../services/settings";

export function useSettings(user, config) {
  const [cloudSettings, setCloudSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;

      try {
        setLoadingSettings(true);

        const data = await getSettings(user.id);

        if (data?.config) {
          setCloudSettings(data.config);
        }
      } catch (error) {
        console.error("Erreur chargement settings :", error);
      } finally {
        setLoadingSettings(false);
      }
    }

    load();
  }, [user]);

  async function syncSettings(nextConfig) {
    if (!user?.id) return;

    try {
      await saveSettings(user.id, nextConfig);
      setCloudSettings(nextConfig);
    } catch (error) {
      console.error("Erreur sauvegarde settings :", error);
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    if (!config) return;

    const timeout = setTimeout(() => {
      syncSettings(config);
    }, 800);

    return () => clearTimeout(timeout);
  }, [config, user]);

  return {
    cloudSettings,
    loadingSettings,
    syncSettings
  };
}
