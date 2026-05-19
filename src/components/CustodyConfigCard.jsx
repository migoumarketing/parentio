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
    (L.tabs?.[0] === "Calendar" ? "en" : L.tabs?.[0] === "Calendario" ? "es" : "fr");

  const currentLang = ["fr", "es", "en"].includes(inferredLang)
    ? inferredLang
    : "fr";

  const TR = {
    fr: {
      configTitle: "👤 Parents & mode de garde",
      antiAbuse:
        "Parentio est un outil d’organisation. Il ne doit pas servir à surveiller, harceler ou exercer une pression sur l’autre parent.",
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
      pickup: "Heure récupération",
      returnHour: "Heure dépôt",
      evenYear: "Année paire",
      oddYear: "Année impaire",
      currentYear: "Cette année",
      referenceAt: "référence chez",
      vacationMode: "Vacances scolaires",
      split: "1ère moitié / 2ème moitié",
      fullPrimary: "Tout chez parent principal",
      fullSecondary: "Tout chez autre parent",
      vacationSplit: "Répartition des vacances",
      firstPart: "1ère partie",
      secondPart: "2ème partie",
      customDays: "Jours personnalisés chez",
      otherDays: "Les autres jours",
      customInfo:
        "Le mode personnalisé utilise les jours exacts de la semaine. Le dimanche est bien reconnu comme dimanche dans le calendrier.",
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
      configTitle: "👤 Padres y custodia",
      antiAbuse:
        "Parentio es una herramienta de organización. No debe usarse para vigilar, acosar o presionar al otro progenitor.",
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
      fullPrimary: "Todo con el progenitor principal",
      fullSecondary: "Todo con el otro progenitor",
      vacationSplit: "Reparto de vacaciones",
      firstPart: "1ª parte",
      secondPart: "2ª parte",
      customDays: "Días personalizados con",
      otherDays: "Los otros días",
      customInfo:
        "El modo personalizado usa los días exactos de la semana. El domingo se reconoce correctamente en el calendario.",
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
      configTitle: "👤 Parents & custody",
      antiAbuse:
        "Parentio is an organisation tool. It must not be used to monitor, harass, or pressure the other parent.",
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
      fullPrimary: "All with primary parent",
      fullSecondary: "All with other parent",
      vacationSplit: "Holiday split",
      firstPart: "1st part",
      secondPart: "2nd part",
      customDays: "Custom days with",
      otherDays: "Other days",
      customInfo:
        "Custom mode uses the exact weekday values. Sunday is correctly recognised in the calendar.",
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

  const labels = TR[currentLang];

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

  const PillComponent = Pill;
  const TogComponent = Tog;

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
    marginBottom: 11
  };

  const section = {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    background: "rgba(128,128,128,0.07)",
    border: `1px solid ${T.border || "rgba(128,128,128,0.18)"}`
  };
    return (
    <div style={S.card}>
      <div style={S.sec}>{labels.configTitle}</div>

      <div
        style={{
          ...section,
          background: "rgba(217,119,6,0.08)",
          border: "1px solid rgba(217,119,6,0.22)",
          color: T.sub,
          fontSize: 12,
          lineHeight: 1.5,
          fontWeight: 700
        }}
      >
        ⚠️ {labels.antiAbuse}
      </div>

      <div style={grid2}>
        <div>
          <div style={S.inpLbl}>{labels.parentA}</div>
          <input
            style={{ ...S.inp, borderColor: `${colorA}55` }}
            value={pA}
            onChange={(event) => setPa(event.target.value)}
            placeholder="Parent A"
          />
        </div>

        <div>
          <div style={S.inpLbl}>{labels.parentB}</div>
          <input
            style={{ ...S.inp, borderColor: `${colorB}55` }}
            value={pB}
            onChange={(event) => setPb(event.target.value)}
            placeholder="Parent B"
          />
        </div>
      </div>

      <div style={grid2}>
        <div>
          <div style={S.inpLbl}>{labels.exchangeA}</div>
          <input
            type="time"
            style={S.inp}
            value={heureA}
            onChange={(event) => setHeureA(event.target.value)}
          />
        </div>

        <div>
          <div style={S.inpLbl}>{labels.exchangeB}</div>
          <input
            type="time"
            style={S.inp}
            value={heureB}
            onChange={(event) => setHeureB(event.target.value)}
          />
        </div>
      </div>

      <div style={{ ...S.row, marginBottom: 10 }}>
        <PillComponent
          active={mode === "alternee"}
          color="#8b5cf6"
          onClick={() => setMode("alternee")}
        >
          {labels.alternating}
        </PillComponent>

        <PillComponent
          active={mode === "classique"}
          color="#8b5cf6"
          onClick={() => setMode("classique")}
        >
          {labels.classic}
        </PillComponent>

        <PillComponent
          active={mode === "personnalise"}
          color="#8b5cf6"
          onClick={() => setMode("personnalise")}
        >
          {labels.custom}
        </PillComponent>
      </div>

      {mode === "alternee" && (
        <div style={section}>
          <div style={S.inpLbl}>{labels.evenWeek}</div>

          <div style={S.row}>
            <PillComponent
              active={paireA}
              color={colorA}
              onClick={() => setPaireA(true)}
            >
              {labels.evenWeek} → {pA}
            </PillComponent>

            <PillComponent
              active={!paireA}
              color={colorB}
              onClick={() => setPaireA(false)}
            >
              {labels.evenWeek} → {pB}
            </PillComponent>
          </div>
        </div>
      )}

      {mode === "classique" && (
        <div>
          <div style={section}>
            <div style={S.inpLbl}>{labels.primaryParent}</div>

            <div style={S.row}>
              <PillComponent
                active={classicPrimaryParent === "A"}
                color={colorA}
                onClick={() => setClassicPrimaryParent("A")}
              >
                {labels.primaryParent} → {pA || "Parent A"}
              </PillComponent>

              <PillComponent
                active={classicPrimaryParent === "B"}
                color={colorB}
                onClick={() => setClassicPrimaryParent("B")}
              >
                {labels.primaryParent} → {pB || "Parent B"}
              </PillComponent>
            </div>
          </div>

          <div style={section}>
            <div style={S.inpLbl}>
              🗓️ {labels.weekendAt} — {labels.evenWeek}
            </div>

            <div style={S.row}>
              <PillComponent
                active={semPaireA}
                color={colorA}
                onClick={() => setSemPaireA(true)}
              >
                {labels.evenWeek} → {pA || "Parent A"}
              </PillComponent>

              <PillComponent
                active={!semPaireA}
                color={colorB}
                onClick={() => setSemPaireA(false)}
              >
                {labels.evenWeek} → {pB || "Parent B"}
              </PillComponent>
            </div>

            <div style={{ fontSize: 11, color: T.sub, marginTop: 7 }}>
              {labels.currentWeek} : S{currentWeek} (
              {isCurrentWeekEven ? labels.evenWeek : labels.oddWeek}) →{" "}
              {labels.weekendAt}{" "}
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
                <div style={S.inpLbl}>⏱️ {labels.weekendStart}</div>

                <div style={S.row}>
                  <PillComponent
                    active={classicStartDay === "friday"}
                    color="#06b6d4"
                    onClick={() => setClassicStartDay("friday")}
                  >
                    {labels.friday}
                  </PillComponent>

                  <PillComponent
                    active={classicStartDay === "saturday"}
                    color="#06b6d4"
                    onClick={() => setClassicStartDay("saturday")}
                  >
                    {labels.saturday}
                  </PillComponent>
                </div>
              </div>

              <div>
                <div style={S.inpLbl}>⏱️ {labels.weekendEnd}</div>

                <div style={S.row}>
                  <PillComponent
                    active={classicEndDay === "sunday"}
                    color="#06b6d4"
                    onClick={() => setClassicEndDay("sunday")}
                  >
                    {labels.sunday}
                  </PillComponent>

                  <PillComponent
                    active={classicEndDay === "monday"}
                    color="#06b6d4"
                    onClick={() => setClassicEndDay("monday")}
                  >
                    {labels.monday}
                  </PillComponent>
                </div>
              </div>
            </div>

            <div style={grid2}>
              <div>
                <div style={S.inpLbl}>🕐 {labels.pickup}</div>

                <input
                  type="time"
                  style={S.inp}
                  value={classicPickupHour}
                  onChange={(event) => setClassicPickupHour(event.target.value)}
                />
              </div>

              <div>
                <div style={S.inpLbl}>🕐 {labels.returnHour}</div>

                <input
                  type="time"
                  style={S.inp}
                  value={classicReturnHour}
                  onChange={(event) => setClassicReturnHour(event.target.value)}
                />
              </div>
            </div>
          </div>
                    <div style={section}>
            <div style={S.inpLbl}>📆 {labels.evenYear}</div>

            <div style={S.row}>
              <PillComponent
                active={annePaireA}
                color={colorA}
                onClick={() => setAnnePaireA(true)}
              >
                {labels.evenYear} → {pA}
              </PillComponent>

              <PillComponent
                active={!annePaireA}
                color={colorB}
                onClick={() => setAnnePaireA(false)}
              >
                {labels.evenYear} → {pB}
              </PillComponent>
            </div>

            <div style={{ fontSize: 11, color: T.sub, marginTop: 7 }}>
              {labels.currentYear} {new Date().getFullYear()} ={" "}
              {isCurrentYearEven ? labels.evenWeek : labels.oddWeek} →{" "}
              {labels.referenceAt}{" "}
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
            <div style={S.inpLbl}>🌴 {labels.vacationMode}</div>

            <div style={S.row}>
              <PillComponent
                active={classicVacationMode === "split"}
                color="#d97706"
                onClick={() => setClassicVacationMode("split")}
              >
                {labels.split}
              </PillComponent>

              <PillComponent
                active={classicVacationMode === "allPrincipal"}
                color="#d97706"
                onClick={() => setClassicVacationMode("allPrincipal")}
              >
                {labels.fullPrimary}
              </PillComponent>

              <PillComponent
                active={classicVacationMode === "allSecondary"}
                color="#d97706"
                onClick={() => setClassicVacationMode("allSecondary")}
              >
                {labels.fullSecondary}
              </PillComponent>
            </div>

            {classicVacationMode === "split" && (
              <div style={{ marginTop: 12 }}>
                <div style={S.inpLbl}>🌴 {labels.vacationSplit}</div>

                <div style={S.row}>
                  <PillComponent
                    active={classicVacationPart === "first"}
                    color={colorA}
                    onClick={() => setClassicVacationPart("first")}
                  >
                    {labels.firstPart} → {secondaryParent}
                  </PillComponent>

                  <PillComponent
                    active={classicVacationPart === "second"}
                    color={colorB}
                    onClick={() => setClassicVacationPart("second")}
                  >
                    {labels.secondPart} → {secondaryParent}
                  </PillComponent>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: "rgba(128,128,128,0.08)",
              borderRadius: 12,
              padding: "12px 14px",
              marginTop: 12,
              lineHeight: 1.7,
              fontSize: 12,
              color: T.sub
            }}
          >
            📋 <strong style={{ color: T.text }}>{labels.summary}</strong>

            <br />

            • {labels.primaryParent} →{" "}
            <strong style={{ color: colorA }}>
              {principalParent}
            </strong>

            <br />

            • {labels.evenWeek} →{" "}
            <strong
              style={{
                color: semPaireA ? colorA : colorB
              }}
            >
              {weekendEvenParent}
            </strong>

            <br />

            • {labels.oddWeek} →{" "}
            <strong
              style={{
                color: semPaireA ? colorB : colorA
              }}
            >
              {weekendOddParent}
            </strong>

            <br />

            • {labels.weekendStart} →{" "}
            <strong style={{ color: T.text }}>
              {classicStartDay === "friday"
                ? labels.friday
                : labels.saturday}
            </strong>

            <br />

            • {labels.weekendEnd} →{" "}
            <strong style={{ color: T.text }}>
              {classicEndDay === "sunday"
                ? labels.sunday
                : labels.monday}
            </strong>

            <br />

            • 🌴 {labels.firstPart} →{" "}
            <strong style={{ color: colorA }}>
              {vacationFirstParent}
            </strong>

            <br />

            • 🌴 {labels.secondPart} →{" "}
            <strong style={{ color: colorB }}>
              {vacationSecondParent}
            </strong>
          </div>
        </div>
      )}

      {mode === "personnalise" && (
        <div style={section}>
          <div style={S.inpLbl}>
            ⚙️ {labels.customDays} {pA}
          </div>

          <div style={S.row}>
            {labels.days.map((dayLabel, index) => {
              const value = index === 6 ? 0 : index + 1;

              return (
                <PillComponent
                  key={index}
                  active={joursA.includes(value)}
                  color={colorA}
                  onClick={() =>
                    setJoursA((previous) =>
                      previous.includes(value)
                        ? previous.filter((item) => item !== value)
                        : [...previous, value].sort()
                    )
                  }
                >
                  {dayLabel}
                </PillComponent>
              );
            })}
          </div>

          <div
            style={{
              fontSize: 11,
              color: T.sub,
              marginTop: 8,
              lineHeight: 1.5
            }}
          >
            {labels.otherDays} → {pB}
            <br />
            {labels.customInfo}
          </div>
        </div>
      )}

      <div style={section}>
        <div style={S.inpLbl}>🌍 {labels.country}</div>

        <div style={{ ...S.row, gap: 6 }}>
          {PAYS_LIST.map((country) => (
            <PillComponent
              key={country.id}
              active={pays === country.id}
              color="#10b981"
              onClick={() => {
                setPays(country.id);

                const zones =
                  VACANCES_PAR_PAYS[country.id]?.zones || ["A"];

                setZone(zones[0]);
              }}
            >
              {country.flag} {country.label}
            </PillComponent>
          ))}
        </div>
      </div>

      {zonesDisponibles.length > 1 && (
        <div style={section}>
          <div style={S.inpLbl}>
            {pays === "france"
              ? labels.schoolZone
              : labels.regionZone}
          </div>

          <div style={S.row}>
            {zonesDisponibles.map((zoneItem) => (
              <PillComponent
                key={zoneItem}
                active={zone === zoneItem}
                color="#10b981"
                onClick={() => setZone(zoneItem)}
              >
                {pays === "france"
                  ? `Zone ${zoneItem}`
                  : zoneItem}
              </PillComponent>
            ))}
          </div>

          {zoneLabels[zone] && (
            <div
              style={{
                fontSize: 11,
                color: T.sub,
                marginTop: 6
              }}
            >
              📍 {zoneLabels[zone]}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          color: T.sub,
          marginBottom: 12
        }}
      >
        📚 {labels.schoolYear} {anneeSco}-{anneeSco + 1}
        {" · "}
        🐣 {labels.easter} {year} :{" "}
        {getPaques(year).toLocaleDateString(currentLang, {
          day: "numeric",
          month: "long"
        })}
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <TogComponent
          on={vacAlt}
          onChange={() => setVacAlt((value) => !value)}
          label={labels.alternatingVac}
          color="#8b5cf6"
          T={T}
        />

        <TogComponent
          on={showFeries}
          onChange={() => setShowFeries((value) => !value)}
          label={labels.holidays}
          color="#d97706"
          T={T}
        />
      </div>
    </div>
  );
}
