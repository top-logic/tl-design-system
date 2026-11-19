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
- X2 (Nebenbefund, nicht Strecke) Benutzermenü (Avatar root) öffnet nicht mehr, nachdem das „Mehr“-Menü der Personenliste benutzt wurde – auch nach Neuladen; keine Konsolenfehler.

## Passwort abgelaufen / zweiter Faktor (Anna, Admin: „Passwort ablaufen lassen“, „MFA verlangen“)
- F1 Login → Fenster „Passwort ändern“ mit Hinweis „Ihr Passwort ist abgelaufen …“; Enter funktioniert hier (Standardbefehl). Keine Regeln sichtbar.
- F2 altes Passwort → „Passwort wurde zuvor genutzt …“ (Snackbar). 
- F3 Erfolg → OHNE Bestätigung direkt „Zwei-Faktor-Authentifizierung einrichten“: QR, Schlüssel mit Kopierknopf, Code-Feld; Login-Karte im Hintergrund verschwindet. Keine Wahl Passkey statt TOTP (Passkey hier nicht verfügbar).
- F4 falscher TOTP → „Der eingegebene Code ist nicht gültig …“; richtig → angemeldet, ohne Hinweis „2FA eingerichtet“.
- F5 Nächster Login → „Zwei-Faktor-Authentifizierung“ Code-Feld (type=text, kein one-time-code); 4.+ Fehlversuch: Server bremst („bitte 4 s warten“) – sichtbar bleibt die ALTE Meldung (Snackbar-Fehler, 3. Ort).
- F6 Code-Feld nimmt beliebige Länge/Zeichen; kein Auto-Absenden bei 6 Ziffern; Code aus der Zwischenablage → normal.
- X2 präzisiert: Benutzermenü (Avatar) öffnet sich nach Neuladen nicht mehr (mehrfach reproduziert, Tabellenansicht, Nutzer Anna); vorher einmal je Tab geöffnet. Keine Konsolenfehler. Nicht Teil der Strecke → eigenes Ticket nach Ursachenbeleg.

## Nicht durchgespielt (Grund)
- Einladung annehmen (Benutzermenü X2 blockierte das Abmelden; Schritte Code + Konto anlegen sind dieselben wie bei der Registrierung).
- Registrierung Modus direct (Neustart nötig), Captcha-Fehlschlag.
- SSO (kein Identity Provider lokal), Seite „unbekanntes Konto“.
- Passkey: Knopf deaktiviert, Server liefert keine Optionen (options null) – Ursache offen.
- Login-Messages (keine Nachricht konfiguriert).
- Handy-Breite der heutigen Seite (bekannt aus #30422: 420 px fest).

## Ursache Snackbar (19.11.)
- `ReactSnackbarControl.enqueue` stellt jede Meldung hinter die sichtbare (FIFO, 5 s je Meldung, Hover hält fest): die aktuelle Meldung kommt zuletzt. Ticket #30452.
