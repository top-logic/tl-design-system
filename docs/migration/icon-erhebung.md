# Icon-Erhebung: Font Awesome und Bootstrap Icons in TopLogic, Abgleich mit Lucide

Stand: `origin/master` von tl-engine-7 (Commit `d4d9867579`, geholt am 17.11.2026). Nur gelesen, nichts ausgecheckt. Lucide: `lucide-static` **1.74.0** (2089 Icons plus Alias-Namen). Mitgeliefert: Font Awesome Free **6.7.1**, Bootstrap Icons (Modul `ext.com.bootstrap.icons`).

## Kopfzahlen

Gezählt sind „produktive“ Fundstellen: Java, TS/TSX/JS, CSS, HTML, XML (Themes, Views, Layouts, Modelle), `.properties`, JSON. Ausgenommen und getrennt ausgewiesen: die beiden Bibliotheks-Module selbst (`ext.com.fontawesome`, `ext.com.bootstrap.icons`), Tests (`src/test`, `*.test.*`), Design-System-Specimen (`tl-design-system/`), Doku (`*.md`, `webapp/doc/`) und das Migrationswerkzeug `IconReplacer.java`.

| Kennzahl | Font Awesome | Bootstrap Icons | zusammen |
|---|---:|---:|---:|
| eindeutige Glyphen (produktiv) | 258 | 233 | 491 |
| davon Lucide **exakt** (gleicher Name, inkl. Alias) | 117 | 70 | 187 (davon 27 nur über Lucide-Alias) |
| davon Lucide **sinngemäß** (anderer Name) | 121 | 128 | 249 |
| davon **unsicher** (Bedeutung weicht ab oder Zusatzmerkmal fehlt) | 15 | 32 | 47 |
| davon Lucide **keine** | 5 | 3 | 8 |
| Fundstellen (produktiv) | 679 | 737 | 1416 |
| davon in Konfiguration (XML/properties/JSON) | 519 | 609 | 1128 |
| davon in Code (Java/TS/JS/CSS/HTML) | 160 | 128 | 288 |
| davon in Demo-Modulen (`com.top_logic.demo*`) | 170 | 272 | 442 |
| davon in `theme-settings.xml` (Theme-Icon-Definitionen) | 332 | 3 | 335 |
| Fundstellen nach Lucide-Urteil (exakt / sinngemäß / unsicher / keine) | 386 / 266 / 20 / 7 | 242 / 427 / 63 / 5 | 628 / 693 / 83 / 12 |
| zusätzlich nur in Test / Specimen / Doku / Migrationswerkzeug | 348 Fundstellen, 35 Glyphen ohne produktive Nutzung | 603 Fundstellen, 133 Glyphen ohne produktive Nutzung | |

Von den 491 Glyphen kommen 382 auch außerhalb der Demo-Module vor, 109 nur in Demo-Modulen.

**Wichtigste Aussagen**

- Zwei Bibliotheken laufen parallel: Font Awesome dominiert Themes und Engine-Code (Schreibweise `css:fa-solid fa-…` und `css:fas fa-…`), Bootstrap Icons dominiert die neuen React-Views (`css:bi bi-…`, 548 Stellen in `*.view.xml`).
- Die meisten Fundstellen liegen in **Konfiguration**, nicht im Code. Jede dieser Stellen steht in Dateien, die Kundenprojekte in derselben Schreibweise nachbauen oder überlagern (Theme-Settings, Views, Layouts, Modelle).
- Dazu kommt ein drittes System, das nicht Gegenstand der Frage ist, aber beim Wechsel mitgedacht werden muss: der eigene Icon-Font `tl-icon` (`colored:tl-icon …`, ca. 295 Zeilen, 36 Theme-Definitionen, CSS in `com.top_logic.layout.icons/…/tl_iconFont.css`).
- Lucide ist reiner Outline-Satz, Zustandspaare über solid/regular (Abschnitt Zustände) haben dort kein direktes Gegenstück.
- Lucide hat keine Marken-Icons (hier: `dropbox`, bei `bi|git` nur das Branch-Symbol als Ersatz).

Lesehilfe zur Tabelle: *Stil* = bei Font Awesome der gefundene Stil (solid/regular/brands, `-` = in der Fundstelle nicht erkennbar), bei Bootstrap Icons `bi`. *Konfig (Demo)* = Fundstellen in Konfiguration, in Klammern die davon in Demo-Modulen. *Module* = Anzahl oberster Verzeichnisse mit Fundstellen. Modifier (`fa-solid`, `fa-regular`, `fa-brands`, `fas`, `far`, `fab`, `bi`) sind keine Glyphen und stehen unten; `fa-fw`, `fa-spin`, `fa-lg` u. ä. kommen als Klasse nicht vor (`spin` steht einmal in `css:app-working spin`, das ist ein eigenes Anwendungs-Icon).

## Tabelle der Glyphen (produktiv)

Sortiert nach Bibliothek und Fundstellen. Urteil: exakt / sinngemäß / unsicher / keine. Lucide-Namen sind gegen `lucide-static@1.74.0/icons/<name>.svg` geprüft (alle vorhanden). Steht „(= x)“ dabei, ist der Name ein Lucide-Alias und `x` der aktuelle Hauptname.

