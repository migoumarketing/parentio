export function exportCalendarPDF({
  appName = "Parentio",
  monthName = "",
  year = "",
  pA = "Parent A",
  pB = "Parent B",
  colorA = "#6366f1",
  colorB = "#ec4899",
  selectedMonthDays = [],
  events = {},
  notes = {},
  disclaimer = "Outil d’organisation uniquement — aucune valeur juridique."
}) {
  const win = window.open("", "_blank");

  if (!win) {
    alert("Le navigateur a bloqué l’ouverture du PDF. Autorisez les pop-ups pour Parentio.");
    return;
  }

  const rows = selectedMonthDays
    .filter((item) => item && item.day)
    .map((item) => {
      const key = item.key;
      const dayEvents = events[key] || [];
      const note = notes[key] || "";

      return `
        <tr>
          <td>${item.day}</td>
          <td>${item.week || ""}</td>
          <td>
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.isA ? colorA : colorB};margin-right:6px;"></span>
            ${item.parent || ""}
          </td>
          <td>${item.vacation || ""}</td>
          <td>${dayEvents.map((event) => event.titre || event.title || "Événement").join("<br>")}</td>
          <td>${note}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${appName} — ${monthName} ${year}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; }
          .brand { font-size: 28px; font-weight: 900; color: #4f46e5; }
          .subtitle { font-size: 14px; color: #6b7280; margin-top: 4px; }
          .month { font-size: 22px; font-weight: 900; }
          .legend { display: flex; gap: 16px; margin-bottom: 20px; font-size: 13px; font-weight: 700; }
          .dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #f3f4f6; color: #374151; text-align: left; padding: 9px; border: 1px solid #e5e7eb; }
          td { padding: 9px; border: 1px solid #e5e7eb; vertical-align: top; }
          tr:nth-child(even) { background: #fafafa; }
          .disclaimer { margin-top: 24px; padding: 12px; border-radius: 10px; background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; font-size: 12px; line-height: 1.5; }
          .footer { margin-top: 24px; font-size: 11px; color: #6b7280; text-align: center; }
          @media print { button { display: none; } body { margin: 20px; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()" style="margin-bottom:20px;padding:12px 16px;border:none;border-radius:10px;background:#4f46e5;color:white;font-weight:900;cursor:pointer;">
          Imprimer / Enregistrer en PDF
        </button>

        <div class="header">
          <div>
            <div class="brand">${appName}</div>
            <div class="subtitle">Calendrier parental exporté</div>
          </div>
          <div class="month">${monthName} ${year}</div>
        </div>

        <div class="legend">
          <div><span class="dot" style="background:${colorA};"></span>${pA}</div>
          <div><span class="dot" style="background:${colorB};"></span>${pB}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Jour</th>
              <th>Semaine</th>
              <th>Garde</th>
              <th>Vacances</th>
              <th>Événements</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="disclaimer">⚠️ ${disclaimer}</div>
        <div class="footer">Export généré avec ${appName}.</div>
      </body>
    </html>
  `;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
