# Login-Formular: Anmelden als Hauptaktion, Alternativen unter „oder“ (#30296) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Anmeldeformular liest sich von oben nach unten wie ein üblicher Login: Felder, „Passwort vergessen?“, **Anmelden** voll breit als Hauptknopf, darunter „oder“ und die Alternativen (SSO-Anbieter, Passkey) voll breit als Nebenknöpfe; ohne Alternative kein „oder“.

**Architecture:** Nur View-Konfiguration und eine kleine Paket-Komponente. „Anmelden“ zieht aus der Knopfleiste (`<commands>` mit `placement="BUTTON_BAR"`) als `<button appearance="primary">` in die Formularspalte und bindet Enter ausdrücklich (`key="Enter"` am Befehl). Die Alternativen stehen in einem `<stack id="login-alternatives" css-class="tl-login-alternatives">` mit einem `<text>` „oder“ und `<login-methods>`; das Passkey-Overlay hängt sich dort hinein. Die Paketregel blendet die Gruppe aus, wenn sie keinen Knopf enthält (Muster `tl-button-bar:not(:has(button))`).

**Tech Stack:** `.view.xml` (layout.view, tl-security-passkey), Paket `tl-design-system`, Demo `com.top_logic.demo.react`.

**Spec / Entscheidungen (Hendrik, 12.11., im Chat):** Reihenfolge Logo → Felder → „Passwort vergessen?“ → Anmelden (voll breit, primär) → „oder“ → Passkey/SSO (voll breit, sekundär). SSO-Bedeutung ist kundenabhängig, intern ungenutzt → Nebenposition. Login-Seite und Login-Dialog gleich. „oder“ als leiser, zentrierter Text ohne Linien (Trenner mit Text wäre ein neuer Baustein, später separat). Gilt nur für schmale Ein-Aufgaben-Karten; keine globale Knopfregel (in !2274 zurückgenommen).

**Worktree / Branch:** `_Working-Tree/tl8-wt-30296`, `CWS/CWS_30296_login_form_actions`, Basis `CWS/CWS_30281_ui_pass_small_fixes` (!2274). Commits `Ticket #30296: …`, englisch. **Kein Push.**

## Global Constraints

- Paket: nur Tokens, Präfix `tl`, Zustände als Attribute; Gates `cd tl-design-system && node tools/generate.mjs && node tools/lint-css.mjs && npm test && npm run test:dom`.
- Views mit `XMLPrettyPrinter` normalisieren: `mvn -B -q exec:java@normalize-layouts -pl <modul>` (aus der Worktree-Wurzel, JDK 21); danach stabil.
- Maven nur `clean install`, JDK 21 (`JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.13.0.2/libexec/openjdk.jdk/Contents/Home`), aus `tl-parent-engine` mit `-pl ../<modul>`.
- Keine neue Java-API, kein neues View-Element. Ändert sich doch JavaDoc: `messages_en` nur über `tools/check-messages-en.sh`.
- Texte der Views zweisprachig (`<en>`, `<de>`).

## Review Focus

1. Enter im Formular meldet an — auf der Login-Seite **und** im Login-Dialog, wo „Abbrechen“ in der Knopfleiste bleibt und sonst als einziger Knopf Enter erben könnte → Prüfung in Task 2 (Test, falls ein Harness es erlaubt; sonst Sichtprüfung Task 3 mit Tastatur).
2. Ohne SSO und ohne Passkey-Modul kein „oder“ → Paket-Test Task 1, Sichtprüfung Task 3 (z. B. Passkey per Verfügbarkeit verborgen oder Overlay testweise aus).
3. Passkey-Overlay findet seinen Platz nach dem Umzug von `login-methods` (fehlt die Referenz, scheitert das Laden der View laut) → Task 2, `TestLoadViews`/Demo-Start.
4. Fehlermeldung bei falschem Passwort erscheint wie heute (Befehlskette `store-form-state` → `login` unverändert) → Sichtprüfung Task 3.
5. Tab-Reihenfolge: Benutzername → Passwort → Passwort vergessen? → Anmelden → Alternativen → Sichtprüfung Task 3.

## Nachträge aus dem Plan-Review (Fable, 12.11.) — verbindlich, gehen den Tasks vor