| Bib | Glyphe | Stil | Fundst. | Code | Konfig (Demo) | Module | Urteil | Lucide | Beispielpfade |
|---|---|---|---:|---:|---:|---:|---|---|---|
| fa | `user` | regular/solid | 18 | 4 | 14 (0) | 5 | exakt | `user` | `com.top_logic.contact/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:20`<br>`com.top_logic.layout.formeditor/src/main/webapp/WEB-INF/kbase/migration/tl-layout-formeditor/Ticket_27517_Refactoring_User_Management.migration.xml:455` |
| fa | `chevron-right` | solid+? | 16 | 9 | 7 (2) | 8 | exakt | `chevron-right` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:179`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:51` |
| fa | `plus` | solid | 15 | 6 | 9 (6) | 7 | exakt | `plus` | `com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:29`<br>`com.top_logic.layout.configedit/src/main/java/com/top_logic/layout/configedit/Icons.java:32` |
| fa | `check` | solid | 11 | 3 | 8 (3) | 6 | exakt | `check` | `com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:36` |
| fa | `chevron-left` | solid+? | 11 | 4 | 7 (3) | 7 | exakt | `chevron-left` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:182`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:126` |
| fa | `link` | solid | 11 | 5 | 6 (3) | 5 | exakt | `link` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:176`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:168` |
| fa | `rotate-left` | solid | 11 | 2 | 9 (1) | 4 | sinngemäß | `rotate-ccw` | `com.top_logic.layout.react.mui/react-src/adapters/MuiFormFieldAdapter.tsx:14`<br>`com.top_logic.layout.react/react-src/controls/TLFormField.tsx:21` |
| fa | `code` | solid | 10 | 4 | 6 (0) | 5 | exakt | `code` | `com.top_logic.bpe.modeler/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:8`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:165` |
| fa | `triangle-exclamation` | solid | 10 | 2 | 8 (5) | 3 | sinngemäß | `triangle-alert (= triangle-exclamation-point)` | `com.top_logic.layout.react/react-src/bridge/icons.ts:39`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:426` |
| fa | `circle-info` | solid | 9 | 1 | 8 (5) | 3 | sinngemäß | `info` | `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/common/Icons.java:20`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:849` |
| fa | `filter` | solid | 9 | 2 | 7 (2) | 4 | exakt | `filter (Alias von funnel)` | `com.top_logic.layout.react/react-src/bridge/icons.ts:72`<br>`com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:2558` |
| fa | `magnifying-glass` | solid | 9 | 3 | 6 (0) | 5 | sinngemäß | `search` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:17`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:60` |
| fa | `play` | solid | 9 | 1 | 8 (2) | 6 | exakt | `play` | `com.top_logic.bpe.app/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:11`<br>`com.top_logic.element/src/main/webapp/WEB-INF/model/tl.changelog.model.xml:38` |
| fa | `trash` | solid | 9 | 5 | 4 (0) | 6 | exakt | `trash` | `com.top_logic.bpe.modeler/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:23`<br>`com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:62` |
| fa | `bug` | solid | 8 | 2 | 6 (1) | 3 | exakt | `bug` | `com.top_logic.model.search/src/main/java/META-INF/messages_de.properties:1174`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:966` |
| fa | `lock` | solid | 8 | 1 | 7 (3) | 4 | exakt | `lock` | `com.top_logic.layout.formeditor/src/main/webapp/WEB-INF/layouts/admin/security/accounts/changePassword/dialog.layout.xml:22`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:21` |
| fa | `car-side` | solid | 7 | 3 | 4 (0) | 3 | sinngemäß | `car` | `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:2580`<br>`com.top_logic.model.search/src/main/java/META-INF/messages_de.properties:1417` |
| fa | `code-branch` | solid | 7 | 4 | 3 (3) | 2 | sinngemäß | `git-branch` | `tl-build_doclet/resources/templates/class-template.html:20`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/history/milestones/selectReportStatus/dialog.layout.xml:21` |
| fa | `edit` | solid | 7 | 6 | 1 (0) | 4 | exakt | `edit (Alias von square-pen)` | `com.top_logic.layout.configedit/src/main/java/com/top_logic/layout/configedit/IconSelectConfigProvider.java:20`<br>`com.top_logic.layout.react/react-src/state/control-state.ts:174` |
| fa | `save` | solid | 7 | 2 | 5 (1) | 5 | exakt | `save` | `com.top_logic.layout.configedit/src/main/java/com/top_logic/layout/configedit/Icons.java:26`<br>`com.top_logic.layout.scripting.template/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14` |
| fa | `terminal` | solid | 7 | 0 | 7 (0) | 3 | exakt | `terminal` | `com.top_logic.layout.formeditor/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1011` |
| fa | `upload` | solid | 7 | 1 | 6 (1) | 6 | exakt | `upload` | `com.top_logic.layout.react/react-src/bridge/icons.ts:93`<br>`com.top_logic.layout.scripting.template/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5` |
| fa | `chevron-down` | solid | 6 | 3 | 3 (0) | 3 | exakt | `chevron-down` | `com.top_logic.layout.react.mui/react-src/adapters/MuiMenuTriggerAdapter.tsx:8`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:54` |
| fa | `circle` | regular/solid | 6 | 1 | 5 (1) | 3 | exakt | `circle` | `com.top_logic.layout.react/react-src/bridge/icons.ts:105`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:990` |
| fa | `square` | regular | 6 | 0 | 6 (0) | 2 | exakt | `square` | `com.top_logic.graph.diagramjs.server/src/main/webapp/WEB-INF/layouts/com.top_logic.graph.diagramjs.server/modelGraph/modelGraph.layout.xml:112`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:846` |
| fa | `xmark` | solid | 6 | 4 | 2 (0) | 2 | sinngemäß | `x` | `com.top_logic.layout.react/react-src/bridge/icons.ts:27`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:813` |
| fa | `check-double` | solid | 5 | 0 | 5 (1) | 3 | sinngemäß | `check-check` | `com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:8`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:843` |
| fa | `download` | solid | 5 | 1 | 4 (0) | 5 | exakt | `download` | `com.top_logic.layout.react/react-src/bridge/icons.ts:96`<br>`com.top_logic.layout.scripting.template/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:8` |
| fa | `eye` | regular/solid | 5 | 2 | 3 (2) | 3 | exakt | `eye` | `com.top_logic.graph.diagramjs.server/src/main/webapp/WEB-INF/layouts/com.top_logic.graph.diagramjs.server/modelGraph/modelGraph.layout.xml:106`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:18` |
| fa | `file-circle-plus` | solid | 5 | 0 | 5 (0) | 2 | sinngemäß | `file-plus` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:20`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:561` |
| fa | `gear` | solid | 5 | 1 | 4 (2) | 4 | sinngemäß | `settings` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:75` |
| fa | `pen` | solid | 5 | 0 | 5 (3) | 3 | exakt | `pen` | `com.top_logic.bpe.modeler/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:11`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:678` |
| fa | `rotate-right` | solid | 5 | 0 | 5 (1) | 2 | sinngemäß | `rotate-cw` | `tl-ai-classic/src/main/webapp/WEB-INF/layouts/tl-ai-core/admin/agentSecurity/policyEditorView.xml:51`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/undoRedo/changeLogTable.layout.xml:55` |
| fa | `star` | regular/solid | 5 | 1 | 4 (3) | 3 | exakt | `star` | `com.top_logic.layout.react/react-src/bridge/ThemeIcon.tsx:21`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1665` |
| fa | `stop` | solid | 5 | 1 | 4 (2) | 3 | sinngemäß | `square` | `com.top_logic.layout.react/react-src/bridge/icons.ts:108`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1450` |
| fa | `user-group` | solid | 5 | 0 | 5 (0) | 2 | exakt | `user-group` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:672`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:318` |
| fa | `arrow-rotate-left` | solid | 4 | 1 | 3 (0) | 3 | sinngemäß | `rotate-ccw` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:11`<br>`com.top_logic.layout.react/react-src/bridge/icons.ts:177` |
| fa | `arrow-up-right-from-square` | solid | 4 | 2 | 2 (1) | 3 | exakt | `arrow-up-right-from-square (Alias von square-arrow-up-right-exit)` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:89`<br>`com.top_logic.layout.react/react-src/controls/TLPanel.tsx:27` |
| fa | `check-square` | regular | 4 | 0 | 4 (0) | 2 | exakt | `check-square (Alias von square-check-big)` | `com.top_logic.graph.diagramjs.server/src/main/webapp/WEB-INF/layouts/com.top_logic.graph.diagramjs.server/modelGraph/modelGraph.layout.xml:109`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1710` |
| fa | `circle-plus` | solid | 4 | 0 | 4 (2) | 3 | exakt | `circle-plus` | `com.top_logic.element/src/main/webapp/WEB-INF/model/tl.changelog.model.xml:14`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:696` |
| fa | `clock` | regular/solid | 4 | 0 | 4 (1) | 3 | exakt | `clock` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:11`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:465` |
| fa | `cog` | solid | 4 | 0 | 4 (4) | 1 | exakt | `cog` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/fallbackValues/editContext/dialog.layout.xml:19` |
| fa | `delete-left` | solid | 4 | 0 | 4 (2) | 3 | sinngemäß | `delete` | `com.top_logic.bpe.modeler/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1221` |
| fa | `exclamation-triangle` | solid | 4 | 2 | 2 (0) | 3 | sinngemäß | `triangle-alert (= triangle-exclamation-point)` | `com.top_logic.doc.app/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:4`<br>`com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/layout/Icons.java:20` |
| fa | `file` | regular/solid | 4 | 1 | 3 (1) | 4 | exakt | `file` | `com.top_logic.layout.react/react-src/bridge/icons.ts:99`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1656` |
| fa | `file-code` | solid | 4 | 1 | 3 (2) | 3 | exakt | `file-code` | `com.top_logic.layout.react/react-src/bridge/icons.ts:183`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:660` |
| fa | `frown` | regular | 4 | 0 | 4 (4) | 1 | exakt | `frown (Alias von face-slightly-frowning)` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dynamicColumns/developmentGrid/developmentGrid.layout.xml:94` |
| fa | `house` | solid | 4 | 0 | 4 (2) | 2 | exakt | `house` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:77`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:134` |
| fa | `meh` | regular | 4 | 0 | 4 (4) | 1 | exakt | `meh (Alias von face-neutral)` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dynamicColumns/developmentGrid/developmentGrid.layout.xml:95` |
| fa | `pause` | solid | 4 | 1 | 3 (0) | 2 | exakt | `pause` | `com.top_logic.layout.react/react-src/bridge/icons.ts:114`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:912` |
| fa | `plus-square` | regular/solid | 4 | 2 | 2 (1) | 3 | exakt | `plus-square (Alias von square-plus)` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1653`<br>`tl-build_doclet/resources/templates/index-template.html:19` |
| fa | `smile` | regular | 4 | 0 | 4 (4) | 1 | exakt | `smile (Alias von face-slightly-smiling)` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dynamicColumns/developmentGrid/developmentGrid.layout.xml:96` |
| fa | `tags` | solid | 4 | 2 | 2 (0) | 2 | exakt | `tags` | `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/tabbar/TabDefinition.java:106`<br>`com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:2292` |
| fa | `angles-down` | solid | 3 | 0 | 3 (0) | 1 | sinngemäß | `chevrons-down` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:173` |
| fa | `arrow-down` | solid | 3 | 2 | 1 (0) | 3 | exakt | `arrow-down` | `com.top_logic.layout.react/react-src/bridge/icons.ts:69`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:233` |
| fa | `arrow-right` | solid | 3 | 0 | 3 (2) | 2 | exakt | `arrow-right` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:753`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dropOn/processorTableGrid.layout.xml:67` |
| fa | `ban` | solid | 3 | 1 | 2 (0) | 3 | exakt | `ban` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`tl-ai-classic/src/main/java/com/top_logic/tl/ai/core/execution/layout/RequestCancelCommand.java:53` |
| fa | `bars` | solid | 3 | 1 | 2 (0) | 2 | sinngemäß | `menu` | `com.top_logic.layout.react/react-src/controls/TLDrawerToggle.tsx:9`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:197` |
| fa | `book` | solid | 3 | 0 | 3 (0) | 1 | exakt | `book` | `com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:11` |
| fa | `bookmark` | regular/solid | 3 | 2 | 1 (0) | 3 | exakt | `bookmark` | `com.top_logic.layout.react/react-src/bridge/icons.ts:78`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:594` |
| fa | `chart-pie` | solid | 3 | 0 | 3 (1) | 3 | exakt | `chart-pie` | `com.top_logic.reporting.flex/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1788` |
| fa | `circle-check` | solid | 3 | 2 | 1 (0) | 3 | exakt | `circle-check` | `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/common/Icons.java:24`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1510` |
| fa | `circle-question` | solid | 3 | 2 | 1 (0) | 2 | sinngemäß | `circle-question-mark` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1513`<br>`com.top_logic/src/main/java/com/top_logic/tool/boundsec/assistent/Icons.java:21` |
| fa | `clipboard` | solid | 3 | 0 | 3 (0) | 3 | exakt | `clipboard` | `com.top_logic.bpe.app/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:765` |
| fa | `copy` | regular/solid | 3 | 1 | 2 (1) | 3 | exakt | `copy` | `com.top_logic.layout.react/react-src/bridge/icons.ts:33`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:699` |
| fa | `dot-circle` | regular/solid | 3 | 0 | 3 (2) | 2 | sinngemäß | `circle-dot` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1659`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/toggleButton/contextTreeTree.layout.xml:25` |
| fa | `envelope` | solid | 3 | 0 | 3 (1) | 3 | sinngemäß | `mail` | `com.top_logic.addons.loginmessages/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:8`<br>`com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:17` |
| fa | `external-link-alt` | solid | 3 | 0 | 3 (0) | 3 | sinngemäß | `external-link` | `com.top_logic.doc.app/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:7`<br>`com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:20` |
| fa | `file-arrow-up` | solid | 3 | 0 | 3 (0) | 3 | sinngemäß | `file-up` | `com.top_logic.bpe.modeler/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:17`<br>`com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:158` |
| fa | `floppy-disk` | solid | 3 | 1 | 2 (0) | 3 | sinngemäß | `save` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:95`<br>`com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/button/Icons.java:23` |
| fa | `globe` | solid | 3 | 1 | 2 (1) | 3 | exakt | `globe` | `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/form/I18NEditorDialog.java:158`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:723` |
| fa | `language` | solid | 3 | 1 | 2 (0) | 3 | sinngemäß | `languages` | `com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14`<br>`com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/form/I18NEditorDialog.java:343` |
| fa | `notdef` | solid | 3 | 0 | 3 (0) | 1 | keine | — | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1713` |
| fa | `rotate` | solid | 3 | 0 | 3 (0) | 2 | sinngemäß | `rotate-cw` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:555`<br>`tl-security-selfservice/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:8` |
| fa | `square-check` | solid | 3 | 0 | 3 (0) | 1 | exakt | `square-check` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:185` |
| fa | `sync` | solid | 3 | 0 | 3 (3) | 1 | sinngemäß | `refresh-cw` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dynamicColumns/developmentTreeGrid/developmentTreeGrid.layout.xml:126` |
| fa | `times` | solid | 3 | 2 | 1 (1) | 3 | sinngemäß | `x` | `com.top_logic.layout.configedit/src/main/java/com/top_logic/layout/configedit/Icons.java:29`<br>`com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/form/Icons.java:26` |
| fa | `trash-alt` | solid | 3 | 1 | 2 (3) | 1 | sinngemäß | `trash-2 (= trash)` | `com.top_logic.demo/src/main/java/com/top_logic/demo/layout/form/demo/TestControlsForm.java:732` |
| fa | `user-gear` | solid | 3 | 0 | 3 (0) | 3 | sinngemäß | `user-cog` | `com.top_logic.contact/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:17`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:936` |
| fa | `user-lock` | solid | 3 | 0 | 3 (2) | 2 | exakt | `user-lock` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:618`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:146` |
| fa | `window-maximize` | regular/solid | 3 | 3 | 0 (0) | 2 | sinngemäß | `maximize` | `com.top_logic.layout.react/react-src/bridge/icons.ts:84`<br>`com.top_logic/src/main/java/com/top_logic/layout/Icons.java:137` |
| fa | `angle-up` | solid | 2 | 2 | 0 (0) | 1 | sinngemäß | `chevron-up` | `tl-build_doclet/resources/templates/class-template.html:250` |
| fa | `angles-up` | solid | 2 | 0 | 2 (0) | 1 | sinngemäß | `chevrons-up` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:801` |
| fa | `arrow-left` | solid | 2 | 0 | 2 (1) | 2 | exakt | `arrow-left` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:747`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dropOn/detailsForm.layout.xml:16` |
| fa | `arrow-right-from-bracket` | solid | 2 | 0 | 2 (0) | 1 | sinngemäß | `log-out` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:972` |
| fa | `arrow-rotate-right` | solid | 2 | 1 | 1 (0) | 2 | sinngemäß | `rotate-cw` | `com.top_logic.layout.react/react-src/bridge/icons.ts:180`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:999` |
| fa | `arrow-up` | solid | 2 | 1 | 1 (0) | 2 | exakt | `arrow-up` | `com.top_logic.layout.react/react-src/bridge/icons.ts:66`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:236` |
| fa | `arrows-left-right` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `move-horizontal` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:170`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1224` |
| fa | `arrows-rotate` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `refresh-cw` | `com.top_logic.graph.diagramjs.server/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:726` |
| fa | `book-open` | solid | 2 | 0 | 2 (0) | 2 | exakt | `book-open` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:83`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:978` |
| fa | `briefcase` | solid | 2 | 0 | 2 (1) | 2 | exakt | `briefcase` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:669`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:59` |
| fa | `calendar-alt` | regular/solid | 2 | 0 | 2 (1) | 2 | sinngemäß | `calendar-days` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1668`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:68` |
| fa | `camera` | solid | 2 | 1 | 1 (1) | 2 | exakt | `camera` | `com.top_logic.layout.react/react-src/bridge/icons.ts:117`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/tabellenUndBaeume/versionSelector.layout.xml:25` |
| fa | `chevron-up` | solid | 2 | 1 | 1 (0) | 2 | exakt | `chevron-up` | `com.top_logic.layout.react/react-src/bridge/icons.ts:57`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1131` |
| fa | `cloud-download-alt` | solid | 2 | 0 | 2 (0) | 1 | sinngemäß | `cloud-download` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1749` |
| fa | `cube` | solid | 2 | 0 | 2 (2) | 1 | sinngemäß | `box` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/containmentContext/newThing/dialog.layout.xml:16` |
| fa | `desktop` | solid | 2 | 0 | 2 (2) | 1 | sinngemäß | `monitor` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:158` |
| fa | `diagram-project` | solid | 2 | 0 | 2 (1) | 2 | sinngemäß | `network` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:882`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/tabLayout.layout.xml:9` |
| fa | `ellipsis-h` | solid | 2 | 2 | 0 (0) | 1 | sinngemäß | `ellipsis` | `tl-build_doclet/resources/templates/class-template.html:249` |
| fa | `eye-slash` | regular/solid | 2 | 1 | 1 (0) | 2 | sinngemäß | `eye-off` | `com.top_logic.layout.react/react-src/bridge/icons.ts:15`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1722` |
| fa | `file-arrow-down` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `file-down` | `com.top_logic.bpe.modeler/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:621` |
| fa | `file-import` | solid | 2 | 0 | 2 (1) | 2 | sinngemäß | `file-input` | `com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:26`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dragAndDrop/importLibraryScriptDialog.layout.xml:20` |
| fa | `file-lines` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `file-text` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:951`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:363` |
| fa | `file-pdf` | solid | 2 | 0 | 2 (1) | 2 | unsicher | `file-text` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:639`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/products/constructionPlan/constructionPlanChart.layout.xml:137` |
| fa | `file-zipper` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `file-archive` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:657`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:360` |
| fa | `filter-circle-xmark` | solid | 2 | 0 | 2 (0) | 1 | sinngemäß | `funnel-x` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:224` |
| fa | `folder-open` | regular/solid | 2 | 0 | 2 (1) | 2 | exakt | `folder-open` | `com.top_logic.layout.scripting.template/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:11`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/documentManagement/contexts/webfolder/tileLayout.layout.xml:16` |
| fa | `folder-plus` | solid | 2 | 0 | 2 (0) | 2 | exakt | `folder-plus` | `com.top_logic.doc/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:17`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:984` |
| fa | `font` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `type` | `com.top_logic.layout.themeedit/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:906` |
| fa | `globe-americas` | solid | 2 | 0 | 2 (2) | 1 | sinngemäß | `globe` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/containmentContext/newWorld/dialog.layout.xml:22` |
| fa | `heading` | solid | 2 | 1 | 1 (0) | 2 | exakt | `heading (Alias von letter-h)` | `com.top_logic.layout.react/react-src/bridge/icons.ts:153`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1707` |
| fa | `home` | solid | 2 | 2 | 0 (0) | 1 | exakt | `home (Alias von house)` | `com.top_logic.layout.react/react-src/bridge/ThemeIcon.tsx:20` |
| fa | `image` | regular/solid | 2 | 1 | 1 (0) | 2 | exakt | `image` | `com.top_logic.layout.react/react-src/bridge/icons.ts:171`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:315` |
| fa | `industry` | solid | 2 | 0 | 2 (1) | 2 | sinngemäß | `factory` | `com.top_logic.contact/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/model/test.dnd.model.xml:75` |
| fa | `key` | solid | 2 | 0 | 2 (2) | 1 | exakt | `key` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:149` |
| fa | `layer-group` | solid | 2 | 1 | 1 (1) | 2 | sinngemäß | `layers` | `com.top_logic.layout.react/react-src/bridge/icons.ts:63`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/model/test.dnd.model.xml:98` |
| fa | `minus` | solid | 2 | 0 | 2 (0) | 1 | exakt | `minus` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:251` |
| fa | `minus-square` | regular | 2 | 2 | 0 (0) | 1 | exakt | `minus-square (Alias von square-minus)` | `tl-build_doclet/resources/templates/index-template.html:20` |
| fa | `paintbrush` | solid | 2 | 0 | 2 (0) | 1 | exakt | `paintbrush` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1212` |
| fa | `pencil-alt` | solid | 2 | 0 | 2 (2) | 1 | sinngemäß | `pencil` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/reports/edit/dialog.layout.xml:17` |
| fa | `print` | solid | 2 | 1 | 1 (1) | 2 | sinngemäß | `printer` | `com.top_logic.layout.react/react-src/bridge/icons.ts:123`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/pDFExport/snapshotsTable.layout.xml:25` |
| fa | `project-diagram` | solid | 2 | 0 | 2 (2) | 1 | sinngemäß | `network` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:98` |
| fa | `qrcode` | solid | 2 | 0 | 2 (1) | 2 | sinngemäß | `qr-code` | `com.top_logic.bpe.app/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:101` |
| fa | `question` | solid | 2 | 0 | 2 (0) | 2 | unsicher | `circle-question-mark` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:29`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1914` |
| fa | `search` | solid | 2 | 2 | 0 (0) | 1 | exakt | `search` | `tl-build_doclet/resources/templates/search-template.html:5` |
| fa | `sitemap` | solid | 2 | 0 | 2 (1) | 2 | sinngemäß | `network` | `com.top_logic.contact/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14`<br>`com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/products/assemblies/tileLayout.layout.xml:16` |
| fa | `sort` | solid | 2 | 0 | 2 (0) | 1 | sinngemäß | `arrow-up-down` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:230` |
| fa | `square-minus` | regular | 2 | 0 | 2 (0) | 1 | exakt | `square-minus` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1294` |
| fa | `square-pen` | solid | 2 | 0 | 2 (0) | 2 | exakt | `square-pen` | `com.top_logic.bpe.app/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:8`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:149` |
| fa | `square-xmark` | solid | 2 | 0 | 2 (0) | 1 | sinngemäß | `square-x` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:543` |
| fa | `stopwatch` | solid | 2 | 0 | 2 (2) | 1 | sinngemäß | `timer` | `com.top_logic.demo/src/main/webapp/WEB-INF/model/DemoTypes.model.xml:215` |
| fa | `table` | solid | 2 | 1 | 1 (0) | 2 | exakt | `table` | `com.top_logic.layout.react/react-src/bridge/icons.ts:174`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:375` |
| fa | `table-columns` | solid | 2 | 0 | 2 (0) | 1 | sinngemäß | `columns-2` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:152` |
| fa | `table-list` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `table-properties` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:167`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:666` |
| fa | `tools` | solid | 2 | 0 | 2 (2) | 1 | unsicher | `wrench` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:155` |
| fa | `trash-can` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `trash-2 (= trash)` | `com.top_logic.element/src/main/webapp/WEB-INF/model/tl.changelog.model.xml:19`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:143` |
| fa | `up-right-from-square` | solid | 2 | 0 | 2 (0) | 2 | sinngemäß | `external-link` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:735`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:342` |
| fa | `user-plus` | solid | 2 | 0 | 2 (0) | 2 | exakt | `user-plus` | `com.top_logic.layout.formeditor/src/main/webapp/WEB-INF/layouts/admin/security/accounts/newAccount2/dialog.layout.xml:18`<br>`tl-security-selfservice/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5` |
| fa | `users` | solid | 2 | 0 | 2 (2) | 1 | exakt | `users` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:143` |
| fa | `users-cog` | solid | 2 | 0 | 2 (2) | 1 | unsicher | `users` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:152` |
| fa | `window-restore` | regular/solid | 2 | 2 | 0 (0) | 1 | unsicher | `copy` | `com.top_logic.layout.react/react-src/bridge/icons.ts:87` |
| fa | `angle-right` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `chevron-right` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/transientObjects/settingsForm.layout.xml:82` |
| fa | `angles-left` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `chevrons-left` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:771` |
| fa | `angles-right` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `chevrons-right` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1164` |
| fa | `arrow-right-arrow-left` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `arrow-left-right` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:732` |
| fa | `arrow-right-to-bracket` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `log-in` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:975` |
| fa | `arrows-spin` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `refresh-cw` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1965` |
| fa | `backward` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `rewind` | `com.top_logic.addons.loginmessages/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14` |
| fa | `beer` | solid | 1 | 0 | 1 (1) | 1 | exakt | `beer` | `com.top_logic.demo/src/main/webapp/WEB-INF/model/DemoTypes.model.xml:224` |
| fa | `binoculars` | solid | 1 | 0 | 1 (0) | 1 | exakt | `binoculars` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:59` |
| fa | `bold` | solid | 1 | 1 | 0 (0) | 1 | exakt | `bold (Alias von letter-b)` | `com.top_logic.layout.react/react-src/bridge/icons.ts:138` |
| fa | `bolt` | solid | 1 | 0 | 1 (0) | 1 | exakt | `bolt` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:8` |
| fa | `border-all` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `grid-2x2` | `com.top_logic/src/main/java/com/top_logic/layout/Icons.java:113` |
| fa | `broom` | solid | 1 | 0 | 1 (1) | 1 | exakt | `broom` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:62` |
| fa | `bullseye` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `target` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:164` |
| fa | `calendar` | solid | 1 | 0 | 1 (0) | 1 | exakt | `calendar` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:462` |
| fa | `calendar-check` | solid | 1 | 0 | 1 (0) | 1 | exakt | `calendar-check` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:498` |
| fa | `car` | solid | 1 | 0 | 1 (1) | 1 | exakt | `car` | `com.top_logic.demo/src/main/webapp/WEB-INF/model/test.tiles.model.xml:28` |
| fa | `caret-up` | solid | 1 | 0 | 1 (0) | 1 | unsicher | `chevron-up` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1149` |
| fa | `chart-column` | solid | 1 | 0 | 1 (0) | 1 | exakt | `chart-column` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:675` |
| fa | `chart-gantt` | solid | 1 | 0 | 1 (0) | 1 | exakt | `chart-gantt` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:939` |
| fa | `chart-simple` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `chart-column` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:957` |
| fa | `circle-exclamation` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `circle-alert (= circle-exclamation-point)` | `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/common/Icons.java:32` |
| fa | `circle-stop` | solid | 1 | 0 | 1 (0) | 1 | exakt | `circle-stop` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:173` |
| fa | `circle-xmark` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `circle-x` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1501` |
| fa | `clock-rotate-left` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `history (= rotate-ccw-clock)` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:744` |
| fa | `clone` | regular | 1 | 0 | 1 (1) | 1 | sinngemäß | `copy` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/transaction/inputDialog.layout.xml:22` |
| fa | `cloud-upload-alt` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `cloud-upload` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:65` |
| fa | `columns` | solid | 1 | 1 | 0 (0) | 1 | exakt | `columns (Alias von columns-2)` | `com.top_logic/src/main/java/com/top_logic/layout/Icons.java:131` |
| fa | `comment` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `message-square` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:74` |
| fa | `comment-alt` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `message-square` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dialogs/dialogForTestingDeclarationOfButtonsOnDialog/dialog.layout.xml:16` |
| fa | `compress` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `shrink` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:257` |
| fa | `computer-mouse` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `mouse` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/tabellenUndBaeume/tabelle/kinderTable.layout.xml:77` |
| fa | `cubes` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `boxes` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/blocks/tabLayout.layout.xml:10` |
| fa | `cubes-stacked` | solid | 1 | 0 | 1 (1) | 1 | unsicher | `boxes` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/products/series/tileLayout.layout.xml:16` |
| fa | `database` | solid | 1 | 0 | 1 (0) | 1 | exakt | `database` | `tl-model-search-classic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5` |
| fa | `dolly` | solid | 1 | 0 | 1 (1) | 1 | keine | — | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:77` |
| fa | `down-left-and-up-right-to-center` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `minimize-2` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:492` |
| fa | `dropbox` | brands | 1 | 0 | 1 (0) | 1 | keine | — | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:14` |
| fa | `equals` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `equal` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:585` |
| fa | `eraser` | solid | 1 | 0 | 1 (1) | 1 | exakt | `eraser` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/transientObjects/settingsForm.layout.xml:36` |
| fa | `exclamation` | solid | 1 | 0 | 1 (0) | 1 | unsicher | `circle-alert (= circle-exclamation-point)` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:20` |
| fa | `expand` | solid | 1 | 0 | 1 (0) | 1 | exakt | `expand` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:248` |
| fa | `external-link-square-alt` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `square-arrow-out-up-right (= square-arrow-up-right-exit)` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1692` |
| fa | `file-download` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `file-down` | `com.top_logic.layout.scripting.template/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:20` |
| fa | `file-excel` | regular | 1 | 0 | 1 (0) | 1 | sinngemäß | `file-spreadsheet` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:627` |
| fa | `file-powerpoint` | solid | 1 | 0 | 1 (0) | 1 | unsicher | `presentation` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:645` |
| fa | `file-word` | solid | 1 | 0 | 1 (0) | 1 | unsicher | `file-text` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:651` |
| fa | `fill` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `paint-bucket` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/hTMLTemplates/tanksForm.layout.xml:381` |
| fa | `forward` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `fast-forward` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:576` |
| fa | `grip-vertical` | solid | 1 | 1 | 0 (0) | 1 | exakt | `grip-vertical` | `com.top_logic.layout.react/react-src/bridge/icons.ts:12` |
| fa | `handshake` | solid | 1 | 0 | 1 (1) | 1 | exakt | `handshake` | `com.top_logic.demo/src/main/webapp/WEB-INF/model/DemoTypes.model.xml:1441` |
| fa | `hashtag` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `hash` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:567` |
| fa | `hourglass-start` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `hourglass` | `com.top_logic.kafka.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:5` |
| fa | `icons` | solid | 1 | 1 | 0 (0) | 1 | unsicher | `shapes` | `com.top_logic.layout.react/react-src/bridge/icons.ts:90` |
| fa | `id-badge` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `id-card` | `com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:351` |
| fa | `info` | solid | 1 | 0 | 1 (1) | 1 | exakt | `info` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/dialogs/dialogForTestingDeclarationOfButtonsOnDialog/dialog.layout.xml:26` |
| fa | `info-circle` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `info` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/form/Icons.java:29` |
| fa | `italic` | solid | 1 | 1 | 0 (0) | 1 | exakt | `italic` | `com.top_logic.layout.react/react-src/bridge/icons.ts:141` |
| fa | `keyboard` | solid | 1 | 0 | 1 (0) | 1 | exakt | `keyboard` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:263` |
| fa | `laptop` | solid | 1 | 0 | 1 (1) | 1 | exakt | `laptop` | `com.top_logic.demo/src/main/webapp/WEB-INF/model/test.dnd.model.xml:116` |
| fa | `leave` | solid | 1 | 0 | 1 (1) | 1 | keine | — | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:86` |
| fa | `left-right` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `arrow-left-right` | `com.top_logic.layout.react/react-src/bridge/icons.ts:120` |
| fa | `list` | solid | 1 | 0 | 1 (0) | 1 | exakt | `list` | `com.top_logic.monitoring/src/main/webapp/WEB-INF/layouts/com.top_logic.monitoring/admin/technical/logs/logLines.sessionDialog.layout.xml:19` |
| fa | `list-alt` | regular | 1 | 0 | 1 (0) | 1 | sinngemäß | `layout-list` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1686` |
| fa | `list-ol` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `list-ordered` | `com.top_logic.layout.react/react-src/bridge/icons.ts:159` |
| fa | `list-ul` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `list` | `com.top_logic.layout.react/react-src/bridge/icons.ts:156` |
| fa | `lock-open` | solid | 1 | 1 | 0 (0) | 1 | exakt | `lock-open` | `com.top_logic.layout.react/react-src/bridge/icons.ts:24` |
| fa | `message` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `message-square` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1408` |
| fa | `moon` | solid | 1 | 1 | 0 (0) | 1 | exakt | `moon` | `com.top_logic/src/main/webapp/script/mdtimepicker.js:68` |
| fa | `network-wired` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `network` | `com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:345` |
| fa | `paperclip` | solid | 1 | 1 | 0 (0) | 1 | exakt | `paperclip` | `com.top_logic.layout.react/react-src/bridge/icons.ts:102` |
| fa | `parachute-box` | solid | 1 | 0 | 1 (1) | 1 | unsicher | `package` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:89` |
| fa | `paragraph` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `pilcrow` | `com.top_logic.layout.react/react-src/bridge/icons.ts:150` |
| fa | `paste` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `clipboard-paste` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:552` |
| fa | `pen-to-square` | regular | 1 | 1 | 0 (0) | 1 | sinngemäß | `square-pen` | `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/form/Icons.java:23` |
| fa | `pencil` | solid | 1 | 0 | 1 (0) | 1 | exakt | `pencil` | `com.top_logic.element/src/main/webapp/WEB-INF/model/tl.changelog.model.xml:24` |
| fa | `phone` | solid | 1 | 0 | 1 (0) | 1 | exakt | `phone` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:23` |
| fa | `piggy-bank` | solid | 1 | 0 | 1 (1) | 1 | exakt | `piggy-bank` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:95` |
| fa | `poll-h` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `chart-bar` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:26` |
| fa | `question-circle` | regular | 1 | 0 | 1 (1) | 1 | sinngemäß | `circle-question-mark` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/history/reports/projectDetails/dialog.layout.xml:22` |
| fa | `quote-left` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `quote` | `com.top_logic.layout.react/react-src/bridge/icons.ts:162` |
| fa | `rectangle-list` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `layout-list` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:155` |
| fa | `repeat` | solid | 1 | 0 | 1 (0) | 1 | exakt | `repeat` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1002` |
| fa | `right-left` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `arrow-left-right` | `com.top_logic.model.search/src/main/webapp/WEB-INF/layouts/admin/myLatestChanges/dialog.layout.xml:26` |
| fa | `running` | solid | 1 | 0 | 1 (0) | 1 | keine | — | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1962` |
| fa | `scissors` | solid | 1 | 0 | 1 (0) | 1 | exakt | `scissors` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1549` |
| fa | `search-plus` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `zoom-in` | `com.top_logic.demo/src/main/webapp/WEB-INF/model/DemoTypes.model.xml:1058` |
| fa | `seedling` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `sprout` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:107` |
| fa | `server` | solid | 1 | 0 | 1 (0) | 1 | exakt | `server` | `com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:348` |
| fa | `shapes` | solid | 1 | 0 | 1 (1) | 1 | exakt | `shapes` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/productsContextList.layout.xml:25` |
| fa | `share` | solid | 1 | 0 | 1 (0) | 1 | unsicher | `share` | `tl-security-selfservice/src/main/webapp/WEB-INF/layouts/admin/security/accounts/existingInvitations/invitationsGrid.layout.xml:46` |
| fa | `shield` | solid | 1 | 0 | 1 (0) | 1 | exakt | `shield` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:59` |
| fa | `shield-halved` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `shield-half` | `com.top_logic.demo/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:110` |
| fa | `sign-out-alt` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `log-out` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/hTMLTemplates/tanksForm.layout.xml:398` |
| fa | `square-caret-right` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `square-chevron-right` | `com.top_logic.bpe.modeler/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:20` |
| fa | `square-plus` | solid | 1 | 0 | 1 (0) | 1 | exakt | `square-plus` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:429` |
| fa | `stamp` | solid | 1 | 0 | 1 (0) | 1 | exakt | `stamp` | `com.top_logic.element/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:161` |
| fa | `step-forward` | solid | 1 | 0 | 1 (1) | 1 | exakt | `step-forward` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/history/milestones/milestonesGrid.layout.xml:62` |
| fa | `stop-circle` | solid | 1 | 0 | 1 (0) | 1 | exakt | `stop-circle (Alias von circle-stop)` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:32` |
| fa | `strikethrough` | solid | 1 | 1 | 0 (0) | 1 | exakt | `strikethrough` | `com.top_logic.layout.react/react-src/bridge/icons.ts:147` |
| fa | `sun` | solid | 1 | 1 | 0 (0) | 1 | exakt | `sun` | `com.top_logic/src/main/webapp/script/mdtimepicker.js:67` |
| fa | `tablet` | solid | 1 | 0 | 1 (0) | 1 | exakt | `tablet` | `com.top_logic.bpe.app/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:17` |
| fa | `th-large` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `layout-grid` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/Icons.java:20` |
| fa | `toggle-off` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `toggle-left` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/toggleButton/contextTreeTree.layout.xml:77` |
| fa | `toggle-on` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `toggle-right` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/toggleButton/contextTreeTree.layout.xml:75` |
| fa | `trowel-bricks` | solid | 1 | 0 | 1 (1) | 1 | unsicher | `brick-wall` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/products/constructionPlan/tileLayout.layout.xml:16` |
| fa | `turn-down` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `corner-right-down` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/products/constructionPlan/addPart/dialog.layout.xml:46` |
| fa | `turn-up` | solid | 1 | 0 | 1 (1) | 1 | sinngemäß | `corner-right-up` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/flowchart1/products/constructionPlan/createUsage/dialog.layout.xml:16` |
| fa | `underline` | solid | 1 | 1 | 0 (0) | 1 | exakt | `underline` | `com.top_logic.layout.react/react-src/bridge/icons.ts:144` |
| fa | `undo` | solid | 1 | 0 | 1 (0) | 1 | exakt | `undo` | `com.top_logic.bpe/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:35` |
| fa | `unlock` | solid | 1 | 0 | 1 (0) | 1 | exakt | `unlock (Alias von lock-open)` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1626` |
| fa | `up-right-and-down-left-from-center` | solid | 1 | 0 | 1 (0) | 1 | sinngemäß | `maximize-2` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:489` |
| fa | `user-shield` | solid | 1 | 0 | 1 (1) | 1 | exakt | `user-shield` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/structure/demoTypes/detail/editStructureDetail.xml:86` |
| fa | `wind` | solid | 1 | 0 | 1 (1) | 1 | exakt | `wind` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/hTMLTemplates/xmasForm.layout.xml:18` |
| fa | `window-close` | regular | 1 | 0 | 1 (1) | 1 | unsicher | `square-x` | `com.top_logic.demo/src/main/webapp/WEB-INF/layouts/com.top_logic.demo/technical/components/generalForms/createFormForm.layout.xml:37` |
| fa | `window-minimize` | solid | 1 | 1 | 0 (0) | 1 | sinngemäß | `minimize` | `com.top_logic.layout.react/react-src/controls/TLPanel.tsx:18` |
| fa | `wrench` | solid | 1 | 0 | 1 (0) | 1 | exakt | `wrench` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1689` |
| bi | `x-lg` | bi | 66 | 0 | 66 (18) | 12 | sinngemäß | `x` | `com.top_logic.addons.loginmessages.view/src/main/webapp/WEB-INF/views/admin/system/login-messages/create-login-message.view.xml:55`<br>`com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/copy-workflow.view.xml:73` |
| bi | `check-lg` | bi | 49 | 0 | 49 (16) | 12 | sinngemäß | `check` | `com.top_logic.addons.loginmessages.view/src/main/webapp/WEB-INF/views/admin/system/login-messages/create-login-message.view.xml:27`<br>`com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/copy-workflow.view.xml:45` |
| bi | `plus-lg` | bi | 41 | 0 | 41 (24) | 14 | sinngemäß | `plus` | `com.top_logic.addons.loginmessages.view/src/main/webapp/WEB-INF/views/admin/system/login-messages/login-messages.view.xml:32`<br>`com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:57` |
| bi | `trash` | bi | 41 | 0 | 41 (22) | 11 | exakt | `trash` | `com.top_logic.addons.loginmessages.view/src/main/webapp/WEB-INF/views/admin/system/login-messages/login-messages.view.xml:77`<br>`com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:233` |
| bi | `arrow-clockwise` | bi | 20 | 0 | 20 (0) | 3 | sinngemäß | `rotate-cw` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:85`<br>`com.top_logic.monitoring.view/src/main/webapp/WEB-INF/views/admin/monitoring/memory.view.xml:25` |
| bi | `key` | bi | 15 | 2 | 13 (0) | 4 | exakt | `key` | `com.top_logic.layout.view.agent/src/main/webapp/WEB-INF/views/agent-access-create.view.xml:33`<br>`com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:3307` |
| bi | `pencil` | bi | 15 | 0 | 15 (10) | 5 | exakt | `pencil` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:278`<br>`com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:447` |
| bi | `arrow-left` | bi | 10 | 1 | 9 (4) | 2 | exakt | `arrow-left` | `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:1555`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tiles-demo/overview.view.xml:32` |
| bi | `gear` | bi | 9 | 2 | 7 (0) | 1 | sinngemäß | `settings` | `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:2409` |
| bi | `chevron-right` | bi | 8 | 2 | 6 (3) | 3 | exakt | `chevron-right` | `com.top_logic.layout.react/react-src/controls/TLIcon.tsx:9`<br>`com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:2447` |
| bi | `speedometer2` | bi | 8 | 4 | 4 (0) | 2 | sinngemäß | `gauge` | `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/sidebar/NavigationItem.java:49`<br>`com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:2138` |
| bi | `stars` | bi | 8 | 2 | 6 (1) | 2 | exakt | `stars (Alias von sparkles)` | `tl-chat/src/main/java/META-INF/messages_de.properties:271`<br>`tl-ai-demo/src/main/webapp/WEB-INF/views/app.view.xml:193` |
| bi | `table` | bi | 8 | 4 | 4 (1) | 5 | exakt | `table` | `com.top_logic.basic/src/main/java/META-INF/messages_de.properties:636`<br>`com.top_logic.dev.tools/src/main/webapp/WEB-INF/views/admin/model/model-editor.view.xml:448` |
| bi | `list-check` | bi | 7 | 2 | 5 (1) | 3 | exakt | `list-check` | `tl-chat-classic/src/main/webapp/WEB-INF/views/tl-chat-classic/chat.view.xml:199`<br>`tl-chat/src/main/java/META-INF/messages_de.properties:314` |
| bi | `arrow-counterclockwise` | bi | 6 | 0 | 6 (1) | 3 | sinngemäß | `rotate-ccw` | `com.top_logic.addons.loginmessages.view/src/main/webapp/WEB-INF/views/admin/system/login-messages/login-messages.view.xml:55`<br>`com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/scheduler/overview.view.xml:170` |
| bi | `arrow-repeat` | bi | 6 | 0 | 6 (1) | 2 | sinngemäß | `refresh-cw` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:103`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/pdf-demo.view.xml:176` |
| bi | `diagram-3` | bi | 6 | 2 | 4 (3) | 4 | unsicher | `network` | `com.top_logic.bpe.view/src/main/java/com/top_logic/bpe/view/BpmnEditorElement.java:73`<br>`com.top_logic.dev.tools/src/main/webapp/WEB-INF/views/admin/model/model-editor.view.xml:139` |
| bi | `info-circle` | bi | 6 | 2 | 4 (4) | 3 | sinngemäß | `info` | `com.top_logic.layout.react/react-src/bridge/field-explanation.tsx:15`<br>`com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AlertElement.java:114` |
| bi | `pencil-square` | bi | 6 | 0 | 6 (5) | 2 | sinngemäß | `square-pen` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/sql-console.view.xml:108`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/attributes.view.xml:703` |
| bi | `unlock` | bi | 6 | 0 | 6 (0) | 1 | exakt | `unlock (Alias von lock-open)` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:287` |
| bi | `x-circle` | bi | 6 | 0 | 6 (0) | 4 | exakt | `x-circle (Alias von circle-x)` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:157`<br>`com.top_logic.layout.view.selfservice/src/main/webapp/WEB-INF/views/admin/access-control/invitations.view.xml:83` |
| bi | `box-arrow-right` | bi | 5 | 2 | 3 (0) | 1 | sinngemäß | `log-out` | `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:2501` |
| bi | `check-circle` | bi | 5 | 1 | 4 (4) | 2 | exakt | `check-circle (Alias von circle-check-big)` | `com.top_logic.element/src/main/java/com/top_logic/element/boundsec/manager/coverage/CoverageStatusResourceProvider.java:21`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/model/test.constraints.model.xml:21` |
| bi | `diagram-2` | bi | 5 | 1 | 4 (3) | 2 | unsicher | `network` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/designer/Icons.java:32`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:129` |
| bi | `exclamation-triangle` | bi | 5 | 2 | 3 (3) | 4 | sinngemäß | `triangle-alert (= triangle-exclamation-point)` | `com.top_logic.element/src/main/java/com/top_logic/element/boundsec/manager/coverage/CoverageStatusResourceProvider.java:24`<br>`com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/designer/Icons.java:38` |
| bi | `hourglass-split` | bi | 5 | 1 | 4 (3) | 2 | sinngemäß | `hourglass` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/JobStatusElement.java:61`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:417` |
| bi | `list-ul` | bi | 5 | 1 | 4 (2) | 2 | sinngemäß | `list` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/list/ObjectListElement.java:220`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/board.view.xml:104` |
| bi | `person-check` | bi | 5 | 0 | 5 (0) | 2 | sinngemäß | `user-check` | `com.top_logic.layout.view.selfservice/src/main/webapp/WEB-INF/views/admin/access-control/accounts.view.xml:16`<br>`tl-security-selfservice/src/main/webapp/WEB-INF/layouts/admin/security/accounts/accountsTable.layout.overlay.xml:13` |
| bi | `play` | bi | 5 | 0 | 5 (0) | 1 | exakt | `play` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/monitoring/sql-monitor.view.xml:25` |
| bi | `play-fill` | bi | 5 | 0 | 5 (3) | 4 | sinngemäß | `play` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/script-recorder.view.xml:67`<br>`com.top_logic.model.search.react/src/main/webapp/WEB-INF/views/admin/development/script-console.view.xml:24` |
| bi | `upload` | bi | 5 | 0 | 5 (2) | 4 | exakt | `upload` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:76`<br>`com.top_logic.dev.tools/src/main/webapp/WEB-INF/views/admin/model/model-editor.view.xml:492` |
| bi | `window-stack` | bi | 5 | 1 | 4 (3) | 3 | unsicher | `square-stack` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/WindowElement.java:79`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:117` |
| bi | `box` | bi | 4 | 2 | 2 (2) | 2 | exakt | `box` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/UIElement.java:35`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/flow-diagram-demo.view.xml:342` |
| bi | `chat-dots` | bi | 4 | 1 | 3 (1) | 3 | sinngemäß | `message-circle-more` | `tl-archetype-app/src/main/resources/archetype-resources/src/main/webapp/WEB-INF/views/app.view.xml:40`<br>`tl-chat/src/main/java/com/top_logic/ai/chat/view/ChatDockElement.java:200` |
| bi | `chat-left-text` | bi | 4 | 0 | 4 (4) | 2 | sinngemäß | `message-square-text` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:69`<br>`tl-ai-demo/src/main/webapp/WEB-INF/views/tl-ai-demo/events/events.view.xml:58` |
| bi | `flag` | bi | 4 | 0 | 4 (4) | 1 | exakt | `flag` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/model/tl.demo.projectManagement.model.xml:29` |
| bi | `layout-split` | bi | 4 | 3 | 1 (1) | 2 | sinngemäß | `columns-2` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/ColumnsElement.java:67`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:318` |
| bi | `magic` | bi | 4 | 1 | 3 (3) | 2 | sinngemäß | `wand-sparkles` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/wizard/WizardElement.java:86`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/attributes.view.xml:41` |
| bi | `receipt` | bi | 4 | 1 | 3 (1) | 2 | exakt | `receipt` | `tl-chat/src/main/java/META-INF/messages_de.properties:242`<br>`tl-ai-demo/src/main/webapp/WEB-INF/views/app.view.xml:133` |
| bi | `search` | bi | 4 | 0 | 4 (2) | 2 | exakt | `search` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/compact-history.view.xml:163`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/styling-demo.view.xml:399` |
| bi | `shield-lock` | bi | 4 | 0 | 4 (0) | 1 | exakt | `shield-lock` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/accounts.view.xml:147` |
| bi | `star` | bi | 4 | 2 | 2 (0) | 1 | exakt | `star` | `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:1745` |
| bi | `stop` | bi | 4 | 0 | 4 (0) | 1 | unsicher | `octagon` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/monitoring/sql-monitor.view.xml:70` |
| bi | `box-arrow-in-down-right` | bi | 3 | 2 | 1 (1) | 2 | sinngemäß | `square-arrow-down-right` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/ReferenceElement.java:58`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:156` |
| bi | `box-arrow-up-right` | bi | 3 | 1 | 2 (2) | 2 | sinngemäß | `square-arrow-out-up-right (= square-arrow-up-right-exit)` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/designer/Icons.java:35`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/attributes.view.xml:101` |
| bi | `card-checklist` | bi | 3 | 0 | 3 (1) | 2 | unsicher | `list-checks` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/services/reindex.view.xml:49`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:666` |
| bi | `card-list` | bi | 3 | 0 | 3 (3) | 1 | sinngemäß | `layout-list` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:59` |
| bi | `card-text` | bi | 3 | 1 | 2 (1) | 3 | unsicher | `file-text` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/scheduler/task-detail.view.xml:544`<br>`tl-chat/ui/src/rail-model.ts:127` |
| bi | `check2-circle` | bi | 3 | 0 | 3 (2) | 2 | sinngemäß | `circle-check` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:125`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/wizard-demo.view.xml:251` |
| bi | `check2-square` | bi | 3 | 0 | 3 (1) | 3 | sinngemäß | `square-check` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/bpe/task.view.xml:47`<br>`com.top_logic.layout.view/src/main/webapp/WEB-INF/views/ui-inspector.view.xml:84` |
| bi | `download` | bi | 3 | 1 | 2 (0) | 2 | exakt | `download` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:214`<br>`com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/DownloadElement.java:44` |
| bi | `funnel` | bi | 3 | 0 | 3 (3) | 1 | exakt | `funnel` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:291` |
| bi | `kanban` | bi | 3 | 1 | 2 (2) | 2 | exakt | `kanban` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/list/KanbanBoardElement.java:142`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:96` |
| bi | `lightning` | bi | 3 | 3 | 0 (0) | 1 | sinngemäß | `zap` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/ViewCommand.java:50` |
| bi | `list-nested` | bi | 3 | 1 | 2 (2) | 2 | sinngemäß | `list-tree` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/TreeTableElement.java:116`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:147` |
| bi | `list-ol` | bi | 3 | 0 | 3 (3) | 1 | sinngemäß | `list-ordered` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/attributes.view.xml:137` |
| bi | `lock` | bi | 3 | 0 | 3 (0) | 1 | exakt | `lock` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:318` |
| bi | `people` | bi | 3 | 0 | 3 (2) | 3 | sinngemäß | `users` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/settings-tabs.view.xml:226`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tiles-demo/person-detail.view.xml:73` |
| bi | `play-circle` | bi | 3 | 0 | 3 (0) | 2 | exakt | `play-circle (Alias von circle-play)` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/bpe/start-process.view.xml:89`<br>`com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/maintenance.view.xml:75` |
| bi | `question-circle` | bi | 3 | 0 | 3 (3) | 2 | sinngemäß | `circle-question-mark` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/popover-dialog.view.xml:22`<br>`tl-ai-demo/src/main/webapp/WEB-INF/views/tl-chat/albert.view.xml:119` |
| bi | `quote` | bi | 3 | 0 | 3 (1) | 3 | exakt | `quote` | `tl-chat-classic/src/main/webapp/WEB-INF/views/tl-chat-classic/chat.view.xml:235`<br>`tl-chat/src/main/webapp/WEB-INF/views/tl-chat/albert.view.xml:396` |
| bi | `send` | bi | 3 | 0 | 3 (1) | 2 | exakt | `send` | `com.top_logic.layout.view.selfservice/src/main/webapp/WEB-INF/views/admin/access-control/create-invitation.view.xml:30`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/tickets/comment-composer.view.xml:64` |
| bi | `signpost` | bi | 3 | 3 | 0 (0) | 1 | exakt | `signpost` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/IfAction.java:68` |
| bi | `sliders` | bi | 3 | 1 | 2 (1) | 2 | exakt | `sliders (Alias von sliders-vertical)` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/designer/Icons.java:29`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:246` |
| bi | `ticket-perforated` | bi | 3 | 0 | 3 (3) | 1 | sinngemäß | `ticket` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/model/tl.demo.projectManagement.model.xml:188` |
| bi | `window` | bi | 3 | 1 | 2 (1) | 3 | sinngemäß | `app-window` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/CommandScopeElement.java:58`<br>`com.top_logic/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:75` |
| bi | `window-plus` | bi | 3 | 2 | 1 (0) | 2 | unsicher | `app-window` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/OpenDialogAction.java:79`<br>`com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml:1411` |
| bi | `backspace-fill` | bi | 2 | 0 | 2 (0) | 2 | sinngemäß | `delete` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/monitoring/revision-details.view.xml:129`<br>`com.top_logic.model.search/src/main/webapp/WEB-INF/layouts/admin/myLatestChanges/lastChangesTable.layout.xml:40` |
| bi | `backspace-reverse-fill` | bi | 2 | 0 | 2 (0) | 2 | unsicher | `delete` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/monitoring/revision-details.view.xml:151`<br>`com.top_logic.model.search/src/main/webapp/WEB-INF/layouts/admin/myLatestChanges/lastChangesTable.layout.xml:61` |
| bi | `bar-chart-line` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `chart-column` | `tl-chat/ui/src/rail-model.ts:125`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:156` |
| bi | `bar-chart-steps` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `chart-gantt` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:174` |
| bi | `bookmark` | bi | 2 | 1 | 1 (1) | 2 | exakt | `bookmark` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AnchorElement.java:54`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/accordion-demo.view.xml:57` |
| bi | `bookmark-star` | bi | 2 | 0 | 2 (2) | 1 | unsicher | `bookmark` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/model/demo.react.model.xml:636` |
| bi | `box-arrow-in-down` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `square-arrow-down` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/long-job-demo.view.xml:335` |
| bi | `box-arrow-in-right` | bi | 2 | 0 | 2 (0) | 1 | sinngemäß | `log-in` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/login-form.view.xml:47` |
| bi | `calendar-event` | bi | 2 | 0 | 2 (2) | 1 | unsicher | `calendar` | `tl-ai-demo/src/main/webapp/WEB-INF/views/app.view.xml:108` |
| bi | `calendar3` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `calendar` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/CalendarElement.java:65`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:462` |
| bi | `chevron-bar-expand` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `unfold-vertical (= arrows-from-axis-dashed-horizontal)` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AccordionElement.java:94`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:327` |
| bi | `chevron-double-right` | bi | 2 | 2 | 0 (0) | 1 | sinngemäß | `chevrons-right` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/BreadcrumbElement.java:64` |
| bi | `clock-history` | bi | 2 | 1 | 1 (0) | 1 | sinngemäß | `history (= rotate-ccw-clock)` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/RelativeTimeElement.java:40` |
| bi | `code-square` | bi | 2 | 1 | 1 (1) | 2 | exakt | `code-square (Alias von square-code)` | `com.top_logic.model.search.react/src/main/java/com/top_logic/model/search/react/TLScriptEditorElement.java:54`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:255` |
| bi | `columns-gap` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `columns-3` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:78` |
| bi | `cone-striped` | bi | 2 | 0 | 2 (0) | 1 | sinngemäß | `traffic-cone` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/enter-maintenance.view.xml:42` |
| bi | `cursor` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `mouse-pointer` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/ButtonElement.java:65`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tree-grid-demo.view.xml:80` |
| bi | `exclamation-triangle-fill` | bi | 2 | 2 | 0 (0) | 1 | sinngemäß | `triangle-alert (= triangle-exclamation-point)` | `com.top_logic.themes.core/src/main/webapp/style/form.css:2757` |
| bi | `eye` | bi | 2 | 1 | 1 (0) | 1 | exakt | `eye` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/VisibleIfElement.java:82` |
| bi | `file-earmark-pdf` | bi | 2 | 1 | 1 (1) | 2 | unsicher | `file-text` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/PdfElement.java:47`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:210` |
| bi | `filetype-html` | bi | 2 | 1 | 1 (1) | 2 | unsicher | `file-code` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/HtmlElement.java:75`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:228` |
| bi | `folder2` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `folder` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/GroupItemElement.java:55`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/model/tl.demo.projectManagement.model.xml:110` |
| bi | `folder2-open` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `folder-open` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tree-table-display-demo.view.xml:93` |
| bi | `grid-3x3` | bi | 2 | 0 | 2 (2) | 1 | exakt | `grid-3x3` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:138` |
| bi | `grid-3x3-gap` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `layout-grid` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/GridElement.java:39`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:390` |
| bi | `image` | bi | 2 | 1 | 1 (1) | 2 | exakt | `image` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/ImageElement.java:55`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:399` |
| bi | `info-circle-fill` | bi | 2 | 2 | 0 (0) | 1 | sinngemäß | `info` | `com.top_logic.themes.core/src/main/webapp/style/form.css:2761` |
| bi | `info-square` | bi | 2 | 2 | 0 (0) | 1 | unsicher | `info` | `com.top_logic.themes.core/src/main/webapp/style/form.css:2762` |
| bi | `input-cursor-text` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `text-cursor-input` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/ValueInputElement.java:170`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:610` |
| bi | `journal-text` | bi | 2 | 0 | 2 (0) | 1 | sinngemäß | `notebook-text` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/monitoring/user-sessions.view.xml:59` |
| bi | `layout-sidebar` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `panel-left` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/SidebarElement.java:81`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/attributes.view.xml:432` |
| bi | `layout-text-window-reverse` | bi | 2 | 0 | 2 (1) | 2 | unsicher | `app-window` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:393`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:444` |
| bi | `layout-three-columns` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `columns-3` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:120` |
| bi | `palette` | bi | 2 | 0 | 2 (2) | 1 | exakt | `palette` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:498` |
| bi | `patch-check` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `badge-check` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tree-demo.view.xml:251` |
| bi | `person-badge` | bi | 2 | 0 | 2 (1) | 2 | sinngemäß | `id-card` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:415`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/wizard-demo.view.xml:119` |
| bi | `person-vcard` | bi | 2 | 0 | 2 (1) | 2 | sinngemäß | `contact` | `com.top_logic.layout.view.contact/src/main/webapp/WEB-INF/views/settings-tabs.view.xml:31`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tiles-demo/person-detail.view.xml:34` |
| bi | `record-circle` | bi | 2 | 0 | 2 (0) | 1 | sinngemäß | `circle-dot` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/dev-menu.view.xml:108` |
| bi | `scissors` | bi | 2 | 0 | 2 (0) | 1 | exakt | `scissors` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/compact-history.view.xml:188` |
| bi | `segmented-nav` | bi | 2 | 1 | 1 (1) | 2 | keine | — | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/BottomBarElement.java:44`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:336` |
| bi | `shield-check` | bi | 2 | 1 | 1 (0) | 2 | exakt | `shield-check` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:161`<br>`tl-security-captcha-view/src/main/java/com/top_logic/security/captcha/view/CaptchaElement.java:54` |
| bi | `signpost-split` | bi | 2 | 1 | 1 (1) | 2 | unsicher | `signpost` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/TabBarElement.java:53`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:381` |
| bi | `slash-circle` | bi | 2 | 0 | 2 (0) | 1 | sinngemäß | `circle-slash` | `com.top_logic.layout.view.agent/src/main/webapp/WEB-INF/views/admin/system/agent-tokens.view.xml:20` |
| bi | `stop-circle` | bi | 2 | 1 | 1 (0) | 2 | exakt | `stop-circle (Alias von circle-stop)` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/script-recorder.view.xml:46`<br>`tl-chat/ui/src/subagent-card.tsx:455` |
| bi | `tag` | bi | 2 | 0 | 2 (1) | 2 | exakt | `tag` | `com.top_logic.dev.tools/src/main/webapp/WEB-INF/views/admin/model/model-editor.view.xml:220`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:726` |
| bi | `ticket-detailed` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `ticket` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tree-table-display-demo.view.xml:93` |
| bi | `toggle-off` | bi | 2 | 0 | 2 (0) | 1 | sinngemäß | `toggle-left` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/scheduler/overview.view.xml:145` |
| bi | `toggle-on` | bi | 2 | 0 | 2 (0) | 1 | sinngemäß | `toggle-right` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/scheduler/overview.view.xml:120` |
| bi | `toggles` | bi | 2 | 0 | 2 (2) | 1 | unsicher | `sliders-horizontal` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:278` |
| bi | `ui-radios` | bi | 2 | 0 | 2 (2) | 1 | keine | — | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:471` |
| bi | `view-stacked` | bi | 2 | 0 | 2 (2) | 1 | sinngemäß | `rows-2` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:363` |
| bi | `window-fullscreen` | bi | 2 | 1 | 1 (1) | 2 | sinngemäß | `fullscreen` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/FullPageElement.java:45`<br>`com.top_logic.demo.react/src/main/webapp/WEB-INF/views/tickets.view.xml:453` |
| bi | `x-octagon-fill` | bi | 2 | 2 | 0 (0) | 1 | sinngemäß | `octagon-x` | `com.top_logic.themes.core/src/main/webapp/style/form.css:2756` |
| bi | `arrow-down-circle` | bi | 1 | 1 | 0 (0) | 1 | exakt | `arrow-down-circle (Alias von circle-arrow-down)` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/ScrollLinkElement.java:57` |
| bi | `arrow-up` | bi | 1 | 0 | 1 (0) | 1 | exakt | `arrow-up` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/ui-inspector.view.xml:42` |
| bi | `arrow-up-circle` | bi | 1 | 1 | 0 (0) | 1 | exakt | `arrow-up-circle (Alias von circle-arrow-up)` | `com.top_logic.element/src/main/java/com/top_logic/element/boundsec/manager/coverage/CoverageStatusResourceProvider.java:27` |
| bi | `arrows-move` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `move` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:480` |
| bi | `bar-chart` | bi | 1 | 1 | 0 (0) | 1 | exakt | `bar-chart (Alias von chart-no-axes-column-increasing)` | `com.top_logic.layout.react.chartjs/src/main/java/com/top_logic/layout/react/chartjs/ChartElement.java:56` |
| bi | `bell` | bi | 1 | 0 | 1 (1) | 1 | exakt | `bell` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/accordion-demo.view.xml:123` |
| bi | `bezier2` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `spline` | `com.top_logic.react.flow.server/src/main/java/com/top_logic/react/flow/server/ui/FlowDiagramElement.java:71` |
| bi | `binoculars` | bi | 1 | 0 | 1 (0) | 1 | exakt | `binoculars` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/dev-menu.view.xml:73` |
| bi | `book` | bi | 1 | 0 | 1 (0) | 1 | exakt | `book` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/dev-menu.view.xml:146` |
| bi | `bookmark-heart` | bi | 1 | 0 | 1 (0) | 1 | unsicher | `bookmark` | `tl-chat/src/main/webapp/WEB-INF/views/tl-chat/albert.view.xml:410` |
| bi | `bounding-box` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `box-select (= square-dashed)` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/ContainerElement.java:32` |
| bi | `box-arrow-in-down-left` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `square-arrow-down-left` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/DynamicViewElement.java:65` |
| bi | `box-arrow-in-left` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `square-arrow-left` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/sql-console.view.xml:279` |
| bi | `box-arrow-up` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `square-arrow-up` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/tree-demo.view.xml:197` |
| bi | `braces` | bi | 1 | 0 | 1 (1) | 1 | exakt | `braces` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:41` |
| bi | `broadcast` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `radio` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:426` |
| bi | `bug-fill` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `bug` | `com.top_logic.demo/src/main/webapp/WEB-INF/workflow/Ticketsystem.bpml.xml:27` |
| bi | `calendar-check` | bi | 1 | 0 | 1 (1) | 1 | exakt | `calendar-check` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/workflow/LeaveRequest.bpmn.xml:27` |
| bi | `calendar-plus` | bi | 1 | 0 | 1 (1) | 1 | exakt | `calendar-plus` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/bpe/tasks.view.xml:22` |
| bi | `camera` | bi | 1 | 1 | 0 (0) | 1 | exakt | `camera` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/PhotoCaptureElement.java:43` |
| bi | `camera-reels` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `video` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:219` |
| bi | `card-heading` | bi | 1 | 1 | 0 (0) | 1 | unsicher | `panel-top` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/CardElement.java:50` |
| bi | `cash-coin` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `coins` | `tl-ai-demo/src/main/webapp/WEB-INF/views/tl-chat/albert.view.xml:374` |
| bi | `chat-square-dots` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `message-square-more` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/PopoverElement.java:106` |
| bi | `chat-square-text` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `message-square-text` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:345` |
| bi | `chevron-left` | bi | 1 | 0 | 1 (0) | 1 | exakt | `chevron-left` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/monitoring/revision-monitor.view.xml:284` |
| bi | `circle-half` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `contrast` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/Icons.java:20` |
| bi | `cloud` | bi | 1 | 0 | 1 (1) | 1 | exakt | `cloud` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:105` |
| bi | `collection` | bi | 1 | 0 | 1 (1) | 1 | unsicher | `library` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:113` |
| bi | `crop` | bi | 1 | 0 | 1 (1) | 1 | exakt | `crop` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:201` |
| bi | `crosshair` | bi | 1 | 0 | 1 (0) | 1 | exakt | `crosshair` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/ui-inspector.view.xml:26` |
| bi | `dash-circle` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `circle-minus` | `com.top_logic.element/src/main/java/com/top_logic/element/boundsec/manager/coverage/CoverageStatusResourceProvider.java:30` |
| bi | `database` | bi | 1 | 1 | 0 (0) | 1 | exakt | `database` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/WithTransactionAction.java:84` |
| bi | `database-exclamation` | bi | 1 | 0 | 1 (0) | 1 | unsicher | `database` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/import-dump.view.xml:185` |
| bi | `database-fill-check` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `database-check` | `com.top_logic.model.search.react/src/main/webapp/WEB-INF/views/admin/development/script-console.view.xml:41` |
| bi | `database-gear` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `database-cog` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/services/service-detail.view.xml:175` |
| bi | `distribute-vertical` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `align-vertical-distribute-center` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/SectionItemElement.java:56` |
| bi | `droplet-half` | bi | 1 | 0 | 1 (1) | 1 | unsicher | `droplet` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/conf/demoReactConf.config.xml:961` |
| bi | `easel` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `presentation` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/dev-menu.view.xml:53` |
| bi | `envelope-at` | bi | 1 | 0 | 1 (0) | 1 | unsicher | `mail` | `tl-security-selfservice/src/main/webapp/WEB-INF/layouts/admin/security/accounts/inviteUsers/dialog.layout.xml:41` |
| bi | `envelope-open` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `mail-open` | `tl-security-selfservice/src/main/webapp/WEB-INF/layouts/admin/security/accounts/existingInvitations/dialog.layout.xml:17` |
| bi | `envelope-plus` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `mail-plus` | `com.top_logic.layout.view.selfservice/src/main/webapp/WEB-INF/views/admin/access-control/invitations.view.xml:22` |
| bi | `exclamation-octagon` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `octagon-alert (= octagon-exclamation-point)` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/long-job-demo.view.xml:173` |
| bi | `file-earmark-arrow-up` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `file-up` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:189` |
| bi | `file-earmark-bar-graph` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `file-chart-column` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/attributes.view.xml:158` |
| bi | `file-earmark-code` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `file-code` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/designer/Icons.java:20` |
| bi | `file-earmark-excel` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `file-spreadsheet` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/table/TableExportCommand.java:159` |
| bi | `file-earmark-slides` | bi | 1 | 0 | 1 (1) | 1 | unsicher | `presentation` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/projects/overview.view.xml:87` |
| bi | `file-earmark-text` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `file-text` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/docs/DevDocResourceProvider.java:25` |
| bi | `file-text` | bi | 1 | 1 | 0 (0) | 1 | exakt | `file-text` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/TextElement.java:73` |
| bi | `file-zip` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `file-archive` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/import-dump.view.xml:157` |
| bi | `files` | bi | 1 | 0 | 1 (0) | 1 | exakt | `files` | `com.top_logic.bpe.view/src/main/webapp/WEB-INF/views/admin/workflows/workflows.view.xml:99` |
| bi | `filetype-sql` | bi | 1 | 0 | 1 (0) | 1 | unsicher | `file-code` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/import-dump.view.xml:129` |
| bi | `filetype-xml` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `file-code` | `com.top_logic.dev.tools/src/main/webapp/WEB-INF/views/admin/model/model-editor.view.xml:470` |
| bi | `floppy` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `save` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/long-job-demo.view.xml:230` |
| bi | `geo-alt` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `map-pin` | `tl-ai-demo/src/main/webapp/WEB-INF/views/app.view.xml:123` |
| bi | `git` | bi | 1 | 0 | 1 (0) | 1 | unsicher | `git-branch` | `tl-ai-views/src/main/webapp/WEB-INF/model/tl.ai.views.model.xml:19` |
| bi | `grid-1x2` | bi | 1 | 1 | 0 (0) | 1 | unsicher | `layout-template` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/DashboardElement.java:94` |
| bi | `input-cursor` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `text-cursor-input` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/FieldElement.java:53` |
| bi | `intersect` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `squares-intersect` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:691` |
| bi | `journal-arrow-down` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `book-down` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/system/services/service-detail.view.xml:266` |
| bi | `journal-bookmark` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `book-bookmark` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/docs/DevDocResourceProvider.java:23` |
| bi | `layers` | bi | 1 | 0 | 1 (1) | 1 | exakt | `layers` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:273` |
| bi | `layout-sidebar-inset` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `panel-left` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:300` |
| bi | `layout-sidebar-inset-reverse` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `panel-right` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:309` |
| bi | `layout-text-sidebar` | bi | 1 | 0 | 1 (1) | 1 | unsicher | `panel-left` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:354` |
| bi | `layout-text-sidebar-reverse` | bi | 1 | 1 | 0 (0) | 1 | unsicher | `panel-right` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AdaptiveDetailElement.java:78` |
| bi | `link-45deg` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `link` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/SidebarElement.java:405` |
| bi | `list` | bi | 1 | 0 | 1 (0) | 1 | exakt | `list` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/conf/tl-layout-view.conf.config.xml:134` |
| bi | `menu-button-wide` | bi | 1 | 1 | 0 (0) | 1 | unsicher | `square-menu` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AbstractMenuElement.java:76` |
| bi | `mic` | bi | 1 | 1 | 0 (0) | 1 | exakt | `mic` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AudioRecorderElement.java:43` |
| bi | `moon-stars` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `moon-star` | `com.top_logic.layout.react/src/main/webapp/WEB-INF/conf/tl-react-theme.config.xml:126` |
| bi | `music-note-beamed` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `music (= eighth-notes)` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AudioPlayerElement.java:44` |
| bi | `node-plus` | bi | 1 | 0 | 1 (0) | 1 | keine | — | `com.top_logic.dev.tools/src/main/webapp/WEB-INF/views/admin/model/model-editor.view.xml:186` |
| bi | `pause-circle` | bi | 1 | 0 | 1 (1) | 1 | exakt | `pause-circle (Alias von circle-pause)` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/long-job-demo.view.xml:282` |
| bi | `person` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `user` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/settings-tabs.view.xml:89` |
| bi | `person-circle` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `circle-user` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AvatarElement.java:45` |
| bi | `person-dash` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `user-minus` | `com.top_logic.layout.view.contact/src/main/webapp/WEB-INF/views/admin/access-control/accounts.view.xml:116` |
| bi | `person-fill` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `user` | `com.top_logic.layout.react/react-src/controls/TLResourceCell.tsx:18` |
| bi | `person-gear` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `user-cog` | `tl-ai-demo/src/main/webapp/WEB-INF/views/app.view.xml:153` |
| bi | `person-plus` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `user-plus` | `com.top_logic.layout.view.contact/src/main/webapp/WEB-INF/views/admin/access-control/accounts.view.xml:85` |
| bi | `phone` | bi | 1 | 0 | 1 (0) | 1 | exakt | `phone` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/conf/tl-layout-view.conf.config.xml:254` |
| bi | `pin-angle` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `pin` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/user-menu.view.xml:158` |
| bi | `plus-circle-fill` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `circle-plus` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/FloatingActionElement.java:64` |
| bi | `postcard` | bi | 1 | 1 | 0 (0) | 1 | unsicher | `mail` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/TileElement.java:71` |
| bi | `puzzle` | bi | 1 | 1 | 0 (0) | 1 | exakt | `puzzle` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/slot/SlotElement.java:48` |
| bi | `puzzle-fill` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `puzzle` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/slot/SlotContentElement.java:48` |
| bi | `question-circle-fill` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `circle-question-mark` | `com.top_logic.demo/src/main/webapp/WEB-INF/workflow/Ticketsystem.bpml.xml:237` |
| bi | `reception-4` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `signal` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/ProgressElement.java:70` |
| bi | `reply` | bi | 1 | 0 | 1 (1) | 1 | exakt | `reply` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/tickets/comment.view.xml:60` |
| bi | `robot` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `bot` | `com.top_logic.layout.view.agent/src/main/webapp/WEB-INF/views/dev-menu.view.xml:16` |
| bi | `shield-exclamation` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `shield-alert (= shield-exclamation-point)` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/long-job-demo.view.xml:468` |
| bi | `shield-minus` | bi | 1 | 0 | 1 (0) | 1 | exakt | `shield-minus` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/settings-tabs.view.xml:353` |
| bi | `shield-plus` | bi | 1 | 0 | 1 (0) | 1 | exakt | `shield-plus` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/settings-tabs.view.xml:313` |
| bi | `shield-shaded` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `shield` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/coverage.view.xml:193` |
| bi | `shield-x` | bi | 1 | 0 | 1 (0) | 1 | exakt | `shield-x` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/access-control/accounts.view.xml:174` |
| bi | `signpost-2` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `signpost` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:435` |
| bi | `skip-end-fill` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `skip-forward` | `com.top_logic.element/src/main/webapp/WEB-INF/model/tl.changelog.model.xml:31` |
| bi | `sort-down` | bi | 1 | 0 | 1 (1) | 1 | unsicher | `arrow-down-wide-narrow` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/table-columns.view.xml:355` |
| bi | `square` | bi | 1 | 0 | 1 (1) | 1 | exakt | `square` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/conf/demoReactConf.config.xml:937` |
| bi | `stack` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `layers` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/tiles/TileStackElement.java:94` |
| bi | `sun` | bi | 1 | 0 | 1 (0) | 1 | exakt | `sun` | `com.top_logic.layout.react/src/main/webapp/WEB-INF/conf/tl-react-theme.config.xml:21` |
| bi | `tags` | bi | 1 | 0 | 1 (1) | 1 | exakt | `tags` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:87` |
| bi | `terminal` | bi | 1 | 0 | 1 (0) | 1 | exakt | `terminal` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/admin/monitoring/logs.view.xml:72` |
| bi | `thermometer-half` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `thermometer` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/app.view.xml:489` |
| bi | `three-dots` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `ellipsis` | `com.top_logic.layout.react/react-src/controls/TLToolbar.tsx:19` |
| bi | `three-dots-vertical` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `ellipsis-vertical` | `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/com.top_logic.layout.buttonbar.Icons.BUTTON_BAR_TEMPLATE.template.html:8` |
| bi | `tools` | bi | 1 | 0 | 1 (0) | 1 | sinngemäß | `wrench` | `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/dev-menu.view.xml:32` |
| bi | `trash3` | bi | 1 | 0 | 1 (1) | 1 | sinngemäß | `trash` | `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/tickets.view.xml:352` |
| bi | `ui-checks` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `list-checks` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/FormElement.java:92` |
| bi | `ui-checks-grid` | bi | 1 | 1 | 0 (0) | 1 | unsicher | `grid-2x2-check` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/FieldsElement.java:68` |
| bi | `window-desktop` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `app-window` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AppShellElement.java:61` |
| bi | `window-dock` | bi | 1 | 1 | 0 (0) | 1 | sinngemäß | `dock` | `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/AppBarElement.java:63` |

Anmerkung zu **Keine**: `fa|notdef` und `fa|leave` sind keine Font-Awesome-Glyphen (Platzhalter-Glyphe bzw. Tippfehler in `com.top_logic.demo/…/theme-settings.xml:86`), `fa|dolly`, `fa|running`, `bi|node-plus`, `bi|segmented-nav`, `bi|ui-radios` haben keine brauchbare Lucide-Entsprechung, `fa|dropbox` ist ein Markenzeichen.

Anmerkung zu **Stil**: Font-Awesome-Glyphen mit Stil `regular` (z. B. `square`, `check-square`, `smile`, `file`) sind in Lucide nur als Outline vorhanden, ein Lucide-„solid“ gibt es nicht. Wo `solid` benutzt wird (z. B. `circle`, `star`, `play`), zeichnet Lucide nur die Kontur; Füllung wäre eine CSS-Entscheidung (`fill`), nicht ein anderes Icon.

Anmerkung zu **exakt**: gleicher Name heißt gleiche Bedeutung, nicht identisches Bild. Zwei Namensfallen sind schon aufgelöst: Font-Awesome `forward` (Doppeldreieck) entspricht Lucide `fast-forward`, nicht Lucide `forward` (gebogener Pfeil), deshalb als sinngemäß geführt; Font-Awesome `share` ist als unsicher geführt, weil Lucide `share` ein anderes Bild zeigt als FA6 `share`.

## Glyphen ohne produktive Nutzung (nur Test, Specimen, Doku, Migrationswerkzeug)

168 Glyphen. Bei Lucide-Urteil `nicht bewertet` wurde bewusst nicht abgeglichen. Es sind überwiegend die alten Bootstrap-Namen, die `IconReplacer.java` (Ticket 28386) auf Font Awesome umschreibt, zufällige Font-Awesome-Namen aus Icon-Picker-Tests (`acquisitions-incorporated`, `allergies` …) und `-fill`-Varianten aus den Design-System-Specimen.

| Bib | Glyphe | Fundstellen (Test/DS/Doku/Mapping) | Lucide |
|---|---|---|---|
| bi | `a` | 6 (test 6) | nicht bewertet |
| bi | `alarm-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `arrow-down` | 2 (mapping 1, ds 1) | exakt: `arrow-down` |
| bi | `arrow-down-up` | 1 (mapping 1) | exakt: `arrow-down-up` |
| bi | `arrow-left-right` | 1 (mapping 1) | exakt: `arrow-left-right` |
| bi | `arrow-right` | 1 (mapping 1) | exakt: `arrow-right` |
| bi | `arrow-right-square-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `arrows` | 1 (mapping 1) | nicht bewertet |
| bi | `arrows-angle-contract` | 1 (mapping 1) | nicht bewertet |
| bi | `arrows-angle-expand` | 3 (mapping 1, ds 2) | nicht bewertet |
| bi | `arrows-expand-vertical` | 1 (mapping 1) | nicht bewertet |
| bi | `arrows-fullscreen` | 1 (ds 1) | nicht bewertet |
| bi | `b` | 1 (test 1) | nicht bewertet |
| bi | `bar-chart-line-fill` | 1 (mapping 1) | sinngemäß: `chart-column` |
| bi | `binoculars-fill` | 1 (mapping 1) | sinngemäß: `binoculars` |
| bi | `bookmark-fill` | 1 (mapping 1) | sinngemäß: `bookmark` |
| bi | `briefcase-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `brush-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `buildings-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `bullseye` | 1 (mapping 1) | nicht bewertet |
| bi | `calendar` | 7 (mapping 1, ds 6) | exakt: `calendar` |
| bi | `caret-up-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `chat-left-quote-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `check` | 1 (mapping 1) | exakt: `check` |
| bi | `check-all` | 1 (mapping 1) | nicht bewertet |
| bi | `check-circle-fill` | 2 (mapping 1, ds 1) | sinngemäß: `circle-check-big` |
| bi | `check-square-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `check2-all` | 1 (ds 1) | nicht bewertet |
| bi | `chevron-` | 1 (ds 1) | nicht bewertet |
| bi | `chevron-double-down` | 1 (mapping 1) | nicht bewertet |
| bi | `chevron-double-left` | 1 (mapping 1) | nicht bewertet |
| bi | `chevron-double-up` | 1 (mapping 1) | nicht bewertet |
| bi | `chevron-down` | 11 (mapping 1, ds 10) | exakt: `chevron-down` |
| bi | `chevron-expand` | 1 (mapping 1) | nicht bewertet |
| bi | `chevron-up` | 2 (mapping 1, ds 1) | exakt: `chevron-up` |
| bi | `circle-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `clipboard-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `clipboard-minus-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `clipboard-plus-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `clock` | 1 (mapping 1) | exakt: `clock` |
| bi | `clock-fill` | 1 (mapping 1) | sinngemäß: `clock` |
| bi | `code` | 1 (ds 1) | exakt: `code` |
| bi | `code-slash` | 1 (mapping 1) | nicht bewertet |
| bi | `collection-fill` | 1 (mapping 1) | sinngemäß: `library` |
| bi | `columns` | 1 (mapping 1) | exakt: `columns (Alias von columns-2)` |
| bi | `dash` | 1 (mapping 1) | nicht bewertet |
| bi | `dash-lg` | 2 (mapping 1, ds 1) | nicht bewertet |
| bi | `dash-square-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `database-down` | 1 (mapping 1) | nicht bewertet |
| bi | `diagram-3-fill` | 1 (mapping 1) | sinngemäß: `network` |
| bi | `directional` | 1 (lib 1) | nicht bewertet |
| bi | `dot` | 1 (ds 1) | exakt: `dot` |
| bi | `easel-fill` | 1 (mapping 1) | sinngemäß: `presentation` |
| bi | `envelope` | 6 (ds 6) | nicht bewertet |
| bi | `exclamation-circle` | 5 (ds 5) | nicht bewertet |
| bi | `eye-slash` | 3 (ds 3) | nicht bewertet |
| bi | `file-arrow-down-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-arrow-up-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-earmark` | 6 (ds 6) | nicht bewertet |
| bi | `file-earmark-diff-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-earmark-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-earmark-plus` | 1 (mapping 1) | nicht bewertet |
| bi | `file-earmark-plus-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-earmark-text-fill` | 1 (mapping 1) | sinngemäß: `file-text` |
| bi | `file-plus-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-spreadsheet-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-text-fill` | 1 (mapping 1) | sinngemäß: `file-text` |
| bi | `file-word-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `file-zip-fill` | 1 (mapping 1) | sinngemäß: `file-archive` |
| bi | `filetype-pdf` | 1 (mapping 1) | nicht bewertet |
| bi | `filetype-ppt` | 1 (mapping 1) | nicht bewertet |
| bi | `floppy2-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `folder` | 9 (test 2, ds 7) | exakt: `folder` |
| bi | `folder-plus` | 1 (mapping 1) | exakt: `folder-plus` |
| bi | `fonts` | 1 (mapping 1) | nicht bewertet |
| bi | `forward-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `fullscreen` | 1 (mapping 1) | exakt: `fullscreen` |
| bi | `fullscreen-exit` | 1 (mapping 1) | nicht bewertet |
| bi | `funnel-fill` | 3 (mapping 1, ds 2) | sinngemäß: `funnel` |
| bi | `gear-fill` | 1 (mapping 1) | sinngemäß: `settings` |
| bi | `globe` | 1 (mapping 1) | exakt: `globe` |
| bi | `grid` | 1 (ds 1) | exakt: `grid (Alias von grid-3x3)` |
| bi | `grip-vertical` | 14 (ds 14) | exakt: `grip-vertical` |
| bi | `hash` | 1 (mapping 1) | exakt: `hash` |
| bi | `hdd-network-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `hdd-rack-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `heart` | 6 (ds 6) | exakt: `heart` |
| bi | `house` | 13 (mapping 1, ds 12) | exakt: `house` |
| bi | `house-fill` | 1 (mapping 1) | sinngemäß: `house` |
| bi | `inbox` | 6 (ds 6) | exakt: `inbox` |
| bi | `info` | 2 (test 2) | exakt: `info` |
| bi | `keyboard-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `layout-wtf` | 1 (mapping 1) | nicht bewertet |
| bi | `lock-fill` | 3 (mapping 1, ds 2) | sinngemäß: `lock` |
| bi | `paperclip` | 2 (ds 2) | exakt: `paperclip` |
| bi | `pause` | 1 (mapping 1) | exakt: `pause` |
| bi | `pause-fill` | 1 (mapping 1) | sinngemäß: `pause` |
| bi | `pencil-fill` | 1 (mapping 1) | sinngemäß: `pencil` |
| bi | `people-fill` | 1 (mapping 1) | sinngemäß: `users` |
| bi | `person-badge-fill` | 1 (mapping 1) | sinngemäß: `id-card` |
| bi | `person-fill-gear` | 1 (mapping 1) | nicht bewertet |
| bi | `person-fill-lock` | 1 (mapping 1) | nicht bewertet |
| bi | `pie-chart-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `plus` | 1 (mapping 1) | exakt: `plus` |
| bi | `plus-circle` | 1 (mapping 1) | exakt: `plus-circle (Alias von circle-plus)` |
| bi | `plus-slash-minus` | 1 (doc 1) | nicht bewertet |
| bi | `plus-square` | 1 (mapping 1) | exakt: `plus-square (Alias von square-plus)` |
| bi | `printer` | 2 (ds 2) | exakt: `printer` |
| bi | `qr-code` | 1 (mapping 1) | exakt: `qr-code` |
| bi | `question-lg` | 1 (mapping 1) | nicht bewertet |
| bi | `question-square-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `r1` | 1 (test 1) | nicht bewertet |
| bi | `r2` | 1 (test 1) | nicht bewertet |
| bi | `record-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `save-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `save2-fill` | 1 (mapping 1) | nicht bewertet |
| bi | `shield-fill-check` | 1 (mapping 1) | nicht bewertet |
| bi | `star-fill` | 1 (test 1) | sinngemäß: `star` |
| bi | `stop-circle-fill` | 1 (mapping 1) | sinngemäß: `circle-stop` |
| bi | `stop-fill` | 1 (mapping 1) | sinngemäß: `octagon` |
| bi | `terminal-fill` | 1 (mapping 1) | sinngemäß: `terminal` |
| bi | `translate` | 3 (mapping 1, ds 2) | nicht bewertet |
| bi | `trash3-fill` | 1 (mapping 1) | sinngemäß: `trash` |
| bi | `type` | 1 (test 1) | exakt: `type` |
| bi | `type-bold` | 2 (ds 2) | nicht bewertet |
| bi | `type-italic` | 2 (ds 2) | nicht bewertet |
| bi | `type-strikethrough` | 1 (ds 1) | nicht bewertet |
| bi | `type-underline` | 1 (ds 1) | nicht bewertet |
| bi | `unlock-fill` | 1 (mapping 1) | sinngemäß: `lock-open` |
| bi | `window-split` | 1 (mapping 1) | nicht bewertet |
| bi | `x` | 11 (doc 1, test 3, ds 7) | exakt: `x` |
| bi | `x-circle-fill` | 1 (mapping 1) | sinngemäß: `circle-x` |
| bi | `x-square-fill` | 1 (mapping 1) | nicht bewertet |
| fa | `accessible-icon` | 1 (test 1) | nicht bewertet |
| fa | `acquisitions-incorporated` | 2 (test 2) | nicht bewertet |
| fa | `address-card` | 1 (test 1) | nicht bewertet |
| fa | `algolia` | 2 (test 2) | nicht bewertet |
| fa | `align-center` | 2 (test 2) | exakt: `align-center (Alias von text-align-center)` |
| fa | `allergies` | 1 (test 1) | nicht bewertet |
| fa | `ambulance` | 4 (doc 4) | exakt: `ambulance` |
| fa | `angle-double-down` | 1 (doc 1) | nicht bewertet |
| fa | `angle-double-up` | 1 (doc 1) | nicht bewertet |
| fa | `arrows-up-down` | 1 (mapping 1) | nicht bewertet |
| fa | `artstation` | 1 (test 1) | nicht bewertet |
| fa | `atlassian` | 1 (test 1) | nicht bewertet |
| fa | `atom` | 1 (test 1) | exakt: `atom` |
| fa | `audible` | 1 (test 1) | nicht bewertet |
| fa | `audio-description` | 1 (test 1) | nicht bewertet |
| fa | `avianex` | 2 (test 2) | nicht bewertet |
| fa | `baby` | 1 (test 1) | exakt: `baby` |
| fa | `bahai` | 1 (test 1) | nicht bewertet |
| fa | `bell` | 1 (test 1) | exakt: `bell` |
| fa | `bell-slash` | 2 (test 2) | nicht bewertet |
| fa | `book-reader` | 1 (test 1) | nicht bewertet |
| fa | `box` | 2 (test 2) | exakt: `box` |
| fa | `box-open` | 2 (test 2) | nicht bewertet |
| fa | `bullhorn` | 2 (test 2) | nicht bewertet |
| fa | `calculator` | 1 (doc 1) | exakt: `calculator` |
| fa | `cart-plus` | 1 (test 1) | nicht bewertet |
| fa | `circle-down` | 1 (mapping 1) | nicht bewertet |
| fa | `ellipsis-vertical` | 1 (mapping 1) | exakt: `ellipsis-vertical` |
| fa | `grin` | 1 (test 1) | nicht bewertet |
| fa | `inbox` | 2 (test 2) | exakt: `inbox` |
| fa | `laugh-wink` | 2 (test 2) | nicht bewertet |
| fa | `plus-circle` | 3 (test 3) | exakt: `plus-circle (Alias von circle-plus)` |
| fa | `shop` | 1 (mapping 1) | nicht bewertet |
| fa | `thumbs-up` | 4 (doc 4) | exakt: `thumbs-up` |
| fa | `tree` | 1 (test 1) | nicht bewertet |
## Glyphen für Zustände

