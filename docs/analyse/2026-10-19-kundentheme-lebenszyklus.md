# Lebenszyklus eines Kundenthemes — Optionsanalyse

**Stand:** 2026-10-19 · vor der Spec · Anlass: Hendrik 19.10. („beim Kunden bleibt nur die gelieferte Basisdatei; gibt
es nachträglich Änderungen, muss das Theme neu gerechnet werden“). Führt den offenen Faden vom 25.09. weiter
(`docs/uebergabe/2026-09-30-sitzung-zwei-wege.md`, „Wo rechnet `derive`?“). Entscheidungen landen in `docs/skalen.md`
„Themes: eine dritte Achse“.

## 1 · Ausgangslage (gemessen, nicht vermutet)

**Im Paket**

- Der Kunde liefert eine Basisdatei `<theme>.primitives.json`: Hausfarbe, Grauwahl, einzelne Stufen, Schrift, Radius
  (Beispiel `test/fixtures/probe.primitives.json`).
- `tools/derive.mjs` ist ein Node-Kommando (liest Dateien über `node:fs`). Es rechnet daraus `<theme>.theme.css` mit
  **Rollen und Werten** unter `[data-tl-theme="<id>"]`, und zwar nur die Rollen, die von TopLogic abweichen; der
  Befund steht im Dateikopf. Der Rechenkern (`tools/lib/color.mjs`, `pairs.mjs`, `contrast.mjs`) ist abhängigkeitsfrei
  und liefe auch im Browser, braucht dort aber `tokens.json` und `primitives.json` des Pakets als Daten.
- Weder `tokens.css` noch eine Theme-Datei tragen eine Paketversion. Das Siegel am Ende der Kopie ist ein Hash über den
  Inhalt, kein Versionsvergleich. `package.json` steht auf `0.1.0`.

**In der Engine** (Erkundung 19.10., Worktree auf 5c)

- `UIThemeService` liest Themes aus XML (`tl-react-theme.config.xml`: `default`, `dark`, Vererbung über `extends`) und
  schreibt sie als Inline-`<style>` unter `[data-theme="<id>"]` vor die Stylesheets. Die Werte darin sind die alten
  Rollen. Gesetzt wird `data-theme`; das 24.09. entschiedene `data-tl-theme` setzt der Server noch nicht.
- Die Wahl des Nutzers liegt in der `PersonalConfiguration` (`react.theme`); Menü über `SetThemeCommand`.
- Jedes Modul kann über `ClientResources` ein eigenes Stylesheet beisteuern (`<stylesheet name resource layer
  requires>`, auch ersetzen oder entfernen). Eine erzeugte Theme-Datei lässt sich dort mit
  `requires="tl-design-system-tokens"` einhängen.
- Einen Theme-Editor gibt es im React-Stack nicht. Der alte Editor (`com.top_logic.layout.themeedit`) schreibt
  Theme-Variablen in Dateien (`theme-settings.xml` unter `/WEB-INF/themes/`), nicht in die Datenbank.
- Der Server kann kein JavaScript ausführen (keine GraalJS-, Nashorn- oder Rhino-Abhängigkeit). Node gibt es aber zur
  **Bauzeit**: jedes React-Modul baut mit `frontend-maven-plugin` und installiert Node im Maven-Lauf.

## 2 · Was „veraltet“ heißt und was dann passiert

Ein Theme ist veraltet, wenn das Paket seit dem Rechnen Rollen oder Paare geändert hat. Beispiel aus Welle 5c: neu
sind `category-N-surface`, `text-on-category-N`, `text-contrast-light/-dark`.

| Fall | Was der Nutzer sieht | Gefahr |
|---|---|---|
| neue Rolle, im alten Theme nicht gesetzt | der Wert von TopLogic (die Kaskade fällt auf `:root` zurück) | **nicht unlesbar**, aber nicht in der Kundenmarke: Termine in TopLogic-Farben neben Kundenkategorien |
| neues Paar aus einer Kundenrolle und einer TopLogic-Rolle | beide Werte gemischt | **ungeprüft**: der Kontrast dieses Paars wurde nie gerechnet |
| eine Rolle wechselt ihre Bedeutung | — | darf nicht vorkommen: Rollennamen sind der Vertrag (`skalen.md`, Korrektur 25.09.) |

Ein veraltetes Theme bricht also nicht, aber es hält zwei Versprechen nicht mehr: Marke überall und Lesbarkeit geprüft.

## 3 · Was jede Lösung erfüllen muss

1. **Die Basisdatei ist die einzige Quelle.** Alles andere ist ein Rechenergebnis und darf jederzeit neu entstehen.
2. **Das Theme passt zur Paketversion, mit der es läuft.** Oder die Anwendung weiß, dass es nicht passt.
3. **Der Befund erreicht jemanden, der handeln kann:** Entwickler im Build oder Admin im Editor, nicht der Endnutzer.
4. **Eine Rechnung, ein Code.** Kein Java-Port des Kerns (zweite Wahrheit, abgelehnt am 25.09.).
5. **Mehrere Themes, Nutzer wählt.** Das kann `UIThemeService` heute schon und bleibt.

## 4 · Die Wege

