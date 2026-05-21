import { useEffect, useState } from "react";
import {
  getNotificationSettings,
  saveNotificationSettings
} from "../services/notifications";

const DEFAULT_SETTINGS = {
  enabled: false,
  reminder_hour: "09:00",
  notify_events: true,
  notify_custody_changes: true,
  notify_vacations: true
};

export function useSmartNotifications(user) {
  const [notificationSettings, setNotificationSettings] = useState(DEFAULT_SETTINGS);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!user?.id) return;

      try {
        setLoadingNotifications(true);
        const data = await getNotificationSettings(user.id);

        if (mounted && data) {
          setNotificationSettings({
            enabled: data.enabled ?? false,
            reminder_hour: data.reminder_hour || "09:00",
            notify_events: data.notify_events ?? true,
            notify_custody_changes: data.notify_custody_changes ?? true,
            notify_vacations: data.notify_vacations ?? true
          });
        }
      } catch (error) {
        console.error("Erreur notifications :", error);
      } finally {
        if (mounted) setLoadingNotifications(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [user?.id]);

  async function updateNotificationSettings(nextSettings) {
    const merged = { ...notificationSettings, ...nextSettings };
    setNotificationSettings(merged);

    if (!user?.id) return merged;

    try {
      await saveNotificationSettings(user.id, merged);
    } catch (error) {
      console.error("Erreur sauvegarde notifications :", error);
    }

    return merged;
  }

  async function requestNotificationPermission() {
    if (!("Notification" in window)) return "unsupported";
    return await Notification.requestPermission();
  }

  function sendLocalNotification(title, body) {
    if (!notificationSettings.enabled) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    new Notification(title, { body });
  }

  return {
    notificationSettings,
    loadingNotifications,
    updateNotificationSettings,
    requestNotificationPermission,
    sendLocalNotification
  };
}
