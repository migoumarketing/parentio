import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../services/settings";

export function useSettings(user, config) {
  const [cloudSettings, setCloudSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      if (!user?.id) {
        setCloudSettings(null);
        return;
      }

      try {
        setLoadingSettings(true);

        const data = await getSettings(user.id);

        if (!cancelled) {
          setCloudSettings(data?.config || null);
        }
      } catch (error) {
        console.error("Erreur chargement settings :", error);

        if (!cancelled) {
          setCloudSettings(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingSettings(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function syncSettings(nextConfig) {
    if (!user?.id) return null;
    if (!nextConfig) return null;

    try {
      const saved = await saveSettings(user.id, nextConfig);

      setCloudSettings(saved?.config || nextConfig);

      return saved;
    } catch (error) {
      console.error("Erreur sauvegarde settings :", error);
      return null;
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    if (!config) return;

    const timeout = setTimeout(() => {
      syncSettings(config);
    }, 900);

    return () => clearTimeout(timeout);
  }, [user?.id, config]);

  return {
    cloudSettings,
    loadingSettings,
    syncSettings
  };
}