Quellen: Konstanten in `com.top_logic.layout.react/react-src/bridge/icons.ts` (Engine-Code), Theme-Definitionen in `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml` (Zeile in Klammern), Layout-/View-/Modell-XML und Java. Ein Zustand wird in TopLogic auf drei Arten ausgedrückt: (a) **anderes Icon** (Paar), (b) **Variante desselben Glyphs** (solid ↔ regular), (c) **Farbwort hinter dem Glyphen** (`red`, `green`, `yellow`) oder reine CSS-Änderung. Nur (a) und (b) hängen an der Icon-Bibliothek, (c) nicht.

**Paare und Varianten (a/b)**

| Zustand | Glyph(en) | Fundort | Lucide |
|---|---|---|---|
| sichtbar / verborgen (Spaltenwahl) | `fa-eye` / `fa-eye-slash` | `icons.ts` ICON_VISIBLE / ICON_HIDDEN | `eye` / `eye-off` |
| fixiert / frei (Spaltenwahl) | `fa-lock` / `fa-lock-open` | `icons.ts` ICON_LOCK / ICON_UNLOCK | `lock` / `lock-open` |
| gesperrt / entsperrt (Dokument) | `fa-lock` / `fa-unlock` | theme-settings DOC_LOCKED / DOC_UNLOCK | `lock` / `lock-open` |
| zu / auf (Baum, Liste, Zeile) | `fa-chevron-right` / `fa-chevron-down` / `fa-chevron-up` | `icons.ts` ICON_EXPAND, ICON_LIST_CLOSED, ICON_LIST_OPEN; theme-settings TREE_COLLAPSED / TREE_EXPANDED | `chevron-right` / `-down` / `-up` |
| zu / auf (Gruppe, Box) | `colored:tl-icon caret-right` / `caret-down`; BOX_* verweisen auf `ICONS_MOVE_ROW_UP/DOWN` | theme-settings GROUP_COLLAPSED / GROUP_EXPANDED, BOX_EXPANDED / BOX_COLLAPSED | eigener Font, nicht Gegenstand |
| Checkbox an / aus / leer (Tristate) | `fa-solid fa-square-check` / `fa-regular fa-square-minus` / `fa-regular fa-square` | theme-settings TRISTATE_TRUE / TRISTATE_FALSE / MANDATORY_NULL (Z. 1275–1294) | `square-check` / `square-minus` / `square` (Outline, kein solid) |
| alles wählen / nichts wählen | `fa-check-double` / `fa-regular fa-square`; `fa-square-check` / `fa-regular fa-square` | theme-settings ICONS_SELECT_ALL / ICONS_DESELECT_ALL, SELECT_ALL_CHECKBOXES / REMOVE_CHECKBOX | `check-check` / `square` |
| Filter setzen / zurücksetzen | `fa-filter` / `fa-filter-circle-xmark` | theme-settings FILTER / REMOVE_FILTER | `funnel` / `funnel-x` |
| Sortierung: unsortiert / auf / ab | `fa-sort` / `fa-arrow-up` / `fa-arrow-down` | theme-settings SORTABLE / SORT_ASC / SORT_DESC; `icons.ts` ICON_SORT_* | `arrow-up-down` / `arrow-up` / `arrow-down` |
| kopieren / kopiert / fehlgeschlagen | `fa-regular fa-copy` / `fa-check` / `fa-triangle-exclamation` | `icons.ts` ICON_COPY, ICON_COPIED, ICON_COPY_FAILED | `copy` / `check` / `triangle-alert` |
| Aufnahme: Start / Stopp; Wiedergabe: Play / Pause | `fa-circle` / `fa-stop`; `fa-play` / `fa-pause` | `icons.ts` ICON_RECORD / ICON_STOP / ICON_PLAY / ICON_PAUSE | `circle` (nur Kontur) / `square`; `play` / `pause` |
| Fenster: maximieren / zurück / minimieren | `fa-regular fa-window-maximize` / `-restore`; `fa-solid fa-window-minimize` | `icons.ts` ICON_MAXIMIZE / ICON_RESTORE; `TLPanel.tsx:18-24` | `maximize` / `copy` (unsicher) / `minimize` |
| Umschalter an / aus (Demo-Layout) | `fas fa-toggle-on` (activeImage) / `fas fa-toggle-off` (image) | `com.top_logic.demo/…/toggleButton/contextTreeTree.layout.xml:75-77` | `toggle-right` / `toggle-left` |
| Auswahlpunkt an / aus (Demo-Layout) | `fas fa-dot-circle` (activeImage) / `far fa-dot-circle` (image) | gleiche Datei :25-28 | `circle-dot` für beide (solid/regular nicht unterscheidbar) |
| Häkchen an / aus (Modell-Graph) | `far fa-check-square` (activeImage) / `far fa-square` (image), dreimal | `com.top_logic.graph.diagramjs.server/…/modelGraph.layout.xml:106-124` | `square-check` / `square` |
| Status je Abdeckung | `bi-check-circle` (abgedeckt), `bi-exclamation-triangle` (unvollständig), `bi-arrow-up-circle` (delegiert), `bi-dash-circle` (ausgenommen) | `CoverageStatusResourceProvider.java:21-24` (Java) | `circle-check-big`, `triangle-alert`, `circle-arrow-up`, `circle-minus` |
| Meilenstein freigegeben / offen | `bi-check-circle` / `bi-flag` | `com.top_logic.demo.react/…/tree-table-display-demo.view.xml:93` (TLScript `if`) | `circle-check-big` / `flag` |
| Kontakt ohne Konto | `far fa-user` (sonst anderes Icon) | `com.top_logic.layout.formeditor/…/extension.Contacts.model.xml:9` (TLScript `if`) | `user` (Kontur) |
| Neu: Konto / Kontakt | `colored:fas fa-user overlay-add` / `colored:far fa-user overlay-add` | `…/accounts/newAccount/dialog.layout.xml:20`, `…/createContact/dialog.layout.xml:98` | `user-plus` (Overlay-Konzept entfällt) |
| Stern gefüllt / Kontur (Instanzdarstellung) | `fas fa-star` / `far fa-star`, `far fa-circle` | `com.top_logic.demo/…/DemoTypes.model.xml:61-71` | `star` (gefüllt per CSS) |
| gespeicherte Kriterien / Lesezeichen | `fa-regular fa-bookmark` / `fa-solid fa-bookmark` | `icons.ts` ICON_SAVE; theme-settings BOOKMARK_LINK (Z. 594) | `bookmark` |