| | **A · Im Build der Anwendung** | **B · Im Browser beim Laden** | **C · Im Theme-Editor beim Speichern** |
|---|---|---|---|
| Wo liegt die Basisdatei | im Kundenmodul (Repo) | im Kundenmodul oder in der Datenbank | in der Datenbank oder in `/WEB-INF/themes/` |
| Wer rechnet | Maven-Lauf mit Node (wie heute die React-Module), `derive` aus genau der Paketversion, gegen die gebaut wird | jeder Client bei jedem Laden | der Browser des Admins einmal; die Engine liefert das Ergebnis statisch aus |
| Nach einem Update | wird beim Bauen automatisch neu gerechnet — kann nicht veralten | rechnet ohnehin jedes Mal neu — kann nicht veralten | **veraltet**, bis jemand neu speichert; braucht Erkennung und Auslöser |
| Befund | im Build-Log; mit `--strict` bricht der Build | geht verloren (höchstens Konsole) | als Meldung im Editor |
| Theme ändern ohne Neubau | nein | ja | ja |
| Kosten | klein: ein Maven-Schritt, Datei über `ClientResources` | Rechenkern samt Tokentabellen im Client-Bundle, Rechnung vor dem ersten Bild (sonst Flackern) | ein Editor; Speicherort; Erkennung veralteter Ergebnisse |

**Verworfen:** Rechnen auf dem Server zur Laufzeit. Ohne JavaScript-Engine hieße das ein Java-Port (zweite Wahrheit)
oder eine neue Abhängigkeit wie GraalJS nur für Themes.

## 5 · Empfehlung

**Jetzt A, mit Versionsstempel. Später C, falls ein Theme zur Laufzeit änderbar sein muss — mit B als Rückfall.**

1. **A als Regelfall.** Der Kunde legt `<theme>.primitives.json` in sein Anwendungsmodul. Ein Maven-Schritt rechnet beim
   Bauen mit dem `derive` der Paketversion, gegen die gebaut wird, und hängt das Ergebnis über `ClientResources` ein.
   Ein TopLogic-Update bedeutet ohnehin einen Neubau, also wird jedes Mal neu gerechnet. Ein veraltetes Theme kann es
   in diesem Weg nicht geben.
2. **Versionsstempel für alle Wege.** `generate` schreibt in den Kopf von `tokens.css` einen Fingerabdruck der
   Rollenliste (Hash über die Namen der Rollen und Paare), `derive` denselben in den Kopf jeder Theme-Datei. Stimmen sie
   nicht überein, ist das Theme veraltet. Prüfen lässt sich das als Test im Kundenmodul (wie `TestDesignSystemCopy`)
   und beim Start der Engine als Warnung im Log.
3. **C nur, wenn verlangt.** Soll ein Admin die Hausfarbe zur Laufzeit ändern, rechnet der Editor im Browser mit
   demselben Kern und speichert Ergebnis und Fingerabdruck. Passt der Fingerabdruck nach einem Update nicht mehr,
   rechnet der Client beim Laden selbst (Weg B), bis der Admin neu speichert — und der Admin sieht einen Hinweis.
4. **Bis zum Neurechnen gilt TopLogic.** `derive` schreibt weiter nur abweichende Rollen. So fällt jede neue Rolle auf
   den lesbaren TopLogic-Wert zurück statt auf nichts.

**Warum nicht gleich C oder B:** Beides baut einen Editor, einen Speicherort und eine Client-Rechnung, bevor feststeht,
ob ein Kunde sein Theme ohne Neubau ändern muss. A erfüllt die fünf Bedingungen aus §3 mit einem Maven-Schritt, und der
Stempel aus Punkt 2 trägt später auch C.

## 6 · Offene Fragen

| # | Frage | An | Folge |
|---|---|---|---|
| F1 | Muss ein Admin das Theme **zur Laufzeit** ändern können, ohne neu zu bauen? | Hendrik, Bernhard | ja → C (mit B als Rückfall) planen; nein → A genügt |
| F2 | Meinte Bernhard am 25.09. „TL-Script“ als Lieferant der Grundwerte (Ausdruck statt Hex) oder nur „zur Laufzeit“? | Bernhard | TL-Script → die Basisdatei wird zur Konfiguration in der Engine, A entfällt für diese Themes |
| F3 | Wo liegt die Basisdatei beim Kunden: im Repo des Anwendungsmoduls oder in der laufenden Anwendung? | Hendrik | folgt aus F1 |
| F4 | Was wird aus den alten XML-Themes von `UIThemeService` (`default`, `dark`)? Ihre Werte sind alte Rollen. | Welle 5d | Die Wahl-Mechanik bleibt; Werte und `data-theme` → `data-tl-theme` gehören zum Fundament |

## 7 · Was das für 5d und die Präsentation heißt

- **5d berührt es:** Der Umstieg auf `data-tl-theme` und der Abschied von den XML-Werten in `UIThemeService` sind
  Fundament. Den Fingerabdruck im Kopf von `tokens.css` kann 5d gleich mitbringen; er kostet einen Test und bricht
  nichts.
- **Präsentation v2, Folie 8:** heute „das Theme wird aus der Basisdatei neu gerechnet“. Mit A wird daraus: „bei jedem
  Update automatisch neu gerechnet, beim Bauen geprüft“. Mit C: „und ein Hinweis, wenn ein Theme zu einer älteren
  Version gehört“.
