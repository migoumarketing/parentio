export default function CustodyConfigCard({
  S = {},
  L = {},
  T = {},

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

  const labels = {
    configTitle: L.configTitle || "👤 Parents & mode de garde",
    parentA: L.parentA || "Prénom A",
    parentB: L.parentB || "Prénom B",
    exchangeA: L.exchangeA || "Heure échange → Parent A",
    exchangeB: L.exchangeB || "Heure échange → Parent B",

    alternatingMode: L.alternee || "🔄 Alternée",
    classicMode: L.classique || "🏠 Classique",
    customMode: L.perso || "✏️ Personnalisé",

    evenWeek: L.evenWeek || "Semaine paire",
    oddWeek: L.oddWeek || "Semaine impaire",
    currentWeek: L.currentWeek || "Semaine actuelle",
    weekendAt: L.weekendAt || "week-end chez",

    primaryParent: L.classicMain || "Parent principal",
    secondaryParent: L.secondaryParent || "Autre parent",

    weekendStart: L.weekendStart || "Début du week-end",
    weekendEnd: L.weekendEnd || "Fin du week-end",
    friday: L.friday || "Vendredi",
    saturday: L.saturday || "Samedi",
    sunday: L.sunday || "Dimanche",
    monday: L.monday || "Lundi matin",

    pickup: L.pickup || "Heure récupération",
    returnHour: L.returnHour || "Heure dépôt",

    evenYear: L.evenYear || "Année paire",
    oddYear: L.oddYear || "Année impaire",
    currentYear: L.currentYear || "Cette année",
    referenceAt: L.referenceAt || "référence chez",

    vacationMode: L.vacationMode || "Vacances scolaires",
    split: L.split || "1ère moitié / 2ème moitié",
    fullPrimary: L.fullPrimary || "Tout chez parent principal",
    fullSecondary: L.fullSecondary || "Tout chez autre parent",
    vacationSplit: L.vacationSplit || "Répartition des vacances",
    firstPart: L.firstPart || "1ère partie",
    secondPart: L.secondPart || "2ème partie",

    customDays: L.customDays || `Personnaliser les jours chez ${pA}`,
    otherDays: L.otherDays || `Les autres jours → ${pB}`,

    country: L.country || "Pays",
    schoolZone: L.schoolZone || "Zone scolaire",
    regionZone: L.regionZone || "Région / Zone",
    schoolYear: L.schoolYear || "Année scolaire",
    easter: L.easter || "Pâques",

    alternatingVac: L.alternatingVac || "Vacances alternées",
    holidays: L.holidays || "Fériés & fêtes",

    classicSummary: L.classicSummary || "Résumé classique",
    antiAbuse:
      L.antiAbuse ||
      "Parentio est un outil d’organisation. Il ne doit pas servir à surveiller, harceler ou exercer une pression sur l’autre parent."
  };

  const dayLabels = L.joursSemaine || ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

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
            onChange={(e) => setPa(e.target.value)}
            placeholder="Parent A"
          />
        </div>

        <div>
          <div style={S.inpLbl}>{labels.parentB}</div>
          <input
            style={{ ...S.inp, borderColor: `${colorB}55` }}
            value={pB}
            onChange={(e) => setPb(e.target.value)}
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
            onChange={(e) => setHeureA(e.target.value)}
          />
        </div>

        <div>
          <div style={S.inpLbl}>{labels.exchangeB}</div>
          <input
            type="time"
            style={S.inp}
            value={heureB}
            onChange={(e) => setHeureB(e.target.value)}
          />
        </div>
      </div>

      <div style={{ ...S.row, marginBottom: 10 }}>
        <PillComponent
          active={mode === "alternee"}
          color="#8b5cf6"
          onClick={() => setMode("alternee")}
        >
          {labels.alternatingMode}
        </PillComponent>

        <PillComponent
          active={mode === "classique"}
          color="#8b5cf6"
          onClick={() => setMode("classique")}
        >
          {labels.classicMode}
        </PillComponent>

        <PillComponent
          active={mode === "personnalise"}
          color="#8b5cf6"
          onClick={() => setMode("personnalise")}
        >
          {labels.customMode}
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
                  onChange={(e) => setClassicPickupHour(e.target.value)}
                />
              </div>

              <div>
                <div style={S.inpLbl}>🕐 {labels.returnHour}</div>

                <input
                  type="time"
                  style={S.inp}
                  value={classicReturnHour}
                  onChange={(e) => setClassicReturnHour(e.target.value)}
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
                {labels.evenYear} → {pA || "Parent A"}
              </PillComponent>

              <PillComponent
                active={!annePaireA}
                color={colorB}
                onClick={() => setAnnePaireA(false)}
              >
                {labels.evenYear} → {pB || "Parent B"}
              </PillComponent>
            </div>

            <div style={{ fontSize: 11, color: T.sub, marginTop: 7 }}>
              {labels.currentYear} {new Date().getFullYear()} ={" "}
              {isCurrentYearEven ? labels.evenYear : labels.oddYear} →{" "}
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
              <div style={{ marginTop: 10 }}>
                <div style={S.inpLbl}>🌴 {labels.vacationSplit}</div>

                <div style={S.row}>
                  <PillComponent
                    active={classicVacationPart === "first"}
                    color={colorB}
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
              padding: "11px 13px",
              fontSize: 12,
              color: T.sub,
              lineHeight: 1.7,
              marginBottom: 12,
              border: `1px solid ${T.border || "rgba(128,128,128,0.16)"}`
            }}
          >
            📋 <strong style={{ color: T.text }}>{labels.classicSummary}</strong><br />

            • {labels.primaryParent} →{" "}
            <strong style={{ color: classicPrimaryParent === "A" ? colorA : colorB }}>
              {principalParent}
            </strong><br />

            • {labels.secondaryParent} →{" "}
            <strong style={{ color: classicPrimaryParent === "A" ? colorB : colorA }}>
              {secondaryParent}
            </strong><br />

            • {labels.evenWeek} →{" "}
            <strong style={{ color: semPaireA ? colorA : colorB }}>
              {weekendEvenParent}
            </strong><br />

            • {labels.oddWeek} →{" "}
            <strong style={{ color: semPaireA ? colorB : colorA }}>
              {weekendOddParent}
            </strong><br />

            • {labels.weekendStart} / {labels.weekendEnd} →{" "}
            <strong style={{ color: T.text }}>
              {classicStartDay === "friday" ? labels.friday : labels.saturday} →{" "}
              {classicEndDay === "monday" ? labels.monday : labels.sunday}
            </strong><br />

            • {labels.pickup} →{" "}
            <strong style={{ color: T.text }}>{classicPickupHour}</strong><br />

            • {labels.returnHour} →{" "}
            <strong style={{ color: T.text }}>{classicReturnHour}</strong><br />

            • {labels.evenYear} →{" "}
            <strong style={{ color: annePaireA ? colorA : colorB }}>
              {yearEvenParent}
            </strong><br />

            • {labels.oddYear} →{" "}
            <strong style={{ color: annePaireA ? colorB : colorA }}>
              {yearOddParent}
            </strong><br />

            {classicVacationMode === "split" && (
              <>
                • {labels.firstPart} →{" "}
                <strong style={{ color: colorB }}>{vacationFirstParent}</strong><br />

                • {labels.secondPart} →{" "}
                <strong style={{ color: colorA }}>{vacationSecondParent}</strong>
              </>
            )}
          </div>
        </div>
      )}
            {mode === "personnalise" && (
        <div style={section}>
          <div style={S.inpLbl}>
            ⚙️ {labels.customDays} {pA}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 7,
              marginTop: 10
            }}
          >
            {labels.days.map((dayLabel, index) => {
              const realDay = index;

              return (
                <div key={realDay} style={{ minWidth: 0 }}>
                  <PillComponent
                    active={joursA.includes(realDay)}
                    color={colorA}
                    onClick={() =>
                      setJoursA((prev) =>
                        prev.includes(realDay)
                          ? prev.filter((d) => d !== realDay)
                          : [...prev, realDay].sort((a, b) => a - b)
                      )
                    }
                  >
                    {dayLabel}
                  </PillComponent>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>
            {labels.otherDays} → {pB}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 11,
              borderRadius: 10,
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              fontSize: 12,
              color: T.sub,
              lineHeight: 1.6
            }}
          >
            💡 {labels.customModeInfo}
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
              : labels.region}
          </div>

          <div style={S.row}>
            {zonesDisponibles.map((z) => (
              <PillComponent
                key={z}
                active={zone === z}
                color="#10b981"
                onClick={() => setZone(z)}
              >
                {pays === "france" ? `Zone ${z}` : z}
              </PillComponent>
            ))}
          </div>

          {zoneLabels?.[zone] && (
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
          marginBottom: 11,
          lineHeight: 1.6
        }}
      >
        📚 {anneeSco}-{anneeSco + 1}
        {" · "}
        🐣 Pâques {year} :{" "}
        {getPaques(year).toLocaleDateString(
          lang === "en"
            ? "en-GB"
            : lang === "es"
            ? "es-ES"
            : "fr-FR",
          {
            day: "numeric",
            month: "long"
          }
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap"
        }}
      >
        <TogComponent
          on={vacAlt}
          onChange={() => setVacAlt((v) => !v)}
          label={labels.alternateVacations}
          color="#8b5cf6"
          T={T}
        />

        <TogComponent
          on={showFeries}
          onChange={() => setShowFeries((v) => !v)}
          label={labels.showPublicHolidays}
          color="#d97706"
          T={T}
        />
      </div>
    </div>
  );
}