**Zustand nur über Farbwort (c)**, Glyph bleibt gleich: `MISC_COMPARE_COMPARE_MODE_ACTIVE` = `%ICONS_COMPARE% green` gegen `…_INACTIVE` (Glyph `fa-arrow-right-arrow-left`); `IMAGE_BUTTONS_TOGGLE_SHOW_ALL_COMMANDS_ACTIVE` = `fa-terminal red`; `ToggleDesignModeCommand@active` = `fa-paintbrush red`; `ACTIVE_STATE_CHILD_INACTIVE` = `fa-pause yellow` gegen `ACTIVE_STATE_INACTIVE` (`%ICONS_BUTTON_PAUSE%`) und `INACTIVE` (`fa-stop`); `ICON_SHOW_INHERITED_VARIABLES_ACTIVE` zeigt auf dasselbe Glyph (`fa-diagram-project`) wie der inaktive Zustand.

**Deaktiviert**: 318 Theme-Icons sind `…_DISABLED` o. ä. und zeigen per `%…%` auf denselben Glyphen. Dieser Zustand kostet bei einem Bibliothekswechsel nichts, weil er schon heute nicht am Glyph hängt.

**Glyphen mit solid und regular zugleich im Bestand** (Hinweis auf Zustands- oder Gewichtsunterschied, jeweils beide Stile in produktiver Nutzung): `clock`, `user`, `file`, `folder-open`, `copy`, `plus-square`, `eye`, `eye-slash`, `dot-circle`, `star`, `circle`, `calendar-alt`, `bookmark`, `window-maximize`, `window-restore`, `image`. Bei Bootstrap Icons gibt es zusammen mit der Variante `-fill` im Bestand: `exclamation-triangle`, `info-circle`, `person`, `play`, `puzzle`, `question-circle` (dort ist `-fill` aber meist Gewicht, kein Zustand).

