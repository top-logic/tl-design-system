# Live-Durchgang Anmeldestrecke (8092, master 332453209f, 19.11.)

## Anmelden
- L1 leer → Snackbar unten „Bitte geben Sie Ihren Benutzernamen und Ihr Passwort ein.“ Felder nicht markiert, kein Fokus.
- L2 falsch → Snackbar „Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.“ Passwort bleibt stehen.
- L3 4. Versuch in Folge → Server: „Too many unsuccessful login attempts. The account has been temporarily deactivated. Please wait 4 seconds…“; sichtbar blieb die alte Snackbar (Meldung geht unter). Text sagt „Konto deaktiviert“ – auch bei unbekanntem Namen? (prüfen: Aufzählung)
- L4 Punkt (dirty-Marker) am Label „Benutzername“ nach Eingabe – Rauschen im Login.
- L5 Passkey-Knopf deaktiviert ohne Erklärung, obwohl isSecureContext + PublicKeyCredential vorhanden; kein title.
- L6 Titel „Anmeldung“ unter dem Logo doppelt; „Passwort vergessen?“ + „Registrieren“ rechtsbündig zwischen Feld und Knopf.
- L3 bestätigt (DOM): genau eine Snackbar, alter Text „Anmeldung fehlgeschlagen“; die Bremsmeldung („bitte 4 s warten“) erreicht den Nutzer NIE. Fehler.
- L7 unbekannter Name: identisches Verhalten inkl. Bremse → keine Aufzählung (gut). Text „Konto deaktiviert“ trotzdem irreführend für unbekannte Namen.
- L8 Nach Fehlschlag bleibt das Passwort stehen und ist markiert (Fokus im Passwort, gut zum Überschreiben).

## Passwort vergessen
- P1 Dialog über der Karte; Benutzername NICHT aus dem Login-Feld vorbelegt; nur Benutzername, keine E-Mail.
- P2 leer → Snackbar „Bitte geben Sie Ihren Benutzernamen ein.“; sie bleibt stehen, als der nächste Dialog schon offen ist.
- P3 „root“ (ohne E-Mail) → Folgedialog öffnet sich trotzdem (gut: keine Aufzählung), keine Mail. Info „Code gesendet“ nicht sichtbar (alte Fehler-Snackbar steht noch).
- P4 Reset-Dialog: Code + Passwort ×2 auf einmal; keine Regeln sichtbar. (Code-Befund: unbegrenzte Fehlversuche, keine Bremse beim Anfordern.)

