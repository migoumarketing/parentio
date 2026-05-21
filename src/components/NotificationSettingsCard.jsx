export default function NotificationSettingsCard({
  S = {},
  T = {},
  notificationSettings,
  updateNotificationSettings,
  requestNotificationPermission,
  sendLocalNotification,
  lang = "fr"
}) {
  const text = {
    fr: {
      title: "Notifications intelligentes",
      sub: "Recevez des rappels utiles sans surveiller l’autre parent.",
      enabled: "Activer les notifications",
      hour: "Heure du rappel",
      events: "Événements importants",
      custody: "Changements de garde",
      vacations: "Vacances scolaires",
      test: "Tester une notification",
      permission: "Autoriser les notifications"
    },
    en: {
      title: "Smart notifications",
      sub: "Receive useful reminders without monitoring the other parent.",
      enabled: "Enable notifications",
      hour: "Reminder time",
      events: "Important events",
      custody: "Custody changes",
      vacations: "School holidays",
      test: "Test notification",
      permission: "Allow notifications"
    },
    es: {
      title: "Notificaciones inteligentes",
      sub: "Reciba recordatorios útiles sin vigilar al otro progenitor.",
      enabled: "Activar notificaciones",
      hour: "Hora del recordatorio",
      events: "Eventos importantes",
      custody: "Cambios de custodia",
      vacations: "Vacaciones escolares",
      test: "Probar notificación",
      permission: "Permitir notificaciones"
    }
  }[lang] || {
    title: "Smart notifications",
    sub: "Receive useful reminders without monitoring the other parent.",
    enabled: "Enable notifications",
    hour: "Reminder time",
    events: "Important events",
    custody: "Custody changes",
    vacations: "School holidays",
    test: "Test notification",
    permission: "Allow notifications"
  };

  const card = S.card || {
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    color: "#fff"
  };

  const label = S.inpLbl || { fontSize: 12, opacity: 0.7, marginBottom: 6 };
  const input = S.inp || {
    borderRadius: 12,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff"
  };

  function Toggle({ checked, onChange, children }) {
    return (
      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(128,128,128,0.16)", cursor: "pointer" }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{children}</span>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      </label>
    );
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 11, fontWeight: 900, opacity: 0.65, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 8 }}>
        🔔 {text.title}
      </div>
      <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5, marginBottom: 14 }}>{text.sub}</div>
      <Toggle checked={notificationSettings.enabled} onChange={(value) => updateNotificationSettings({ enabled: value })}>{text.enabled}</Toggle>
      <div style={{ marginTop: 12 }}>
        <div style={label}>{text.hour}</div>
        <input type="time" value={notificationSettings.reminder_hour} onChange={(event) => updateNotificationSettings({ reminder_hour: event.target.value })} style={{ ...input, maxWidth: 180, width: "100%" }} />
      </div>
      <Toggle checked={notificationSettings.notify_events} onChange={(value) => updateNotificationSettings({ notify_events: value })}>{text.events}</Toggle>
      <Toggle checked={notificationSettings.notify_custody_changes} onChange={(value) => updateNotificationSettings({ notify_custody_changes: value })}>{text.custody}</Toggle>
      <Toggle checked={notificationSettings.notify_vacations} onChange={(value) => updateNotificationSettings({ notify_vacations: value })}>{text.vacations}</Toggle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
        <button onClick={requestNotificationPermission} style={{ border: "none", borderRadius: 12, padding: "11px 14px", background: "#6366f1", color: "#fff", fontWeight: 900, cursor: "pointer" }}>{text.permission}</button>
        <button onClick={() => sendLocalNotification("Parentio", text.test)} style={{ border: "none", borderRadius: 12, padding: "11px 14px", background: "#10b981", color: "#fff", fontWeight: 900, cursor: "pointer" }}>{text.test}</button>
      </div>
    </div>
  );
}