**Lucide-Folgerung (reine Feststellung):** Für „an/aus“ über solid/regular (Radio, Stern, Häkchen) hat Lucide kein Paar; dort bleibt nur ein anderes Icon (`square` ↔ `square-check`, `circle` ↔ `circle-dot`, `toggle-left` ↔ `toggle-right`) oder eine CSS-Füllung.

## Gefundene Schreibweisen

Alle Wege, auf denen ein Glyph heute in den Bestand kommt (Fundzahlen produktiv, ohne Tests, Doku, Specimen, Bibliotheks-Module, Migrationswerkzeug; Zeilen mit mehreren Treffern zählen mehrfach):

| # | Schreibweise | Beispiel | Anzahl | Ort |
|---|---|---|---:|---|
| 1 | `css:fa-solid fa-X` (auch `fa-regular`, `fa-brands`) | `css:fa-solid fa-trash-can` | 411 | Theme-Settings, Views, Layouts, TS |
| 2 | `css:fas fa-X` / `far` / `fab` (Font Awesome 5, Kurzform) | `css:fas fa-users` | 247 | Layouts, Modelle, Theme-Settings Demo |
| 3 | `css: fa-solid fa-X` mit Leerzeichen nach `css:` | `css: fa-solid fa-chart-pie` | 3 | `…reporting.flex/…/theme-settings.xml:5`, `themes.core` (`fa-notdef`) |
| 4 | `css:bi bi-X` | `css:bi bi-x-lg` | 708 | React-Views (548 in `*.view.xml`), `@DefaultValue` in Java-`Icons`, TS |
| 5 | `colored:fas fa-X …` (mehrfarbig, mit Overlay-Wort) | `colored:fas fa-user overlay-add` | 9 | Layouts (Dialoge) |
| 6 | Java `ThemeImage.cssIcon("bi bi-X")` ohne Präfix `css:` | `cssIcon("bi bi-check-circle")` | 4 (alle `cssIcon("`-Aufrufe im produktiven Java) | `CoverageStatusResourceProvider.java:21-30` |
| 7 | `@DefaultValue("css:…")` an `ThemeImage`-Feldern von `Icons`-Klassen (Engine-Vorgabe, das Theme kann überschreiben) | `@DefaultValue("css:bi bi-box")` | 174 Glyph-Treffer in 124 Java-Dateien (in 1 und 4 enthalten) | `com.top_logic.layout.view/…/designer/Icons.java` (7), `…/form/Icons.java` (6), `com.top_logic/…/layout/Icons.java` (5) u. a. |
| 8 | Theme-Variable: `<icon name="…Icons.X" value="css:…"/>` oder `expr="css:…"` | `<icon name="ICONS_COMPARE" value="css:fa-solid fa-arrow-right-arrow-left"/>` | 919 Definitionen in 29 Theme-Dateien (333 mit fa/bi-`css:`, 318 `%…%`-Verweise, 226 Bilddateien, 36 `colored:tl-icon`, 2 `colored:fa`, 4 sonstige) | `**/themes/**/theme-settings.xml` |
| 9 | Indirekt über Theme-Variable: `expr="%ICON_PLUS%"`, `image="%…%"` | `expr="%ICON_PLUS%"` | 318 Verweise | Theme-Settings, Layouts |
| 10 | Indirekt über Präfix `theme:KEY` bzw. `css:ICON_X` | `"theme:ICONS_…"`, `@FormattedDefault("css:ICON_PLAY")` | 550 Strings `theme:…`, 2 mal `css:ICON_…` | `FinishTaskCommand.java:92`; `ThemeImage.THEME_PREFIX = "theme:"` |
| 11 | TS-Konstanten in der React-Brücke | `export const ICON_ADD = 'css:fa-solid fa-plus'` | 58 Zeilen | `com.top_logic.layout.react/react-src/bridge/icons.ts` |
| 12 | Lokale TS-Konstanten je Control | `const CHEVRON = 'css:fa-solid fa-chevron-right'` | ca. 13 Dateien (je 1 bis 4) | `TLAccordion.tsx`, `TLBreadcrumb.tsx`, `TLPanel.tsx`, `MuiMenuTriggerAdapter.tsx` … (laut `icons.ts`-Kommentar eigentlich unerwünscht, aber vorhanden) |
| 13 | TLScript-Ausdrücke mit Icon-String | `<icon>if($x…, 'css:bi bi-flag', …)</icon>`, `icon("css:far fa-user")` | 4 Dateien | `tree-table-display-demo.view.xml`, `extension.Contacts.model.xml`, `Ticket_27517_…migration.xml` |
| 14 | Als Klassenliste in HTML/JS | `class="fa-solid fa-…"` | 23 (13 JS, 10 HTML) | `templates.js` und `*-template.html` (tl-build_doclet), `table.js`, `mdtimepicker.js`, `…BUTTON_BAR_TEMPLATE.template.html` |
| 15 | Farb-/Overlay-Zusätze nach dem Glyphen | `css:fa-solid fa-play green`, `fa-terminal red` | 23 | Theme-Settings, Layouts |
| 16 | Eigener Icon-Font statt Font Awesome | `colored:tl-icon form`, `css:tl-icon arrow-half-circle` | 295 Zeilen | Themes, `tl_iconFont.css` (369 Treffer `tl-icon`), `TLIcon.tsx`, `TLIconSelect.tsx` |
| 17 | SVG-Dateien, die aus Font Awesome exportiert wurden (`svg-inline--fa`) | `eye-slash-regular.svg`, `simplelink.svg` | 8 Dateien | `com.top_logic.umljs/…/context-pad/`, `com.top_logic.layout.wysiwyg/…/ckeditor/plugins/` |
| 18 | Migrationstabellen alt→neu | `{ "bi bi-trash3", "fa-solid fa-trash" }` | 155 Paare + `imageIconFontMapping.txt` | `com.top_logic/…/ticket28386/IconReplacer.java`, `com.top_logic.layout.icons/scripts/imageIconFontMapping.txt` |
| 19 | Zur Laufzeit gespeichert: Icon-Picker schreibt `css:…` in Modellinstanzen/Konfiguration der Kunden | `value="css:fa-solid fa-home"` (Doku in `ThemeIcon.tsx:20`) | nicht im Repo zählbar | Kundendaten, `TLIconSelect.tsx` |
| 20 | CSS-Selektoren auf Glyphnamen | `a.input-image.tristate .bi-x-octagon-fill`, `.bi-exclamation-triangle-fill`, `.bi-info-circle-fill`, `.bi-info-square` | 8 | `com.top_logic.themes.core/src/main/webapp/style/form.css:2756-2776` (Kopplung des Tristate-Meldungsstils an vier Bootstrap-Glyphen); dazu `…formeditor/…/PDFExport/pdfExport.css:47,67` bindet FA-Schriftdateien (`fa-regular-400`, `fa-brands-400`) |
| 21 | Design-System-Specimen (nicht Produktion) | `class="bi bi-x-lg tl-icon-md"` | 346 Fundstellen | `tl-design-system/src/components/*/*.spec.html`, `specimen/mock/` |

