export default function CustodyConfigCard({
  S = {},
  L = {},
  T = {},
  lang = "fr",

  pA = "Parent A",
  pB = "Parent B",
  setPa = () => {},
  setPb = () => {},

  heureA = "18:00",
  heureB = "18:00",
  setHeureA = () => {},
  setHeureB = () => {},

  mode = "alternee",
  setMode = () => {},

  paireA = true,
  setPaireA = () => {},

  semPaireA = true,
  setSemPaireA = () => {},

  annePaireA = true,
  setAnnePaireA = () => {},

  joursA = [],
  setJoursA = () => {},

  colorA = "#6366f1",
  colorB = "#ec4899",

  getWN = () => 1,
  year = new Date().getFullYear(),

  pays = "france",
  setPays = () => {},
  zone = "B",
  setZone = () => {},
  PAYS_LIST = [],
  VACANCES_PAR_PAYS = {},
  zonesDisponibles = [],
  zoneLabels = {},

  anneeSco = new Date().getFullYear(),
  getPaques = () => new Date(),

  vacAlt = true,
  setVacAlt = () => {},
  showFeries = true,
  setShowFeries = () => {},

  classicStartDay = "friday",
  setClassicStartDay = () => {},

  classicEndDay = "sunday",
  setClassicEndDay = () => {},

  classicVacationMode = "split",
  setClassicVacationMode = () => {},

  classicVacationPart = "first",
  setClassicVacationPart = () => {},

  classicPrimaryParent = "A",
  setClassicPrimaryParent = () => {},

  classicPickupHour = "18:00",
  setClassicPickupHour = () => {},

  classicReturnHour = "18:00",
  setClassicReturnHour = () => {},

  Pill,
  Tog
}) {
  const inferredLang =
    lang ||
    (L?.tabs?.[0] === "Calendar"
      ? "en"
      : L?.tabs?.[0] === "Calendario"
      ? "es"
      : "fr");

  const currentLang = ["fr", "en", "es", "sv", "de", "it"].includes(inferredLang)
    ? inferredLang
    : "fr";

  const TR = {
    fr: {
      title: "Parents & mode de garde",
      anti: "Parentio est un outil d’organisation. Il ne doit pas servir à surveiller, harceler ou exercer une pression sur l’autre parent.",
      parentA: "Prénom A",
      parentB: "Prénom B",
      exchangeA: "Heure échange → Parent A",
      exchangeB: "Heure échange → Parent B",
      alternating: "🔄 Alternée",
      classic: "🏠 Classique",
      custom: "✏️ Personnalisé",
      evenWeek: "Semaine paire",
      oddWeek: "Semaine impaire",
      currentWeek: "Semaine actuelle",
      weekendAt: "week-end chez",
      primaryParent: "Parent principal",
      secondaryParent: "Autre parent",
      weekendStart: "Début du week-end",
      weekendEnd: "Fin du week-end",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
      monday: "Lundi matin",
      pickup: "Heure de récupération",
      returnHour: "Heure de dépôt",
      evenYear: "Année paire",
      oddYear: "Année impaire",
      currentYear: "Cette année",
      referenceAt: "référence chez",
      vacationMode: "Vacances scolaires",
      split: "1ère moitié / 2ème moitié",
      allPrimary: "Tout chez parent principal",
      allSecondary: "Tout chez autre parent",
      vacationSplit: "Répartition des vacances",
      firstPart: "1ère partie",
      secondPart: "2ème partie",
      daysWith: "Jours chez",
      otherDays: "Les autres jours",
      country: "Pays",
      schoolZone: "Zone scolaire",
      regionZone: "Région / Zone",
      schoolYear: "Année scolaire",
      easter: "Pâques",
      alternatingVac: "Vacances alternées",
      holidays: "Fériés & fêtes",
      summary: "Résumé classique",
      days: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]
    },
    es: {
      title: "Padres y custodia",
      anti: "Parentio es una herramienta de organización. No debe usarse para vigilar, acosar o presionar al otro progenitor.",
      parentA: "Nombre A",
      parentB: "Nombre B",
      exchangeA: "Hora de intercambio → Progenitor A",
      exchangeB: "Hora de intercambio → Progenitor B",
      alternating: "🔄 Alternada",
      classic: "🏠 Clásica",
      custom: "✏️ Personalizada",
      evenWeek: "Semana par",
      oddWeek: "Semana impar",
      currentWeek: "Semana actual",
      weekendAt: "fin de semana con",
      primaryParent: "Progenitor principal",
      secondaryParent: "Otro progenitor",
      weekendStart: "Inicio del fin de semana",
      weekendEnd: "Fin del fin de semana",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
      monday: "Lunes por la mañana",
      pickup: "Hora de recogida",
      returnHour: "Hora de entrega",
      evenYear: "Año par",
      oddYear: "Año impar",
      currentYear: "Este año",
      referenceAt: "referencia con",
      vacationMode: "Vacaciones escolares",
      split: "1ª mitad / 2ª mitad",
      allPrimary: "Todo con el progenitor principal",
      allSecondary: "Todo con el otro progenitor",
      vacationSplit: "Reparto de vacaciones",
      firstPart: "1ª parte",
      secondPart: "2ª parte",
      daysWith: "Días con",
      otherDays: "Los otros días",
      country: "País",
      schoolZone: "Zona escolar",
      regionZone: "Región / Zona",
      schoolYear: "Año escolar",
      easter: "Pascua",
      alternatingVac: "Vacaciones alternadas",
      holidays: "Festivos y celebraciones",
      summary: "Resumen clásico",
      days: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]
    },
    en: {
      title: "Parents & custody",
      anti: "Parentio is an organisation tool. It must not be used to monitor, harass, or pressure the other parent.",
      parentA: "Parent A name",
      parentB: "Parent B name",
      exchangeA: "Exchange time → Parent A",
      exchangeB: "Exchange time → Parent B",
      alternating: "🔄 Alternating",
      classic: "🏠 Classic",
      custom: "✏️ Custom",
      evenWeek: "Even week",
      oddWeek: "Odd week",
      currentWeek: "Current week",
      weekendAt: "weekend with",
      primaryParent: "Primary parent",
      secondaryParent: "Other parent",
      weekendStart: "Weekend starts",
      weekendEnd: "Weekend ends",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      monday: "Monday morning",
      pickup: "Pickup time",
      returnHour: "Return time",
      evenYear: "Even year",
      oddYear: "Odd year",
      currentYear: "This year",
      referenceAt: "reference with",
      vacationMode: "School holidays",
      split: "1st half / 2nd half",
      allPrimary: "All with primary parent",
      allSecondary: "All with other parent",
      vacationSplit: "Holiday split",
      firstPart: "1st part",
      secondPart: "2nd part",
      daysWith: "Days with",
      otherDays: "Other days",
      country: "Country",
      schoolZone: "School zone",
      regionZone: "Region / Zone",
      schoolYear: "School year",
      easter: "Easter",
      alternatingVac: "Alternating holidays",
      holidays: "Public holidays & celebrations",
      summary: "Classic summary",
      days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    }
  };

  const t = TR[currentLang] || TR.en || TR.fr;
  const currentWeek = getWN(new Date());
  const isCurrentWeekEven = currentWeek % 2 === 0;
  const isCurrentYearEven = new Date().getFullYear() % 2 === 0;

  const principalParent = classicPrimaryParent === "A" ? pA : pB;
  const secondaryParent = classicPrimaryParent === "A" ? pB : pA;

  const weekendEvenParent = semPaireA ? pA : pB;
  const weekendOddParent = semPaireA ? pB : pA;

  const yearEvenParent = annePaireA ? pA : pB;
  const yearOddParent = annePaireA ? pB : pA;

  const vacationFirstParent =
    classicVacationPart === "first" ? secondaryParent : principalParent;
  const vacationSecondParent =
    classicVacationPart === "first" ? principalParent : secondaryParent;

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 10,
    marginBottom: 11
  };

  const section = {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    background: "rgba(128,128,128,0.07)",
    border: `1px solid ${T.border || "rgba(128,128,128,0.18)"}`
  };

  const timeInput = {
    ...S.inp,
    width: "100%",
    maxWidth: 220,
    minWidth: 0,
    height: 48,
    borderRadius: 14,
    boxSizing: "border-box"
  };

  return (
    <div style={S.card}>
      <div style={S.sec}>👥 {t.title}</div>

      <div
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.18)",
          color: "#f59e0b",
          padding: 10,
          borderRadius: 12,
          fontSize: 11,
          lineHeight: 1.5,
          marginBottom: 14,
          fontWeight: 700
        }}
      >
        ⚠️ {t.anti}
      </div>

      <div style={grid2}>
        <div>
          <div style={S.inpLbl}>{t.parentA}</div>
          <input
            style={{ ...S.inp, borderColor: `${colorA}55`, borderRadius: 14 }}
            value={pA}
            onChange={(e) => setPa(e.target.value)}
          />
        </div>

        <div>
          <div style={S.inpLbl}>{t.parentB}</div>
          <input
            style={{ ...S.inp, borderColor: `${colorB}55`, borderRadius: 14 }}
            value={pB}
            onChange={(e) => setPb(e.target.value)}
          />
        </div>
      </div>

      <div style={grid2}>
        <div>
          <div style={S.inpLbl}>{t.exchangeA}</div>
          <input
            type="time"
            style={timeInput}
            value={heureA}
            onChange={(e) => setHeureA(e.target.value)}
          />
        </div>

        <div>
          <div style={S.inpLbl}>{t.exchangeB}</div>
          <input
            type="time"
            style={timeInput}
            value={heureB}
            onChange={(e) => setHeureB(e.target.value)}
          />
        </div>
      </div>

      <div style={{ ...S.row, marginBottom: 12 }}>
        <Pill active={mode === "alternee"} color="#8b5cf6" onClick={() => setMode("alternee")}>
          {t.alternating}
        </Pill>
        <Pill active={mode === "classique"} color="#8b5cf6" onClick={() => setMode("classique")}>
          {t.classic}
        </Pill>
        <Pill active={mode === "personnalise"} color="#8b5cf6" onClick={() => setMode("personnalise")}>
          {t.custom}
        </Pill>
      </div>

      {mode === "alternee" && (
        <div style={section}>
          <div style={S.row}>
            <Pill active={paireA} color={colorA} onClick={() => setPaireA(true)}>
              {t.evenWeek} → {pA}
            </Pill>
            <Pill active={!paireA} color={colorB} onClick={() => setPaireA(false)}>
              {t.evenWeek} → {pB}
            </Pill>
          </div>

          <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>
            {t.currentWeek} : S{currentWeek} ({isCurrentWeekEven ? t.evenWeek : t.oddWeek})
          </div>
        </div>
      )}

      {mode === "classique" && (
        <>
          <div style={section}>
            <div style={S.inpLbl}>{t.primaryParent}</div>
            <div style={S.row}>
              <Pill active={classicPrimaryParent === "A"} color={colorA} onClick={() => setClassicPrimaryParent("A")}>
                {pA}
              </Pill>
              <Pill active={classicPrimaryParent === "B"} color={colorB} onClick={() => setClassicPrimaryParent("B")}>
                {pB}
              </Pill>
            </div>
          </div>

          <div style={section}>
            <div style={S.inpLbl}>{t.weekendStart}</div>
            <div style={S.row}>
              <Pill active={classicStartDay === "friday"} color="#06b6d4" onClick={() => setClassicStartDay("friday")}>
                {t.friday}
              </Pill>
              <Pill active={classicStartDay === "saturday"} color="#06b6d4" onClick={() => setClassicStartDay("saturday")}>
                {t.saturday}
              </Pill>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={S.inpLbl}>{t.weekendEnd}</div>
              <div style={S.row}>
                <Pill active={classicEndDay === "sunday"} color="#14b8a6" onClick={() => setClassicEndDay("sunday")}>
                  {t.sunday}
                </Pill>
                <Pill active={classicEndDay === "monday"} color="#14b8a6" onClick={() => setClassicEndDay("monday")}>
                  {t.monday}
                </Pill>
              </div>
            </div>
          </div>

          <div style={section}>
            <div style={S.inpLbl}>{t.weekendAt} — {t.evenWeek}</div>
            <div style={S.row}>
              <Pill active={semPaireA} color={colorA} onClick={() => setSemPaireA(true)}>
                {t.evenWeek} → {pA}
              </Pill>
              <Pill active={!semPaireA} color={colorB} onClick={() => setSemPaireA(false)}>
                {t.evenWeek} → {pB}
              </Pill>
            </div>

            <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>
              {t.currentWeek} : S{currentWeek} ({isCurrentWeekEven ? t.evenWeek : t.oddWeek}) →{" "}
              {t.weekendAt}{" "}
              <strong
                style={{
                  color: isCurrentWeekEven
                    ? semPaireA
                      ? colorA
                      : colorB
                    : semPaireA
                    ? colorB
                    : colorA
                }}
              >
                {isCurrentWeekEven ? weekendEvenParent : weekendOddParent}
              </strong>
            </div>
          </div>

          <div style={section}>
            <div style={grid2}>
              <div>
                <div style={S.inpLbl}>{t.pickup}</div>
                <input
                  type="time"
                  style={timeInput}
                  value={classicPickupHour}
                  onChange={(e) => setClassicPickupHour(e.target.value)}
                />
              </div>

              <div>
                <div style={S.inpLbl}>{t.returnHour}</div>
                <input
                  type="time"
                  style={timeInput}
                  value={classicReturnHour}
                  onChange={(e) => setClassicReturnHour(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={section}>
            <div style={S.inpLbl}>{t.evenYear}</div>
            <div style={S.row}>
              <Pill active={annePaireA} color={colorA} onClick={() => setAnnePaireA(true)}>
                {t.evenYear} → {pA}
              </Pill>
              <Pill active={!annePaireA} color={colorB} onClick={() => setAnnePaireA(false)}>
                {t.evenYear} → {pB}
              </Pill>
            </div>

            <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>
              {t.currentYear} {new Date().getFullYear()} ={" "}
              {isCurrentYearEven ? t.evenYear : t.oddYear} → {t.referenceAt}{" "}
              <strong
                style={{
                  color: isCurrentYearEven
                    ? annePaireA
                      ? colorA
                      : colorB
                    : annePaireA
                    ? colorB
                    : colorA
                }}
              >
                {isCurrentYearEven ? yearEvenParent : yearOddParent}
              </strong>
            </div>
          </div>

          <div style={section}>
            <div style={S.inpLbl}>{t.vacationMode}</div>
            <div style={S.row}>
              <Pill active={classicVacationMode === "split"} color="#d97706" onClick={() => setClassicVacationMode("split")}>
                {t.split}
              </Pill>
              <Pill active={classicVacationMode === "allPrincipal"} color="#d97706" onClick={() => setClassicVacationMode("allPrincipal")}>
                {t.allPrimary}
              </Pill>
              <Pill active={classicVacationMode === "allSecondary"} color="#d97706" onClick={() => setClassicVacationMode("allSecondary")}>
                {t.allSecondary}
              </Pill>
            </div>

            {classicVacationMode === "split" && (
              <div style={{ marginTop: 10 }}>
                <div style={S.inpLbl}>{t.vacationSplit}</div>
                <div style={S.row}>
                  <Pill active={classicVacationPart === "first"} color={colorA} onClick={() => setClassicVacationPart("first")}>
                    {t.firstPart} → {secondaryParent}
                  </Pill>
                  <Pill active={classicVacationPart === "second"} color={colorB} onClick={() => setClassicVacationPart("second")}>
                    {t.secondPart} → {secondaryParent}
                  </Pill>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: "rgba(128,128,128,0.08)",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 12,
              color: T.sub,
              lineHeight: 1.7,
              marginBottom: 12
            }}
          >
            📋 <strong style={{ color: T.text }}>{t.summary}</strong>
            <br />• {t.primaryParent} →{" "}
            <strong style={{ color: classicPrimaryParent === "A" ? colorA : colorB }}>
              {principalParent}
            </strong>
            <br />• {t.secondaryParent} →{" "}
            <strong style={{ color: classicPrimaryParent === "A" ? colorB : colorA }}>
              {secondaryParent}
            </strong>
            <br />• {t.evenWeek} →{" "}
            <strong style={{ color: semPaireA ? colorA : colorB }}>{weekendEvenParent}</strong>
            <br />• {t.oddWeek} →{" "}
            <strong style={{ color: semPaireA ? colorB : colorA }}>{weekendOddParent}</strong>
            <br />• {t.weekendStart} →{" "}
            <strong style={{ color: T.text }}>
              {classicStartDay === "friday" ? t.friday : t.saturday}
            </strong>
            <br />• {t.weekendEnd} →{" "}
            <strong style={{ color: T.text }}>
              {classicEndDay === "sunday" ? t.sunday : t.monday}
            </strong>
            <br />• {t.pickup} → <strong style={{ color: T.text }}>{classicPickupHour}</strong>
            <br />• {t.returnHour} → <strong style={{ color: T.text }}>{classicReturnHour}</strong>
            {classicVacationMode === "split" && (
              <>
                <br />• {t.firstPart} → <strong style={{ color: colorA }}>{vacationFirstParent}</strong>
                <br />• {t.secondPart} → <strong style={{ color: colorB }}>{vacationSecondParent}</strong>
              </>
            )}
          </div>
        </>
      )}

      {mode === "personnalise" && (
        <div style={section}>
          <div style={S.inpLbl}>
            {t.daysWith} {pA}
          </div>

          <div style={S.row}>
            {t.days.map((dayLabel, index) => {
              const dayValue = index === 6 ? 0 : index + 1;

              return (
                <Pill
                  key={index}
                  active={joursA.includes(dayValue)}
                  color={colorA}
                  onClick={() =>
                    setJoursA((prev) =>
                      prev.includes(dayValue)
                        ? prev.filter((item) => item !== dayValue)
                        : [...prev, dayValue].sort((a, b) => a - b)
                    )
                  }
                >
                  {dayLabel}
                </Pill>
              );
            })}
          </div>

          <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>
            {t.otherDays} → {pB}
          </div>
        </div>
      )}

      <div style={section}>
        <div style={S.inpLbl}>🌍 {t.country}</div>
        <div style={{ ...S.row, gap: 6 }}>
          {PAYS_LIST.map((country) => (
            <Pill
              key={country.id}
              active={pays === country.id}
              color="#10b981"
              onClick={() => {
                setPays(country.id);
                const zones = VACANCES_PAR_PAYS[country.id]?.zones || ["A"];
                setZone(zones[0]);
              }}
            >
              {country.flag} {country.label}
            </Pill>
          ))}
        </div>
      </div>

      {zonesDisponibles.length > 1 && (
        <div style={section}>
          <div style={S.inpLbl}>{pays === "france" ? t.schoolZone : t.regionZone}</div>
          <div style={S.row}>
            {zonesDisponibles.map((z) => (
              <Pill key={z} active={zone === z} color="#10b981" onClick={() => setZone(z)}>
                {pays === "france" ? `Zone ${z}` : z}
              </Pill>
            ))}
          </div>

          {zoneLabels[zone] && (
            <div style={{ fontSize: 11, color: T.sub, marginTop: 6 }}>
              📍 {zoneLabels[zone]}
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: 11, color: T.sub, marginBottom: 12 }}>
        📚 {t.schoolYear} {anneeSco}-{anneeSco + 1}
        {" · "}
        🐣 {t.easter} {year} :{" "}
        {getPaques(year).toLocaleDateString(
          currentLang === "en" ? "en-GB" : currentLang === "es" ? "es-ES" : "fr-FR",
          { day: "numeric", month: "long" }
        )}
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Tog
          on={vacAlt}
          onChange={() => setVacAlt((value) => !value)}
          label={t.alternatingVac}
          color="#8b5cf6"
          T={T}
        />

        <Tog
          on={showFeries}
          onChange={() => setShowFeries((value) => !value)}
          label={t.holidays}
          color="#d97706"
          T={T}
        />
      </div>
    </div>
  );
}