## Registrieren (Modus approval, Captcha an)
- R1 Captcha „Überprüft“ (Proof of Work) läuft still – gut. Server-Warnung: kein hmac-key konfiguriert (nur dieser Knoten).
- R2 „abc“ → erst beim Absenden Snackbar „„abc“ ist keine gültige E-Mail-Adresse.“; keine Live-Prüfung, Feld nicht markiert, Feld type=text (keine E-Mail-Tastatur).
- R3 gültig → Dialog „E-Mail-Adresse bestätigen“, Info-Snackbar „Falls für … noch kein Konto besteht, haben wir einen Code … gesendet“ (gut, keine Aufzählung).
- R4 Mail: Betreff „Ihr Bestätigungscode für die Registrierung bei <App>“, 6 Ziffern, „nur für begrenzte Zeit gültig“ (Dauer nicht genannt).
- R5 Code-Dialog: Enter tut NICHTS; „Weiter“ nicht primär, gleichrangig mit „Neuen Code senden“; Code-Feld type=text, ohne one-time-code/inputmode.
- R6 falscher Code → „Der Bestätigungscode ist falsch.“; 3. Fehlversuch → Server „zu oft falsch, neuen Code anfordern“ – sichtbar bleibt die erste Meldung (Snackbar verschluckt Folgemeldung).
- R7 „Neuen Code senden“ sendet NICHT, sondern führt zurück in „Registrieren“ (E-Mail vorbelegt, Captcha erneut); Beschriftung lügt.
- R8 Konto anlegen: Benutzername = E-Mail als Text (gut), Vorname, Nachname*, Passwort ×2; keine Passwortregeln sichtbar.
- R9 Nachname leer → Feldfehler am Feld (gut) + Snackbar „Bitte beheben Sie die Validierungsfehler vor dem Speichern.“ („Speichern“ falsch im Kontext, doppelt).
- R10 Passwörter ungleich → erst beim Absenden Snackbar; keine Live-Prüfung, Felder nicht markiert.
- R11 „a“/„a“ → Snackbar „Passwort zu kurz!“ – ohne Mindestlänge, mit Ausrufezeichen.
- R12 Erfolg (approval) → alle Fenster zu, Info-Snackbar „Ihr Konto wurde angelegt und wartet auf die Freigabe durch einen Administrator.“; Login-Karte zeigt noch die alten Eingaben (gibtsnicht/••••).
- R13 Anmelden des nicht freigegebenen Kontos → „Ihr Konto ist gesperrt. Bitte wenden Sie sich an Ihren Administrator.“ – sollte „wartet auf Freigabe“ sagen.
- R14 Freigabe durch Admin (Registrierungen) → Mail „Ihre Registrierung … wurde freigegeben“ mit Link, gut. Admins erfahren von neuen Registrierungen nur durch Nachsehen (keine Mail an Admins).
- A1 Abmelden → direkt Login-Seite, keine Bestätigung „Sie wurden abgemeldet“.
- P5 Reset mit Konto: Info „Falls ein Konto mit diesem Namen existiert …“ (gut). Mail: Code 6 Ziffern, „begrenzte Zeit, nur einmal“.
- P6 LIVE BESTÄTIGT: 5 falsche Codes, danach richtiger Code akzeptiert → unbegrenzte Versuche (#30424 umgeschrieben).
- P7 Richtlinie greift doch (Gerät prüft in setPassword): „Password is too short.“ – aber nur im Log; sichtbar blieb die alte Snackbar „Code ungültig“ → Nutzer glaubt, der Code sei falsch! Ernster Folgefehler des Snackbar-Problems.
- Richtlinie Demo: min 8 Zeichen, 2 von 4 Zeichenarten, letzte 3 gesperrt, Ablauf 365 Tage. Texte: „Passwort zu kurz!“ ohne Zahl; es gibt PASSWORD_TOO_SHORT__CHARS mit Zahl.
- P8 Nach erfolgreichem Reset: Info-Snackbar „Ihr Passwort wurde geändert …“, Login-Feld NICHT mit dem Benutzernamen vorbelegt.
- X1 Anmeldeversuch eines gesperrten Kontos landet als ERROR mit Stacktrace im Log (erwartetes Ereignis, kein Fehler).
- X2 ZURÜCKGENOMMEN: das „hängende Benutzermenü“ war das unsichtbare Element `BIT-NOTIFICATION-BAR-ROOT` der Bitwarden-Erweiterung, das nach jeder Anmeldung über dem Avatar liegt (elementFromPoint belegt). Kein Fehler der Anwendung. Bitwarden erkennt die Anmeldung heute nur durch Raten.

## Passwort abgelaufen / zweiter Faktor (Anna, Admin: „Passwort ablaufen lassen“, „MFA verlangen“)
- F1 Login → Fenster „Passwort ändern“ mit Hinweis „Ihr Passwort ist abgelaufen …“; Enter funktioniert hier (Standardbefehl). Keine Regeln sichtbar.
- F2 altes Passwort → „Passwort wurde zuvor genutzt …“ (Snackbar). 
- F3 Erfolg → OHNE Bestätigung direkt „Zwei-Faktor-Authentifizierung einrichten“: QR, Schlüssel mit Kopierknopf, Code-Feld; Login-Karte im Hintergrund verschwindet. Keine Wahl Passkey statt TOTP (Passkey hier nicht verfügbar).
- F4 falscher TOTP → „Der eingegebene Code ist nicht gültig …“; richtig → angemeldet, ohne Hinweis „2FA eingerichtet“.
- F5 Nächster Login → „Zwei-Faktor-Authentifizierung“ Code-Feld (type=text, kein one-time-code); 4.+ Fehlversuch: Server bremst („bitte 4 s warten“) – sichtbar bleibt die ALTE Meldung (Snackbar-Fehler, 3. Ort).
- F6 Code-Feld nimmt beliebige Länge/Zeichen; kein Auto-Absenden bei 6 Ziffern; Code aus der Zwischenablage → normal.

## Nicht durchgespielt (Grund)
- Registrierung Modus direct (Neustart nötig), Captcha-Fehlschlag.
- SSO (kein Identity Provider lokal), Seite „unbekanntes Konto“.
- Passkey: Knopf deaktiviert, Server liefert keine Optionen (options null) – Ursache offen.
- Login-Messages (keine Nachricht konfiguriert).
- Handy-Breite der heutigen Seite (bekannt aus #30422: 420 px fest).

## Ursache Snackbar (19.11.)
- `ReactSnackbarControl.enqueue` stellt jede Meldung hinter die sichtbare (FIFO, 5 s je Meldung, Hover hält fest): die aktuelle Meldung kommt zuletzt. Ticket #30452.

## Nachgeholt (19.11., Instanz im Modus direct)
- K1 Passkey-Knopf: Tooltip „Für diese Installation sind keine Passkeys eingerichtet. Bitte wenden Sie sich an Ihren Administrator.“ – kein Relying Party (`tl_host` fehlt), trotzdem für jeden Besucher ein deaktivierter Knopf; Grund nur per Hover (Handy: nie). → ohne eingerichtete Passkeys kein Knopf, kein „oder“.
- K2 Passkey live testen braucht `tl_host=http://localhost:8092` und einen echten Authenticator (Touch ID/Schlüsselbund) – nur mit Hendrik am Rechner.
- R15 Modus direct: nach „Konto anlegen“ sofort angemeldet, ohne Begrüßung/Hinweis.
- R16 Registrierung mit vorhandener Adresse: Oberfläche identisch (Code-Schritt), Mail „Mit dieser Adresse besteht bereits ein Zugang … Passwort vergessen“ (gut). Der Code-Schritt wartet dann auf einen Code, der nie kommt – der Text des Schritts muss diesen Fall mitdenken („Kein Code? Prüfen Sie Ihr Postfach – besteht schon ein Konto, haben wir Ihnen das geschrieben.“).

## Einladung (19.11.)
- E1 Admin „Einladen“: Dialog E-Mail, Sprache, MFA-Anforderung → Snackbar „Die Einladung wurde an … versendet.“; Liste zeigt „gültig bis“ (7 Tage).
- E2 Mail „Einladung zu <App>“ mit Link `…/accept-invitation.view.xml?invitation=<id>`; Gültigkeit nicht genannt.
- E3 Seite „Einladung“: Karte klebt OBEN, ohne Hintergrund, ohne App-Namen; Knopf „Bestätigungscode senden“ sieht aus wie eine Trennlinie (nicht primär). Zweiter Nachweis per Code, obwohl der Link schon per Mail kam (ein Schritt mehr als üblich – bewusst? Weitergeleitete Mails).
- E4 Danach dieselben Fenster wie Registrierung (Code mit „Neuen Code senden“, Konto anlegen) → angemeldet ohne Begrüßung.
- E5 Link erneut (angemeldet): „Die Einladung wurde bereits zur Erstellung eines Kontos verwendet.“ – Sackgasse, kein Weg zur Anwendung/Anmeldung.
- E6 unbekannter Link: „Für diesen Link liegt keine Einladung vor. Möglicherweise ist der Link unvollständig, oder die Einladung wurde mit einem neuen Link erneut versendet oder widerrufen.“ – gut erklärt, aber ebenfalls Sackgasse.

## Login-Meldung und Wartung (19.11.)
- M1 Login-Meldung (Admin → System → Login-Meldungen, aktiv): nach dem Passwort ein Fenster „Mitteilungen“ mit Maximieren-Knopf, Text, „OK“ (primär) / „Abbrechen“. Gilt auch für root.
- M2 „Abbrechen“ bricht die Anmeldung still ab: Login-Karte mit gefüllten Feldern, kein Hinweis, warum man nicht drin ist. → in der Karte: „Ohne Bestätigung keine Anmeldung.“ und Rückweg.
- M3 Ein offener Login-Schritt überlebt Neuladen und Adresswechsel (Flow liegt in der Sub-Session) – gut; im Neubau muss der Schritt nach Neuladen wieder in der Karte stehen (nicht als Fenster).
- W1 Wartungsmodus an: Login-Seite zeigt vorher KEINEN Hinweis. Anmeldeversuch → „Anmeldung fehlgeschlagen für Benutzer 'ben…', da das System sich im Wartungsmodus befindet.“ – ohne die Admin-Nachricht („Update bis 10 Uhr“), mit Benutzername im Text.
- W2 Wartung prüft erst nach dem Passwort (falsches Passwort → „Anmeldung fehlgeschlagen“) – keine Aufzählung, gut.
- W3 Angemeldete sehen eine rote Leiste „Das System befindet sich im Wartungsmodus. Update bis 10 Uhr“ – die Login-Seite sollte dieselbe Nachricht vor dem Anmelden zeigen.

## Captcha (aus dem Code, tl-security-captcha) und SSO
- C1 Zustände des Widgets: „Ich bin kein Roboter“, Lädt…, Prüft…, Geprüft, „Prüfung erforderlich“, „Prüft… bitte warten“ (Absenden zu früh), „Prüfung fehlgeschlagen, später erneut“, „Abgelaufen, erneut versuchen“ + „Neu laden“, „erfordert HTTPS“. Absenden vor Abschluss → `ERROR_CAPTCHA_INVALID` („Die Sicherheitsprüfung ist noch nicht abgeschlossen oder abgelaufen …“) – heute Snackbar. Live: Prüfung lief still in < 1 s, Fehlerzustände nicht ausgelöst.
- C2 Server-Warnung ohne `hmac-key`: Challenges gelten nur auf diesem Knoten bis zum Neustart (Cluster!) – Betriebshinweis, nicht Oberfläche.
- S1 SSO-Knöpfe lokal nicht vorhanden (kein Anbieter); Fehlschlag kommt als Alert mit Schließen in der Alternativen-Gruppe (Code `LoginMethodsElement`).
- S2 Seite „Nicht registriert“ (`unknown-account.view.xml`, direkt geöffnet): Karte klebt oben, ohne Hintergrund/App-Namen; „Die Anmeldung war erfolgreich, Sie sind jedoch nicht für diese Anwendung registriert. Bitte wenden Sie sich an Ihren Administrator.“ + Link „Zur Anmeldung“. Bei eingeschalteter Selbstregistrierung kein Angebot „Konto beantragen“.