Nicht vorkommend (gesucht, nichts gefunden): `fa-fw`, `fa-spin`, `fa-lg`, `fa-2x` und andere FA-Größen-/Animations-Modifier als Klassen; dynamisch zusammengesetzte Glyphnamen (`"fa-" + name`, Template-Strings mit `${…}` hinter `fa-`/`bi-`); andere Icon-Bibliotheken (`@mui/icons-material`, Lucide, Material Icons, Feather, Heroicons, Tabler) in Quell- oder Build-Dateien; Treffer außer der Dokumentation für `fal`/`fad`.

**Modifier** (keine Glyphen), Häufigkeit über alle durchsuchten Zeilen ohne Bibliotheks-Module (inkl. Tests/Specimen): `fa-solid` 610, `fa-regular` 15, `fa-brands` 0; Kurzformen `fas` / `far` / `fab` 247 (Fall 2, davon 11 `fab`); `bi` ist Pflichtklasse vor jedem `bi-X` (708 allein in der Form `css:bi bi-X`). Als Präfix der Kodierung: `css:`, `colored:`, `theme:`, `mime:`, `large:`, `i18n:` (Konstanten in `ThemeImage.java:60-110`); nur `css:` und `colored:` tragen Font-Glyphen.

## Offene Punkte der Erhebung