Probelauf: Paket mit Task 1 grün (692/8), Plan-View lädt (`TestLoadViews` 63/63 + Probe), `key="Enter"` am `<button>` wird gebunden, „Abbrechen“ im Dialog erbt Enter nicht (Default gilt nur für `BUTTON_BAR`-Befehle).

- **N1 Normalisieren:** `normalize-layouts` greift für `views/` nicht. Je geänderte View: `mvn -B exec:java -pl com.top_logic.basic -Dexec.mainClass=com.top_logic.basic.xml.XMLPrettyPrinter -Dexec.args="<absoluter Pfad>"` (aus der Worktree-Wurzel, JDK 21), dann `git diff` prüfen.
- **N2 Overlay-Vertrag und Doku (Task 2):** Nach dem Umzug scheitert ein Overlay mit `config:reference="login-methods"` direkt im Formular laut. Mitziehen: `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/overlays.md` (~Z. 156), `com.top_logic/…/tl-docs/…/authentication/index.md` (~185–187), `tl-security-passkey/…/tl-docs/…/authentication/passkeys.md` (~186–188), Kopfkommentar `login-form.view.xml` (~12–15). Ticket #30296 bekommt `== Migration ==` + `RequiresMigration` (Orchestrator).
- **N3 `<form-valid/>`:** am umgezogenen Befehl `<executability><form-valid/></executability>` vor `<store-form-state>` (Vorbild `com.top_logic.demo.react/.../wizard-demo.view.xml` ~150–162; `forms.md` ~518–534).
- **N4 „oder“:** `<text css-class="tl-login-alternatives__or" tone="secondary">`; die Paketregel `.tl-login-alternatives__or` setzt nur `text-align: center` (Farbe kommt aus `tone`), Test und Vertrag ohne Farb-Token.
- **N5 Testvorlage:** `git show CWS/CWS_30294_login_backdrop:tl-design-system/test/login-backdrop.test.mjs`. Index-Link und MODIFIERS-Eintrag **nicht** direkt an die Stellen, die #30294 nutzt (Index nach der Slider-Zeile, MODIFIERS hinter `'tl-skeleton'`), damit der spätere Merge konfliktfrei bleibt.
- **N6 Randfälle „oder“ (Entscheidung Orchestrator: hinnehmen, im Vertrag nennen):** ohne WebAuthn im Browser zeigt der Passkey einen deaktivierten Knopf → „oder“ bleibt (die Alternative gibt es, nur nicht hier); SSO-Fehlermeldung ohne verfügbare Methode trägt einen Schließknopf → „oder“ über dem Alert. Sichtprüfung „ohne Alternative“ über Passkey-Usage ≠ `login`.
- **N7 Doku-Repo (Task 3):** zusätzlich `docs/skalen.md` (Hauptknopf voll breit nur in schmalen Ein-Aufgaben-Karten; „oder“-Gruppe; keine globale Knopfregel).
- **N8 Tests Passkey:** im Modul `tl-security-passkey` läuft `TestPasskeyViewScripts` (faltet das Overlay), nicht `TestLoadViews`; Reihenfolge im selben Maven-Aufruf (`layout.view` vor `tl-security-passkey`) stimmt.

---

### Task 1: Paket — `tl-login-alternatives`

**Files:**
- Create: `tl-design-system/src/components/login-form/login-form.css`, `login-form.contract.md`, `login-form.spec.html`
- Test: `tl-design-system/test/login-form.test.mjs`; Link in `specimen/index.html`; `'tl-login-alternatives': new Set([])` in `MODIFIERS` (`tools/lint-css.mjs`)

**Interfaces:** Klassen `tl-login-alternatives` (die Gruppe, ein Stack), `tl-login-alternatives__or` (der Text „oder“).

