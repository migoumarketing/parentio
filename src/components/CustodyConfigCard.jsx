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

  const Label = {
    title: L.configTitle || "👤 Parents & mode de garde",
    parentA: L.parentA || "Prénom A",
    parentB: L.parentB || "Prénom B",
    exchangeA: L.exchangeA || `Heure échange → ${pA}`,
    exchangeB: L.exchangeB || `Heure échange → ${pB}`,
    classicMain: L.classicMain || "Parent principal",
    weekendStart: L.weekendStart || "Début du week-end",
    weekendEnd: L.weekendEnd || "Fin du week-end",
    friday: L.friday || "Vendredi",
    saturday: L.saturday || "Samedi",
    sunday: L.sunday || "Dimanche",
    monday: L.monday || "Lundi matin",
    vacationMode: L.vacationMode || "Vacances scolaires",
    split: L.split || "1ère moitié / 2ème moitié",
    fullPrimary: L.fullPrimary || "Tout chez parent principal",
    fullSecondary: L.fullSecondary || "Tout chez autre parent",
    firstPart: L.firstPart || "1ère partie",
    secondPart: L.secondPart || "2ème partie",
    pickup: L.pickup || "Heure de récupération",
    returnHour: L.returnHour || "Heure de dépôt",
    holidays: L.holidays || "Fériés & fêtes",
    alternatingVac: L.alternatingVac || "Vacances alternées"
  };

  return (
    <div style={S.card}>
      <div style={S.sec}>{Label.title}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 11 }}>
        <div>
          <div style={S.inpLbl}>{Label.parentA}</div>
          <input
            style={{ ...S.inp, borderColor: `${colorA}55` }}
            value={pA}
            onChange={(e) => setPa(e.target.value)}
            placeholder="Maman"
          />
        </div>

        <div>
          <div style={S.inpLbl}>{Label.parentB}</div>
          <input
            style={{ ...S.inp, borderColor: `${colorB}55` }}
            value={pB}
            onChange={(e) => setPb(e.target.value)}
            placeholder="Papa"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 11 }}>
        <div>
          <div style={S.inpLbl}>{Label.exchangeA}</div>
          <input
            type="time"
            style={S.inp}
            value={heureA}
            onChange={(e) => setHeureA(e.target.value)}
          />
        </div>

        <div>
          <div style={S.inpLbl}>{Label.exchangeB}</div>
          <input
            type="time"
            style={S.inp}
            value={heureB}
            onChange={(e) => setHeureB(e.target.value)}
          />
        </div>
      </div>

      <div style={{ ...S.row, marginBottom: 10 }}>
        <Pill active={mode === "alternee"} color="#8b5cf6" onClick={() => setMode("alternee")}>
          {L.alternee || "🔄 Alternée"}
        </Pill>

        <Pill active={mode === "classique"} color="#8b5cf6" onClick={() => setMode("classique")}>
          {L.classique || "🏠 Classique"}
        </Pill>

        <Pill active={mode === "personnalise"} color="#8b5cf6" onClick={() => setMode("personnalise")}>
          {L.perso || "✏️ Personnalisé"}
        </Pill>
      </div>

      {mode === "alternee" && (
        <div style={{ ...S.row, marginBottom: 10 }}>
          <Pill active={paireA} color={colorA} onClick={() => setPaireA(true)}>
            Semaine paire → {pA}
          </Pill>

          <Pill active={!paireA} color={colorB} onClick={() => setPaireA(false)}>
            Semaine paire → {pB}
          </Pill>
        </div>
      )}

      {mode === "classique" && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={S.inpLbl}>{Label.classicMain}</div>
            <div style={S.row}>
              <Pill active={classicPrimaryParent === "A"} color={colorA} onClick={() => setClassicPrimaryParent("A")}>
                Principal → {pA || "Parent A"}
              </Pill>

              <Pill active={classicPrimaryParent === "B"} color={colorB} onClick={() => setClassicPrimaryParent("B")}>
                Principal → {pB || "Parent B"}
              </Pill>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={S.inpLbl}>🗓️ Week-end — semaines paires</div>

            <div style={S.row}>
              <Pill active={semPaireA} color={colorA} onClick={() => setSemPaireA(true)}>
                Semaine paire → {pA || "Parent A"}
              </Pill>

              <Pill active={!semPaireA} color={colorB} onClick={() => setSemPaireA(false)}>
                Semaine paire → {pB || "Parent B"}
              </Pill>
            </div>

            <div style={{ fontSize: 11, color: T.sub, marginTop: 5 }}>
              Semaine actuelle : S{currentWeek} ({isCurrentWeekEven ? "paire" : "impaire"}) → week-end chez{" "}
              <strong style={{ color: isCurrentWeekEven ? (semPaireA ? colorA : colorB) : (semPaireA ? colorB : colorA) }}>
                {isCurrentWeekEven ? weekendEvenParent : weekendOddParent}
              </strong>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={S.inpLbl}>⏱️ {Label.weekendStart}</div>
            <div style={S.row}>
              <Pill active={classicStartDay === "friday"} color="#06b6d4" onClick={() => setClassicStartDay("friday")}>
                {Label.friday}
              </Pill>

              <Pill active={classicStartDay === "saturday"} color="#06b6d4" onClick={() => setClassicStartDay("saturday")}>
                {Label.saturday}
              </Pill>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={S.inpLbl}>⏱️ {Label.weekendEnd}</div>
            <div style={S.row}>
              <Pill active={classicEndDay === "sunday"} color="#06b6d4" onClick={() => setClassicEndDay("sunday")}>
                {Label.sunday}
              </Pill>

              <Pill active={classicEndDay === "monday"} color="#06b6d4" onClick={() => setClassicEndDay("monday")}>
                {Label.monday}
              </Pill>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={S.inpLbl}>🕐 {Label.pickup}</div>
              <input
                type="time"
                style={S.inp}
                value={classicPickupHour}
                onChange={(e) => setClassicPickupHour(e.target.value)}
              />
            </div>

            <div>
              <div style={S.inpLbl}>🕐 {Label.returnHour}</div>
              <input
                type="time"
                style={S.inp}
                value={classicReturnHour}
                onChange={(e) => setClassicReturnHour(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={S.inpLbl}>📆 Années paires</div>

            <div style={S.row}>
              <Pill active={annePaireA} color={colorA} onClick={() => setAnnePaireA(true)}>
                Année paire → {pA || "Parent A"}
              </Pill>

              <Pill active={!annePaireA} color={colorB} onClick={() => setAnnePaireA(false)}>
                Année paire → {pB || "Parent B"}
              </Pill>
            </div>

            <div style={{ fontSize: 11, color: T.sub, marginTop: 5 }}>
              Cette année {new Date().getFullYear()} = {isCurrentYearEven ? "paire" : "impaire"} → référence chez{" "}
              <strong style={{ color: isCurrentYearEven ? (annePaireA ? colorA : colorB) : (annePaireA ? colorB : colorA) }}>
                {isCurrentYearEven ? yearEvenParent : yearOddParent}
              </strong>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={S.inpLbl}>🌴 {Label.vacationMode}</div>

            <div style={S.row}>
              <Pill active={classicVacationMode === "split"} color="#d97706" onClick={() => setClassicVacationMode("split")}>
                {Label.split}
              </Pill>

              <Pill active={classicVacationMode === "allPrincipal"} color="#d97706" onClick={() => setClassicVacationMode("allPrincipal")}>
                {Label.fullPrimary}
              </Pill>

              <Pill active={classicVacationMode === "allSecondary"} color="#d97706" onClick={() => setClassicVacationMode("allSecondary")}>
                {Label.fullSecondary}
              </Pill>
            </div>
          </div>

          {classicVacationMode === "split" && (
            <div style={{ marginBottom: 12 }}>
              <div style={S.inpLbl}>🌴 Répartition des vacances</div>

              <div style={S.row}>
                <Pill active={classicVacationPart === "first"} color={colorB} onClick={() => setClassicVacationPart("first")}>
                  {Label.firstPart} → {secondaryParent}
                </Pill>

                <Pill active={classicVacationPart === "second"} color={colorB} onClick={() => setClassicVacationPart("second")}>
                  {Label.secondPart} → {secondaryParent}
                </Pill>
              </div>
            </div>
          )}

          <div
            style={{
              background: "rgba(128,128,128,0.08)",
              borderRadius: 9,
              padding: "9px 11px",
              fontSize: 12,
              color: T.sub,
              lineHeight: 1.6
            }}
          >
            📋 <strong style={{ color: T.text }}>Résumé classique :</strong><br />
            • Parent principal → <strong style={{ color: classicPrimaryParent === "A" ? colorA : colorB }}>{principalParent}</strong><br />
            • Autre parent → <strong style={{ color: classicPrimaryParent === "A" ? colorB : colorA }}>{secondaryParent}</strong><br />
            • Week-end semaines paires → <strong style={{ color: semPaireA ? colorA : colorB }}>{weekendEvenParent}</strong><br />
            • Week-end semaines impaires → <strong style={{ color: semPaireA ? colorB : colorA }}>{weekendOddParent}</strong><br />
            • Week-end → <strong style={{ color: T.text }}>{classicStartDay === "friday" ? Label.friday : Label.saturday} → {classicEndDay === "monday" ? Label.monday : Label.sunday}</strong><br />
            • Récupération → <strong style={{ color: T.text }}>{classicPickupHour}</strong><br />
            • Dépôt → <strong style={{ color: T.text }}>{classicReturnHour}</strong><br />
            • Années paires → <strong style={{ color: annePaireA ? colorA : colorB }}>{yearEvenParent}</strong><br />
            • Années impaires → <strong style={{ color: annePaireA ? colorB : colorA }}>{yearOddParent}</strong><br />
            {classicVacationMode === "split" && (
              <>
                • Vacances 1ère partie → <strong style={{ color: colorB }}>{vacationFirstParent}</strong><br />
                • Vacances 2ème partie → <strong style={{ color: colorA }}>{vacationSecondParent}</strong>
              </>
            )}
          </div>
        </div>
      )}

      {mode === "personnalise" && (
        <div style={{ marginBottom: 10 }}>
          <div style={S.inpLbl}>⚙️ Personnaliser les jours chez {pA}</div>

          <div style={S.row}>
            {(L.joursSemaine || ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]).map((j, i) => (
              <Pill
                key={i}
                active={joursA.includes(i + 1)}
                color={colorA}
                onClick={() =>
                  setJoursA((prev) =>
                    prev.includes(i + 1)
                      ? prev.filter((x) => x !== i + 1)
                      : [...prev, i + 1].sort()
                  )
                }
              >
                {j}
              </Pill>
            ))}
          </div>

          <div style={{ fontSize: 11, color: T.sub, marginTop: 5 }}>
            Les autres jours → {pB}.
          </div>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <div style={S.inpLbl}>🌍 Pays</div>

        <div style={{ ...S.row, gap: 6 }}>
          {PAYS_LIST.map((p) => (
            <Pill
              key={p.id}
              active={pays === p.id}
              color="#10b981"
              onClick={() => {
                setPays(p.id);
                const zones = VACANCES_PAR_PAYS[p.id]?.zones || ["A"];
                setZone(zones[0]);
              }}
            >
              {p.flag} {p.label}
            </Pill>
          ))}
        </div>
      </div>

      {zonesDisponibles.length > 1 && (
        <div style={{ marginBottom: 10 }}>
          <div style={S.inpLbl}>{pays === "france" ? "Zone scolaire" : "Région / Zone"}</div>

          <div style={S.row}>
            {zonesDisponibles.map((z) => (
              <Pill key={z} active={zone === z} color="#10b981" onClick={() => setZone(z)}>
                {pays === "france" ? `Zone ${z}` : z}
              </Pill>
            ))}
          </div>

          {zoneLabels[zone] && (
            <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>
              📍 {zoneLabels[zone]}
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: 11, color: T.sub, marginBottom: 9 }}>
        📚 {anneeSco}-{anneeSco + 1} · 🐣 Pâques {year} :{" "}
        {getPaques(year).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long"
        })}
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Tog
          on={vacAlt}
          onChange={() => setVacAlt((value) => !value)}
          label={Label.alternatingVac}
          color="#8b5cf6"
          T={T}
        />

        <Tog
          on={showFeries}
          onChange={() => setShowFeries((value) => !value)}
          label={Label.holidays}
          color="#d97706"
          T={T}
        />
      </div>
    </div>
  );
}