- Lucide-Urteil „sinngemäß“ und „unsicher“ ist meine Bedeutungsabwägung, keine Sichtprüfung der Zeichnungen. Bei `unsicher` fehlt dem Lucide-Icon ein Zusatzmerkmal (z. B. `bi-bookmark-star` → `bookmark` ohne Stern) oder die Bedeutung ist nicht eindeutig (`fa-share`, `bi-stop`, `bi-diagram-2/3`).
- Fundstellen zählen **Vorkommen**, nicht Aufrufe: ein Theme-Icon (z. B. `ICONS_BUTTON_CLOSE` = `fa-xmark`) zählt einmal in der Definition, wird aber über `%…%` und die Java-`Icons`-Konstanten hundertfach benutzt. Die Nutzung über Schlüssel (`Icons.X`, `%KEY%`) ist **nicht** in den Glyph-Zahlen enthalten.
- Bilddateien als Icons (226 Theme-Definitionen mit `/…png|svg`) und das `tl-icon`-System sind nicht Teil der Glyphzählung.
- Kundenprojekte sind nicht einsehbar; ihre Konfiguration (Fall 8 bis 13, 19) benutzt dieselben Schreibweisen, die Zahlen für Kunden lassen sich nur schätzen.
- `bi|git` und `bi|file-earmark-pdf` u. ä. sind Format-/Marken-Symbole; Lucide hat dafür nur neutrale Ersatzbilder.

