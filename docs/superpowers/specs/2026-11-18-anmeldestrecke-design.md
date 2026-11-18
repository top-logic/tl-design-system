# Anmeldestrecke: eine Karte für alle Schritte (#30422)

Stand 18.11.2026, mit Hendrik entschieden. Ticket #30422. Folgt #30294 (Hintergrund) und #30296 (Anmelden als
Hauptaktion). Abgespalten: #30424 (Passwort-Reset ohne Richtlinienprüfung, eigener PR).

## Wozu

Die Anmeldung ist der erste Eindruck jeder Anwendung, und heute ist sie ein allgemeines Formular in einem allgemeinen
Panel: zehn Hüllen bis zum ersten Feld, eine feste Breite von 420 px, die auf dem Handy über den Rand läuft, und
jeder Folgeschritt (Registrieren, Passwort vergessen, zweiter Faktor, Passkey) öffnet ein Fenster über der Karte.
Jeder Fehler – falsches Passwort, gesperrt, falscher Code – erscheint in der globalen Snackbar am Bildrand, weit weg
vom Feld, das ihn verursacht hat. Kein `<form>`, kein `autocomplete`: Passwortmanager und Passkey-Autofill raten.

Ziel: eine moderne Anmeldestrecke, auf dem Schreibtisch und auf dem Handy. Ein Hauptweg, Nebenwege am Rand, jeder
Schritt in derselben Karte, jeder Fehler dort, wo man hinschaut.

## Entschieden (18.11., Hendrik)