- [ ] **Step 1: Failing test** (Muster `test/login-backdrop.test.mjs`): `.tl-login-alternatives:not(:has(button))` → `display: none`; `.tl-login-alternatives__or` → `color: var(--tl-text-secondary)`, `text-align: center`; `[hidden]`-Regel nur, falls eine `display`-Regel entsteht (hidden.test); Vertrag nennt Klassen und Tokens (`missingInContract`), Specimen ohne Probleme (`specimenProblems`), Link im Index, MODIFIERS-Eintrag.
- [ ] **Step 2:** `npm test` scheitert.
- [ ] **Step 3:** CSS, Vertrag (Zweck: die Alternativen eines Anmeldeformulars; blendet sich ohne Knopf aus; „oder“ ist Text, keine Linie), Specimen mit Gruppe mit und ohne Knopf.
- [ ] **Step 4:** Paket-Gates grün.
- [ ] **Step 5: Commit** `Ticket #30296: Design system class tl-login-alternatives hiding the "or" group without an alternative.`

### Task 2: Views

**Files:**
- Modify: `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/login-form.view.xml`
- Modify: `tl-security-passkey/src/main/webapp/WEB-INF/views/login-form.view.xml` (Overlay)
- Check: `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/login.view.xml`, `login-page.view.xml`, `com.top_logic.demo.react/.../demo-login-page.view.xml` (keine Änderung erwartet; Knopfleiste der Seite verschwindet von selbst, weil leer)

- [ ] **Step 1:** In `login-form.view.xml` den `<generic-command placement="BUTTON_BAR">` aus `<commands>` entfernen (ist `<commands>` dann leer, ganz entfernen) und nach `<login-commands/>` einfügen:
  `<button appearance="primary">` mit `<action class="com.top_logic.layout.view.command.GenericViewCommand" image="css:bi bi-box-arrow-in-right" key="Enter">` und derselben Bezeichnung (`Login`/`Anmelden`) und Kette (`<store-form-state><with-result><login/></with-result></store-form-state>`). Vorher prüfen: Trägt `GenericViewCommand.Config` die Option `key` (aus `ViewCommand.Config`), und wird die Taste für einen Befehl in einem `<button>` gebunden (nicht nur für Befehle in `<commands>`)? Wenn nicht: als Befund melden (NEEDS_CONTEXT), nicht umgehen.
  Danach: `<stack id="login-alternatives" css-class="tl-login-alternatives" gap="compact">` mit `<text>` „or“/„oder“ (Klasse `tl-login-alternatives__or` — prüfen, wie `<text>` eine CSS-Klasse bekommt; sonst die Klasse am Stack und die Regel auf `> :first-child`) und `<login-methods id="login-methods"/>`.
  Kommentare der View nachziehen (Reihenfolge, „oder“ nur mit Alternative, Enter).
- [ ] **Step 2:** Passkey-Overlay: `<passkey-login>` in die Gruppe — `<form config:ref="credentials"><stack config:ref="login-alternatives"><passkey-login … config:position="after" config:reference="login-methods"/></stack></form>` (Syntax gegen `view-layer/overlays.md` prüfen). Kommentar nachziehen („as wide as they are“ bleibt wahr).
- [ ] **Step 3:** Views normalisieren (`layout.view`, `tl-security-passkey`), stabil.
- [ ] **Step 4:** `mvn -B clean install -DskipTests=false -pl ../com.top_logic.layout.view,../tl-security-passkey` (TestAll; enthält das Laden aller Views). Danach `mvn -B clean install -pl ../tl-design-system,../com.top_logic.layout.react,../com.top_logic.demo.react`.
- [ ] **Step 5: Commit** `Ticket #30296: The login form places "Login" as its full-width primary button and the alternatives below "or".`

### Task 3: Sichtprüfung (Orchestrator)

- [ ] Demo starten; Login-Seite hell und dunkel: Reihenfolge, Anmelden voll breit primär, „oder“, Passkey voll breit sekundär, Knopfleiste der Karte verschwunden.
- [ ] Tastatur: Tab-Reihenfolge; Enter im Passwortfeld meldet an; falsches Passwort → Fehlermeldung wie vorher.
- [ ] Login-Dialog (Abmelden in der App, dann Anmelden aus dem Dialog oder Sitzung ablaufen lassen): Enter meldet an, nicht Abbrechen; „Abbrechen“ bleibt in der Knopfleiste.
- [ ] Ohne Alternative: Passkey-Knopf im DOM entfernen bzw. verbergen → Gruppe samt „oder“ verschwindet.
- [ ] `docs/ui-durchgang.md` (Doku-Repo): Eintrag „Login-Formular“ mit Verweis auf #30296; `STATUS.md` nachziehen.