## Genaue Befehle

`R` = `/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/TopLogic 8 (NewUI)`, alles gegen `origin/master` (`d4d9867579`), nichts ausgecheckt. Alle Zwischenstände und Skripte liegen in `/private/tmp/claude-501/-Users-hendrik-Claude-TopLogic-v8-DesignSystem/6b30f8e8-1b88-41d2-a12a-374a361292d0/scratchpad/` (`py/agg.py`, `py/lu.py`, `py/map.py`, `py/gen.py`, `py/md.py`).

```sh
# Stand holen
git -C "$R" fetch origin master

# 1) Alle Treffer, einzeln (nur der Token), alle Dateitypen ausser Binärdateien: 7654 Zeilen inkl. Bibliotheks-Module
git -C "$R" grep -n -I -o -E '(^|[^a-zA-Z0-9_-])(fa-[a-z0-9-]+|bi-[a-z0-9-]+)' origin/master -- . \
  ':!*.min.js' ':!*.min.css' ':!*.woff*' ':!*.svg' ':!*package-lock.json' > raw.txt

# 2) Ganze Zeilen ohne die beiden Bibliotheks-Module (Grundlage der Zählung): 2472 Zeilen
git -C "$R" grep -n -I -E '(^|[^a-zA-Z0-9_-])(fa-[a-z0-9-]+|bi-[a-z0-9-]+|fa-(solid|regular|brands)|(fas|far|fab|fal|fad) )' origin/master -- . \
  ':!*.min.js' ':!*.min.css' ':!*.svg' ':!*package-lock.json' ':!ext.com.fontawesome' ':!ext.com.bootstrap.icons' > lines.txt

# 3) Aggregation (Python 3, -I): je Zeile Klassenfolge [A-Za-z0-9_ -]* mit fa-/bi-Token;
#    Modifier (solid, regular, fw, spin, lg, 2x, ...) sind keine Glyphen; Stil aus Nachbartoken (fas|fa-solid -> solid, far|fa-regular -> regular, fab|fa-brands -> brands)
python3 -I py/agg.py "$S"      # schreibt agg.json: {"fa|name": {kategorie: [[pfad, zeile, stil], ...]}}
#    Kategorien je Pfad: lib (ext.com.*), mapping (IconReplacer.java), ds (tl-design-system/), test (/src/test/, .test., /test/),
#    doc (*.md, *.txt, /webapp/doc/), config (xml, properties, json, bpml, proto), code (alles Übrige)
#    "produktiv" = code + config. Ausgeschlossene Nicht-Glyphen (Schriftdateinamen, Fliesstext): fa-brands-400, fa-regular-400, fa-solid-900, fa-font-awesome

# 4) Schreibweisen / Stichproben
git -C "$R" grep -h -I -o -E '"?css: ?[a-zA-Z][a-zA-Z0-9 _-]*' origin/master -- '*.xml' '*.java' '*.ts' '*.tsx' '*.properties'   # Präfixe
git -C "$R" grep -h -I -o -E 'colored: ?[a-zA-Z0-9 _-]*' origin/master -- . ':!*.md'                                              # colored:
git -C "$R" grep -I -n 'cssIcon("' origin/master -- '*.java' ':!*/src/test/*'                                                     # 4 Treffer
git -C "$R" grep -I -h -o -E '["'"'"'>]theme:[A-Za-z_.0-9]+' origin/master -- . ':!*/src/test/*' | wc -l                           # 550
git -C "$R" grep -I -n -E 'activeImage|@active|inactiveImage' origin/master -- . ':!ext.*' ':!tl-design-system' ':!*/src/test/*'  # Zustandspaare in Layouts
git -C "$R" grep -I -n -E 'if *\(.*(css:)?(fa|bi)-[a-z]' origin/master -- '*.xml' ':!*/src/test/*'                                 # TLScript-Bedingungen
git -C "$R" grep -I -l -E '@mui/icons-material|lucide|material-icons|feather|heroicons|tabler' origin/master -- '*.json' '*.ts' '*.tsx' '*.css' '*.xml' ':!*package-lock.json'  # andere Bibliotheken
# Theme-Icon-Definitionen: 29 Dateien theme-settings*.xml / themes/*.xml, Regex <icon\s+name="..."\s*(value|expr)="..."> mit git show (Skript inline, Ergebnis icondefs.json)

# 5) Lucide
npm view lucide-static version                                              # 1.74.0
curl -sSL https://unpkg.com/lucide-static@1.74.0/tags.json -o tags.json     # 2089 Namen
curl -sSL https://unpkg.com/lucide-react@1.74.0/dist/esm/lucide-react.mjs -o lr.mjs   # enthält Alias-Zuordnung (Pascal-Name -> Datei)
curl -sSL https://unpkg.com/lucide-react@1.74.0/dist/esm/icons/index.mjs -o idx.mjs
# jede zugeordnete Lucide-Bezeichnung gegen lucide-static geprüft (199 Namen, alle HTTP 200):
curl -s -o /dev/null -w '%{http_code}' https://unpkg.com/lucide-static@1.74.0/icons/<name>.svg
python3 -I py/lu.py "$S"    # automatischer Abgleich: gleicher Name bzw. Alias -> exakt
python3 -I py/gen.py "$S"   # + manuelle Zuordnung py/map.py (S = sinngemäß, U = unsicher, K = keine)
```