| Frage | Entscheidung |
|---|---|
| Technik | Eigener Baustein statt allgemeines Panel + Formular + Hüllen |
| Handy (< 480 px) | ohne Karte: Formular direkt auf der Seite, volle Breite |
| Überschrift | keine in der Karte; der App-Name über der Karte (#30294) ist die Überschrift der Seite |
| Umfang | alle Karten der Strecke ziehen mit, nicht nur die Anmeldung |
| Folgeschritte | in derselben Karte, kein Fenster über der Karte |
| Passkey-Autofill | gehört dazu (`autocomplete="username webauthn"`, Conditional Mediation) |
| Reset ohne Richtlinie | eigenes Ticket #30424, eigener PR |

## Ziele

- **Ein Baustein `<login-card>`** trägt die ganze Strecke: Rahmen, Schritte, Fehler, Zurück. Er ersetzt
  `<panel appearance="card" css-class="tl-login-card" width="420px">` und die Hüllen darum.
- **Schritte in der Karte.** Was die Strecke heute als Fenster öffnet, erscheint in der Karte: der Inhalt wechselt,
  oben steht „Zurück“. Kein Fenster über Fenster.
- **Fehler in der Karte.** Jede Meldung der Strecke steht über der Hauptaktion des Schritts, angesagt für
  Screenreader; die Snackbar bleibt für die Anwendung.
- **Echte Formularsemantik.** Die Karte ist ein `<form>`, jedes Feld der Strecke trägt sein `autocomplete`
  (`username`, `current-password`, `new-password`, `email`, `one-time-code`, `given-name`, `family-name`).
- **Passkey-Autofill.** Der Browser bietet gespeicherte Passkeys im Benutzernamen-Feld an; der Knopf „Mit Passkey
  anmelden“ bleibt als Alternative.
- **Breite: höchstens, nie fest.** `min(100 %, 24rem)`; unter 480 px keine Karte.
- **Jeder Beitrag hat einen Platz.** „Passwort vergessen?“ in der Zeile des Passwort-Labels, „Registrieren“ als
  leise Zeile am Ende, SSO und Passkey unter „oder“ – jeder Ort ein benannter Platz, nicht die Reihenfolge einer Liste.

## Nicht-Ziele

- Kein Re-Login bei Sitzungsablauf (heute: Neuladen, Eingaben weg) – eigenes Thema.
- Keine neue Logik der Strecke: `LoginFlow`, `LoginAction`, die Self-Service-Aktionen und ihre Meldungen bleiben, wie
  sie sind. Code statt Link, „verrät nicht, ob ein Konto existiert“ bleiben.
- Dialoge der angemeldeten Anwendung (Passwort ändern, Passkey hinzufügen, umbenennen) bleiben Fenster. Sie gewinnen
  nur `autocomplete` an ihren Feldern.
- Kein eigenes Eingabefeld für die Anmeldung: die Felder bleiben das Feld des Systems (`tl-form-field`, Validierung,
  Fehler, ARIA). Das Systemfeld selbst wird verschlankt (siehe „Systemfeld“), davon profitiert jedes Formular.
- Legacy (`LoginViewDialog`, `loginDialog.css`, JSP-Fehlerseiten) bleibt unberührt. `com.top_logic/.../style/login.css`
  hat keinen Leser mehr und wird gelöscht.

## Anti-Ziele (Fehlschlag, auch wenn es läuft)

- Ein Fehler der Anmeldung erscheint weiter in der Snackbar statt in der Karte.
- Ein Feld der Strecke ohne `autocomplete`, oder der Passwortmanager bietet auf der Login-Seite nichts an.
- Auf einem Handy mit 360 px Breite läuft etwas über den Rand oder ein Feld ist schmaler als der Bildschirm minus
  Seitenrand.
- Ein Schritt öffnet doch ein Fenster über der Karte.
- Ein Kunden-Overlay, das sich heute an `login-alternatives` hängt, findet seinen Platz nicht mehr.
- Mehr als eine Hauptaktion je Schritt.

## Aufbau

### Die Karte

```
<login-backdrop>                       Seite (#30294): App-Name oben, „Powered by“ unten
  <login-card>                         Rahmen, Schritte, Fehler, Zurück; rendert <form class="tl-login-card">
    <view-ref login-form.view.xml/>    erster Schritt: Anmelden
  </login-card>
</login-backdrop>
```

Gerendert (Ziel, erster Schritt):

```html
<form class="tl-login-card" aria-label="Anmeldung" novalidate>
  <div class="tl-login-card__notice" aria-live="polite"></div>   <!-- Fehler/Info des Schritts, leer = weg -->
  …Felder (tl-form-field), Hauptaktion, „oder“, Alternativen, Fußzeile…
</form>
```

Der Inhalt eines Schritts steht **direkt** in der Karte: kein Panel, keine Titelleiste, kein Inset, kein Stack um
das Formular. Das Formular des Schritts rendert ohne eigenes Inset (`with-inset="false"`); die Karte gibt Rand und
Abstand. Die Karte ist eine Flex-Spalte mit einem Abstand für alles; Gruppen (Felder, Aktionen, Alternativen,
Fußzeile) setzen sich mit einem größeren Abstand ab.

`<form>` ist nur Semantik für Browser und Passwortmanager: `submit` wird abgefangen und löst die Hauptaktion des
Schritts aus (dieselbe, die heute `key="Enter"` bindet). Kein Neuladen, kein Absenden an eine URL.

### Schritte: die Karte ist der Dialog-Manager ihres Teilbaums

Die Naht gibt es schon: `ReactContext#getDialogManager()` und `ViewContext#withErrorSink(…)` sind je Teilbaum
austauschbar, und `OpenDialogAction` wie `LoginFlow` öffnen ihre Fenster über den Dialog-Manager des Kontexts, aus
dem der Befehl kommt. `<login-card>` setzt für ihren Teilbaum

- einen **Dialog-Manager**, der jedes geöffnete Fenster als Schritt in die Karte legt (Stapel: öffnen legt auf,
  schließen nimmt ab, `closeTopDialog` und `bringToFront` wie gehabt), und
- eine **Fehlersenke**, die Meldungen im Hinweisbereich des obersten Schritts zeigt.

Damit laufen `LoginFlow` (Passwortwechsel, zweiter Faktor, Passkey-Einrichtung, Login-Messages), Registrieren,
Code bestätigen, Konto anlegen, Passwort vergessen und Zurücksetzen **ohne Änderung ihrer Aktionen** in der Karte.

Ein `<window>` als Schritt zeichnet sich anders als frei:

| Teil des Fensters | in der Karte |
|---|---|
| Titel | Überschrift des Schritts (`tl-type-heading-sm`), über dem Inhalt; der erste Schritt hat keinen |
| `width` | ignoriert; die Karte bestimmt die Breite |
| „Abbrechen“ (`CancelDialogCommand`) in `<actions>` | „Zurück“ oben links (Link mit Pfeil), schließt den Schritt |
| Befehl `placement="BUTTON_BAR"` | Hauptaktion des Schritts: voll breit, primär, löst `submit` aus |
| weitere Befehle der Knopfleiste (z. B. „Neuen Code senden“) | sekundär, voll breit, unter der Hauptaktion |

Die Fenster-Views selbst (`register.view.xml`, `otp.view.xml` …) bleiben **eine** Datei je Schritt und zeigen sich
als Fenster, wo es keine Karte gibt (angemeldete Anwendung), und als Schritt in der Karte.

Der Anmelde-Dialog des anonymen Benutzermenüs (`login.view.xml`) legt eine `<login-card>` ohne Rahmen in sein Fenster:
Folgeschritte wechseln dann im Fenster, statt ein zweites zu öffnen.

### Der erste Schritt: Anmelden

```
[Hinweis/Fehler]                                  nur wenn da
Benutzername                                      autocomplete="username webauthn"
[____________________]
Passwort                   Passwort vergessen?    Label-Zeile; Platz login-password-actions
[____________________]                            autocomplete="current-password"
[       Anmelden       ]                          primär, voll breit, submit
            oder                                  nur wenn eine Alternative da ist (wie heute)
[ Mit Passkey anmelden ]                          sekundär, voll breit
[   Mit Firma-SSO …    ]
Noch kein Konto? Registrieren                     leise Zeile, zentriert; Platz login-footer
```

### Plätze für Beiträge

Heute steuert `LoginCommandsConfig` mit einer Liste, was zwischen Passwort und Knopf steht. Künftig gibt es **ein**
Erweiterungsmittel, das gleiche wie für SSO und Passkey schon heute: das Overlay von `login-form.view.xml`, das ein
Element in einen benannten Platz hängt.

| Platz (`id`) | Ort | heute |
|---|---|---|
| `login-password-actions` | rechts in der Label-Zeile des Passworts | „Passwort vergessen?“ (Self-Service) |
| `login-alternatives` | unter „oder“, voll breit | SSO (`login-methods`), Passkey – unverändert |
| `login-footer` | leise Zeile am Ende | „Registrieren“ (Self-Service) |

`LoginCommandsConfig` und `<login-commands>` entfallen; Self-Service liefert seine zwei Knöpfe als Overlay
(Migration im Ticket, `RequiresMigration`: Anwendungen, die eigene Befehle über `LoginCommandsConfig` beitragen,
schreiben sie als Overlay).

Für die Label-Zeile bekommt `<field>` einen allgemeinen Platz für eine Nebenaktion im Label (`<label-actions>`); das
Formularfeld des Systems zeichnet ihn rechts in seiner Label-Zeile. Er taugt auch außerhalb der Anmeldung (Hilfe,
„Passwort anzeigen“).

### Systemfeld: Hüllen nur mit Zweck (18.11., Hendrik)

Heute stehen je Feld vier Hüllen um das `<input>`:

```
div.tl-form-field (Grid) › div.__label › label
                         › div.__input › span (ohne Klasse, ohne Stil) › span.tl-field-group › input
```

Jede Hülle wird auf ihren Zweck geprüft und fällt, wenn sie keinen hat. Ziel: das namenlose `span` entfällt;
`tl-field-group` nur, wenn das Feld einen Zusatz trägt (Symbol, Suffix, Aktion); das Grid nur, wo das Label neben dem
Feld steht (`--side`), sonst eine Flex-Spalte. Die Klassen und ihr Vertrag bleiben, wo sie einen Zweck haben;
Aussehen jedes Formulars bleibt gleich (Gate: Specimen und Sichtprüfung über alle Feldarten der Demo, auch
ausgeblendete Spalten). Breit wirkend, darum Prüfung über alle Views vor dem Push.

### `autocomplete` an Feldern

`<field>` bekommt die Option `autocomplete` (Wert wie in HTML), die bis zum `<input>` durchgereicht wird. Gesetzt in
jeder View der Strecke:

| View | Feld | Wert |
|---|---|---|
| `login-form` | name / password | `username webauthn` / `current-password` |
| `change-password` | newPassword, newPasswordConfirm | `new-password` |
| `otp`, `mfa-enroll`, `verification-code`, `reset-password` (code) | code | `one-time-code` |
| `forgot-password` | username | `username` |
| `reset-password` | newPassword, newPasswordConfirm | `new-password` |
| `register` | email | `email` |
| `create-account` | userName / givenName / surname / Passwörter | `username` / `given-name` / `family-name` / `new-password` |

### Passkey-Autofill

Beim Anzeigen des ersten Schritts startet das Passkey-Element zusätzlich eine Anfrage mit
`mediation: "conditional"`; der Browser bietet dann gespeicherte Passkeys im Auswahlmenü des Benutzernamens an.
Wählt man einen, läuft dieselbe Anmeldung wie über den Knopf. Ohne Unterstützung (`PublicKeyCredential.
isConditionalMediationAvailable()` falsch) passiert nichts; der Knopf bleibt. Ein Klick auf den Knopf bricht die
laufende bedingte Anfrage ab (`AbortController`), bevor er seine eigene startet.

### Fehler und Hinweise

- Die Fehlersenke der Karte zeigt die Meldung als `tl-alert` (Variante `error`, Info als `info`) im Hinweisbereich
  des obersten Schritts – über den Feldern, damit sie beim Fokus auf das erste Feld mitgelesen wird. `aria-live`.
- Eine neue Meldung ersetzt die alte; Wechsel des Schritts leert den Hinweis.
- `InvalidInputException` fokussiert wie heute das erste fehlerhafte Feld; dessen Feldfehler bleibt am Feld.
- Erfolgsmeldungen, die heute als Snackbar kommen und **danach** einen Schritt öffnen („Code an … gesendet“),
  stehen im Hinweisbereich des neuen Schritts (Variante `info`), nicht im alten.
- Der SSO-Fehler mit Schließknopf in der Alternativen-Gruppe (`ExternalLoginFailure`) zieht in den Hinweisbereich.
- Der deaktivierte Passkey-Knopf ohne WebAuthn verschwindet; ohne Alternative verschwindet „oder“. Der Knopf erklärte
  bisher nur per Tooltip, warum er nicht geht – auf dem Handy unsichtbar.

### Seiten, die mitziehen

| View | heute | künftig |
|---|---|---|
| `login-page.view.xml` | Panel-Karte 420 px im Backdrop | `<login-card>` im Backdrop |
| `demo-login-page.view.xml` | dasselbe + „Anonym stöbern“ unter der Karte | dasselbe + der Link in `login-footer` |
| `login.view.xml` (Dialog) | Fenster mit Formular, „Abbrechen“ | Fenster mit `<login-card>` ohne Rahmen |
| `unknown-account.view.xml` | Panel-Karte 380 px ohne Backdrop | `<login-card>` im Backdrop |
| `accept-invitation.view.xml` | Panel-Karte 380 px ohne Backdrop | `<login-card>` im Backdrop; Code und Konto als Schritte |
| alle Fenster der Strecke (15 Views, Liste im Plan) | Fenster über der Karte | Schritte in der Karte; `autocomplete` |

## Aussehen

- Karte: dieselbe Fläche wie jede Karte (`surface-layer`, Linie `border-separator`, `radius-md`, kein Schatten –
  skalen „Elevation“), Innenrand `space-xl` (`space-lg` kompakt). Breite `min(100 %, 24rem)`.
- **Unter 480 px** (Container-Abfrage auf der Backdrop-Fläche): keine Fläche, kein Rand, kein Schatten; das Formular
  steht mit dem Seitenrand `space-lg` auf der Seite und nimmt die volle Breite.
- Abstände: innerhalb einer Gruppe `space-md` (Feld zu Feld, Knopf zu Knopf), zwischen Gruppen `space-xl`.
  Label-Zeile zu Feld wie im System. „oder“ mit `space-md` darüber und darunter.
- Überschrift eines Folgeschritts: `tl-type-heading-sm`, „Zurück“ darüber als Link-Knopf mit Pfeil, klein.
- Fußzeile: `tl-type-body`, Text `text-secondary`, der Link als Link-Knopf.
- Schrittwechsel: Inhalt blendet kurz über (`duration-fast`), nichts gleitet; bei „Bewegung reduzieren“ sofort.
- Werte sind Vorschläge; endgültig mit Augen an der Instanz, hell und dunkel, normal und kompakt.

## Paket

- Neue Komponente `login-card` (CSS + Vertrag + Spec) ersetzt `login-form`. Klassen `tl-login-card`,
  `__notice`, `__step-heading`, `__back`, `__group`, `__or`, `__footer`; Modifier `--frameless` (im Dialog).
- Die Klassen `tl-login-alternatives`, `tl-login-alternatives__or` und die Korrekturregeln von außen
  (`.tl-login-card .tl-inset--card`, `… .tl-form-layout`) entfallen.
- `tl-form-field__label-actions` als neues Element des Formularfelds.
- Gates: `lint-css` (Modifier-Eintrag `--frameless` mit Begründung), Vertrag nennt jedes gelesene Token, DOM-Gate:
  Karte bei 360 px ohne Überlauf, ohne Rahmen; bei 1280 px 24rem.

## Technik (Überblick, Einzelheiten im Plan)

- **Java:** `LoginCardElement` (`<login-card>`, Option `frame`) + `ReactLoginCardControl`; ein Dialog-Manager und eine
  Fehlersenke für ihren Teilbaum (`ViewContext#withDialogManager` neu, analog `withErrorSink`). `WindowElement` bzw.
  sein Control erfährt, dass es als Schritt gezeigt wird. `<field autocomplete>` und `<label-actions>`.
  `LoginCommandsElement`, `LoginCommandsConfig` und `login.selfservice.config.xml` entfallen.
- **TSX:** `TLLoginCard.tsx` (form, Hinweis, Schrittstapel, Zurück, Übergang), `TLWindow` im Schrittmodus,
  `TextInputPart` reicht `autoComplete` durch, `TLFormField` zeichnet `label-actions`, `TLWebAuthn` mit bedingter
  Anfrage.
- **Tests:** Java (Dialog-Manager der Karte: öffnen, schließen, ersetzen durch `LoginFlow`; Fehlersenke), Vitest
  (Karte, Fenster als Schritt, `autoComplete`), DOM-Gate (Breiten), Sichtprüfung jeder Strecke mit jedem Fehler aus
  der Bestandsaufnahme unten.

## Prüfliste der Strecke (Bestandsaufnahme 18.11.)

Jede Zeile wird an der lokalen Instanz durchgespielt, auf dem Schreibtisch und bei 360 px, hell und dunkel.

| Strecke | Zustände |
|---|---|
| Anmelden | leer, falsch, zu viele Versuche, gesperrt, Wartung, Passwort abgelaufen → Passwortwechsel als Schritt, Erfolg |
| SSO | Knopf, Fehlschlag (zurück mit Meldung), unbekanntes Konto (Seite) |
| Passkey | Autofill, Knopf, abgebrochen, unbekannter Passkey, kein WebAuthn (Knopf weg), als zweiter Faktor |
| Zweiter Faktor | Methodenwahl, Code, falscher Code, Einrichtung mit QR, keine Methode möglich |
| Registrieren | E-Mail leer/ungültig, deaktiviert, zu oft angefordert, Code gesendet (Info im nächsten Schritt), Code falsch/zu oft falsch/abgelaufen, neuen Code senden, Nachname leer, Passwörter ungleich, wartet auf Freigabe, Erfolg |
| Passwort vergessen | leer, Code gesendet, Code ungültig, Passwörter ungleich/leer, Richtlinie verletzt (nach #30424), Erfolg → zurück zum Anmelden mit Info |
| Einladung | unbekannt/abgelaufen/angenommen, Code, Konto anlegen, Mailfehler |
| Login-Messages | Bestätigen als Schritt |
| Dialog im anonymen Menü | alle Folgeschritte im selben Fenster |

## Schnitt (Vorschlag, kleine PRs)

0. **Systemfeld verschlanken:** Hüllen ohne Zweck fallen, kein sichtbarer Unterschied.
1. **Felder:** `<field autocomplete>`, `<label-actions>` – allgemein, sofort nützlich, ohne Sichtänderung außer Label-Zeile.
2. **Karte:** `<login-card>` mit Fehlersenke und Schrittstapel, Fenster als Schritt; Login-Seite, Dialog, Plätze,
   Wegfall `LoginCommandsConfig`; alle Views der Strecke.
3. **Passkey-Autofill.**

## Offen für den Plan

- Wie `TLWindow` vom Schrittmodus erfährt (Zustand vom Server oder React-Kontext der Karte) – der Plan prüft beide
  gegen den Code.
- Ob `DefaultViewContext(ReactContext)` den Dialog-Manager des Elternkontexts weiterreicht (für Schritte aus Schritten).
- Ob die Info „Code gesendet“ vor oder nach dem Öffnen des neuen Schritts in die Senke geht (Reihenfolge in
  `RequestPasswordResetAction`, `request-registration-code`).
