# Erhebung Bilddateien und Icon-Quellen in tl-engine-7

Stand: `origin/master` (nach `git fetch`), Lucide: `lucide-static` **1.77.0** (`npm view lucide-static version`, Namensliste `https://unpkg.com/lucide-static@1.77.0/tags.json`, 2098 Icons). Gelesen wurde nur der Git-Baum von `origin/master`, kein Arbeitsbaum; ein Auszug liegt im Scratchpad (`src/`).

## 1. Kopfzahlen

**Bestätigt oder korrigiert**

- 1175 Bilddateien (`png|gif|jpg|jpeg|svg|ico`) außerhalb `/test/`, `/doc/`, `node_modules`, `ext.com.fontawesome`, `ext.com.bootstrap.icons`: **bestätigt**. Davon 1 Eintrag `tl_iconFont.svg` (SVG-Schriftdatei, kein Bild), 492 sind Font-Quell-SVGs (siehe unten).
- `/themes/`: **443**, nicht 447 (384 png, 57 svg, 1 gif, 1 jpg); die 4 Differenz-Dateien liegen unter `/doc/` oder `/test/` und fallen durch denselben Filter.
- `theme-settings.xml` mit `value="/….(png|gif|svg)"`: **226 Einträge** in 10 `theme-settings.xml`, bestätigt. Sie zeigen auf **220 verschiedene Dateien** (zwei Einträge teilen sich oft eine Datei, z. B. `KOMetaAttr.png`). Dazu 4 weitere Bildverweise als Theme-Strings `url(/…)` (`MC_MINIMIZE_ICON`, `MC_NORMALIZE_ICON`, `COLORCHOOSER_NO_COLOR`, `FORM_EDITOR_BUTTON_MOVE`, gelesen über `var(--…)` in `tabbar.css`/`form.css`), und 4 `@DefaultValue("…png|gif")` in Java.
- **`tl-icon`: 252 Glyphen im Font** (CSS `tl_iconFont.css`, `.tl-icon.<name>::before`), nicht ca. 40. Im Repo benutzt werden **32** davon. Die „295 Fundstellen“ von `colored:tl-icon` bestehen aus **257 Zeilen im Migrationsskript** `com.top_logic.layout.icons/scripts/imageIconFontMapping.txt` (keine Verwendung) plus 38 sonstigen Zeilen. Echte Verwendungen (`css:tl-icon` und `colored:tl-icon`): **46 Stellen**, davon 39 in `theme-settings.xml` und 7 in Java (`layout/Icons.java`, 3 `@DefaultValue`), Modell (`tl.changelog.model.xml`) und Layouts (`maintabbar.template.xml`, 2 Demo-Layouts); dazu die Chooser-Konfiguration `tl-layout-icons.conf.config.xml`. Zusammen **32 Glyphen**.
- Es gibt **keinen** Theme-Schlüssel, der in mehreren Themes auf verschiedene Dateien zeigt. Die Settings liegen fast nur im Theme `core` (580 Einträge, davon 223 Bildpfade); `coreSidebar` wiederholt nur `IMAGES_APP_LOGO`, `IMAGES_APP_LOGO_MINIMIZED`, `Icons.APP_LOGO` mit demselben Pfad. Varianten je Theme entstehen nur über Datei-Überschreibung gleichen virtuellen Pfads: `images/appLogo.svg` (Modul `com.top_logic`, Demo und Demo-Theme `dark`). Darüber hinaus liegen 23 virtuelle Pfade in zwei Modulen (17 byteidentisch, 6 verschieden: `appLogo.svg` und 5 Baum-Knoten-PNGs `tree/prod/i.png`, `tree/proj/{i,p,sp,wp}.png` in `com.top_logic.element` und `com.top_logic.themes.core`).

**Urteilsregeln.** *gelesen*: Fundstelle in Code/Konfiguration (Pfad, Dateiname oder Theme-Schlüssel mit Leser). *tot*: weder Pfad, Dateiname noch Schlüssel irgendwo gelesen. *unsicher*: nur dynamisch oder zusammengesetzt denkbar. *nur Test*: nur in Test-Code. *Build-Quelle*: Eingabe der Font-Erzeugung, zur Laufzeit nicht gelesen. „Gelesen“ heißt: ein Leser existiert; ob dessen Klasse im React-Pfad erreichbar ist, wurde nur dort geprüft, wo es ausdrücklich vermerkt ist (Leser klassisch = JSP/Classic-Control-Welt).

**Alle 1175 Dateien**

| Art | gelesen | unsicher | nur Test | tot | Build-Quelle | Summe |
|---|--:|--:|--:|--:|--:|--:|
| Icon | 152 | 106 | 5 | 162 | 492 | 917 |
| Spinner | 6 | 0 | 0 | 1 | 0 | 7 |
| Bild | 56 | 0 | 0 | 23 | 0 | 79 |
| Bedienteil | 52 | 18 | 14 | 80 | 0 | 164 |
| Schrift | 8 | 0 | 0 | 0 | 0 | 8 |
| **Summe** | **274** | **124** | **19** | **266** | **492** | **1175** |

**Davon Produkt/Engine (ohne Demo, Fremd, Schrift)**

| Art | gelesen | unsicher | nur Test | tot | Build-Quelle | Summe |
|---|--:|--:|--:|--:|--:|--:|
| Icon | 86 | 94 | 4 | 147 | 492 | 823 |
| Spinner | 1 | 0 | 0 | 1 | 0 | 2 |
| Bild | 24 | 0 | 0 | 12 | 0 | 36 |
| Bedienteil | 27 | 3 | 14 | 80 | 0 | 124 |
| **Summe** | **138** | **97** | **18** | **240** | **492** | **985** |

**Davon Demo-Module**

| Art | gelesen | unsicher | nur Test | tot | Build-Quelle | Summe |
|---|--:|--:|--:|--:|--:|--:|
| Icon | 19 | 0 | 1 | 15 | 0 | 35 |
| Spinner | 1 | 0 | 0 | 0 | 0 | 1 |
| Bild | 29 | 0 | 0 | 0 | 0 | 29 |
| Bedienteil | 3 | 0 | 0 | 0 | 0 | 3 |
| **Summe** | **52** | **0** | **1** | **15** | **0** | **68** |

**Davon Fremdbestand (ext.* und Fremdcode)**

| Art | gelesen | unsicher | nur Test | tot | Build-Quelle | Summe |
|---|--:|--:|--:|--:|--:|--:|
| Icon | 47 | 12 | 0 | 0 | 0 | 59 |
| Spinner | 4 | 0 | 0 | 0 | 0 | 4 |
| Bild | 3 | 0 | 0 | 11 | 0 | 14 |
| Bedienteil | 22 | 15 | 0 | 0 | 0 | 37 |
| Schrift | 7 | 0 | 0 | 0 | 0 | 7 |
| **Summe** | **83** | **27** | **0** | **11** | **0** | **121** |

Hinweis zur Zeile „Icon, Build-Quelle“: 264 SVG in `com.top_logic.layout.icons/icons/` (Font-Quelle, 252 davon sind Glyphen, 12 nicht: `file-knowledgeObject`, `file-metaAttribute`, `file-metaClass`, `overlay-add|create|export|gear|import|remove|reset|search`, `type-iO`) und 228 in `icons/raw/` (Rohfassungen, 225 mit gleichnamiger Datei in `icons/`, 3 ohne: `maximize-document`, `traffic`, `unlocked`).

## 2. Löschvorschlag, erst nach Abschalten der Legacy-Oberfläche (tot)

**Vorgemerkt, nicht gelöscht** (23.11., #30478): Bernhard lehnte !2442 ab — „unbenutzt“ ist relativ, z. B. ist
`com.top_logic.demo/…/themes/core/demo/new-as.svg` die Quelle eines Icons, das die Legacy-Demo zeigt. Löschen wir die
SVG, bleibt das PNG ohne Quelle. Die 210 Dateien des PRs stehen in `bild-loeschvorschlag-legacy.txt`. **Wenn die
Legacy-Oberfläche abgeschaltet ist:** je Datei prüfen, ob das zugehörige Bild (PNG/GIF gleichen Namens) und sein
Leser ebenfalls weg sind; erst dann Datei und Quelle gemeinsam löschen.

Kriterium: keine Fundstelle per Pfad, Dateiname (auch ohne Pfad) oder Theme-Schlüssel. Der Schlüssel wurde nicht nur nach Name, sondern geprüft: bei `Icons.X` im selben Paket oder per Import, bei Kurzschlüsseln als Token. Fremdmodule (`ext.*`) stehen weiter unten.

### 2a. Ganze Ordner tot (15 Ordner, 96 Dateien)

| Ordner | Dateien | Inhalt |
|---|--:|---|
| `com.top_logic.element/images/popup` | 3 | Chooser-Buttons 16 px (clearChooser, openChooser) |
| `com.top_logic.element/images/tristate/mandatory` | 7 | Checkbox-Zustände mit Pflicht-Markierung |
| `com.top_logic.element/themes/core/grid` | 6 | createGrid, openDetail (PNG und SVG) |
| `com.top_logic.element/themes/core/icons` | 3 | addColumnLeft, addRowTop, quote48 (Schlüssel ohne Leser) |
| `com.top_logic.reporting.office/J/reporting/office/doc-files` | 1 | JavaDoc-Bild |
| `com.top_logic.themes.core/themes/core/accumulatedTristate/mandatory` | 8 | Checkbox-Zustände mit Pflicht-Markierung |
| `com.top_logic.themes.core/themes/core/beacon/traffic` | 6 | Ampel horizontal 66x22 (Schlüssel gibt es nicht) |
| `com.top_logic.themes.core/themes/core/mimetypes/large` | 38 | Dateityp-Icons 32–60 px, alte Namen (DOCFile, Person-60 …), kein Schlüssel |
| `com.top_logic.themes.core/themes/core/mimetypes/large/tl` | 1 | webfolder.png |
| `com.top_logic.themes.core/themes/core/tree/breadcrumb` | 14 | Breadcrumb-Sprites; Schlüssel BREADCRUMB_* zeigen längst auf `tl-icon caret-*` |
| `com.top_logic/J/knowledge/journal` | 2 | JavaDoc-Bilder |
| `com.top_logic/J/tool/boundsec/compound` | 2 | JavaDoc-Bilder |
| `com.top_logic/J/tool/boundsec/doc-files` | 1 | JavaDoc-Bild |
| `com.top_logic/images/logos` | 3 | logo_bos_large/small, logo_tl_large (Logos, ohne Leser) |
| `com.top_logic/images/people` | 1 | unknown.jpg |

### 2b. Einzeln tot in sonst genutzten Ordnern (159 Dateien)

| Ordner | tot von gesamt | Dateien |
|---|--|---|
| `com.top_logic.demo/themes/core/demo` | 15 von 34 | as-large.svg, dialog-action.png, dialog-action.svg, dialog-icon.svg, ls.png, new-ap.svg, new-as-child.svg, new-as.svg, new-bp.svg, new-bs-child.svg, new-bs.svg, new-cp.svg, new-cs-child.svg, new-cs.svg, xs.png |
| `com.top_logic.element/images/tristate` | 3 von 6 | dontcare_disabled.png, false_disabled.png, true_disabled.png |
| `com.top_logic.element/themes/core/mimetypes` | 1 von 12 | workItem.png |
| `com.top_logic.kafka/themes/core/kafka` | 1 von 3 | Messages.svg |
| `com.top_logic.layout.wysiwyg/script/ckeditor/plugins/simplelink/icons` | 1 von 2 | simplelink.svg |
| `com.top_logic.layout.wysiwyg/script/ckeditor/plugins/tlobjectlink/icons` | 1 von 2 | tlobjectlink.svg |
| `com.top_logic.reporting/J/reporting/chart/demo/img` | 3 von 8 | m.png, r.png, tp.png |
| `com.top_logic.themes.core/style` | 1 von 2 | fotorama@2x.png |
| `com.top_logic.themes.core/themes/core/beacon` | 15 von 20 | empty.svg, empty_inactive.png, empty_inactive.svg, green.svg, green_inactive.png, green_inactive.svg, red.svg, red_inactive.png, red_inactive.svg, white.svg, white_inactive.png, white_inactive.svg, yellow.svg, yellow_inactive.png, yellow_inactive.svg |
| `com.top_logic.themes.core/themes/core/beacon/balls` | 9 von 13 | Gray.png, Green.svg, GreenOk.png, GreenOk.svg, Red.svg, RedCross.png, RedCross.svg, White.svg, Yellow.svg |
| `com.top_logic.themes.core/themes/core/colorchooser` | 3 von 7 | noColor.png, resetColors.png, resetColors.svg |
| `com.top_logic.themes.core/themes/core/icons` | 8 von 19 | FileInfo.png, buttonEmpty.svg, invertSelection.svg, minimizeMinimized.svg, minimizeNormal.svg, sort-config.svg, sortElementsDisabled.png, tree-leaf.png |
| `com.top_logic.themes.core/themes/core/inspector` | 9 von 16 | private.svg, privateList.svg, privateMap.svg, privatePrimitive.svg, public.png, public.svg, publicList.svg, publicMap.svg, publicPrimitive.svg |
| `com.top_logic.themes.core/themes/core/mimetypes` | 24 von 37 | Group-16.png, Group.svg, Person-16.png, Unit.svg, bmp.png, dot.png, dsf.png, eps.png, exe.png, gif.png, mmp.png, mov.png, mpf.png, png.png, pot.png, ppf.png, rm.png, rtf.png, smallLink.png, url.png, vsd.png, wmv.png, workItem.png, xlt.png |
| `com.top_logic.themes.core/themes/core/mimetypes/tl` | 8 von 10 | Clipboard.png, Milestone.png, document.png, fc.png, link.png, programm.png, project.png, role.png |
| `com.top_logic.themes.core/themes/core/misc` | 1 von 2 | unknownPerson.jpg |
| `com.top_logic.themes.core/themes/core/misc/compare` | 5 von 16 | open-compare-view.png, overlay-view.svg, showNextChange.svg, side-by-side-view.svg, unchanged.svg |
| `com.top_logic.themes.core/themes/core/tree` | 18 von 26 | c.png, e.png, fc.png, fo.png, i.png, mf.png, ml.png, mnl.png, newElement.png, newElementDisabled.png, pf.png, pl.png, pnl.png, r.png, root.png, tree-collapsed.png, tree-expanded.png, v.png |
| `com.top_logic.themes.core/themes/core/tree/prod` | 8 von 10 | c.png, cGreen.png, cRed.png, cYellow.png, p.png, pGreen.png, pRed.png, pYellow.png |
| `com.top_logic.themes.core/themes/core/tree/proj` | 3 von 9 | a.png, t.png, troot.png |
| `com.top_logic.themes.core/themes/core/tree/table` | 19 von 23 | c.png, e.png, fc.png, fo.png, i.png, l.png, mf.png, ml.png, mnl.png, ms.png, newElement.png, pf.png, pl.png, pnl.png, ps.png, r.png, root.png, s.png, v.png |
| `com.top_logic/images` | 1 von 7 | preview_empty.png |
| `com.top_logic/images/icons` | 2 von 3 | button-background.png, loading.gif |

Begründungsmuster der Einzelfälle: (a) SVG-Zwilling, bei dem nur die PNG-Fassung per Schlüssel eingetragen ist; (b) Theme-Schlüssel gestrichen, Dateien geblieben (Baum: `c e r root fc fo mf ml pf pl v …`); (c) alte Fassungen (`beacon/*_inactive`, `*.svg` der Ampel, `balls/*.svg`, `Gray.png`, `GreenOk`, `RedCross`). Die Dateien `beacon/{empty,green,red,yellow,white}.png` fehlen hier absichtlich (siehe 8, unsicher).

### 2c. Fremdbestand, tot (11 Dateien)

- `ext.com.ckeditor/script/ckeditor/samples/**` (CKEditor-Beispielseiten: `img/*` 6, `old/assets/sample.jpg`, `old/assets/inlineall/logo.png`, `toolbarconfigurator/font/fontello.svg`), 9 Dateien, tot.
- `ext.com.meterware.httpunit/favicon.ico`, `temp.gif`: Testfixtures des httpunit-Moduls, 2 Dateien.

### 2d. Nur Test (kein Produktleser, 19 Dateien)

`tree/proj/*` und `tree/prod/{i,iO}` (je in `com.top_logic.element` und `com.top_logic.themes.core`, nur von Test-Modellen `projElement.model.xml` u. ä. gelesen), `demo/dialog-icon.png` (nur Test-JSP), UML-Kleinteile `umljs/…/eye-slash-regular.svg`, `palette/create_label.svg` (nur `src-js/test/assets/custom.css`). Löschen zusammen mit den Test-Modellen; Reihenfolge: erst Test-Modelle, dann Bilder.

## 3. Icons mit Lucide-Kandidat

Umfang: Icons, die gelesen, unsicher oder nur im Test gelesen sind und außerhalb von `ext.*`, Font-Quellen und CKEditor-Plugins liegen (193 Dateien). Tote Icons stehen in Abschnitt 2; Font-Glyphen in Abschnitt 6; Fremd-Icons (pdf.js, CKEditor) bleiben bei ihren Paketen (47 gelesen, 12 unsicher: pdf.js `annotation-*`, `gv-toolbarButton-download`, `magicline`, `showblocks`).

Hinweis zu Lucide: die Icons sind einfarbig (Strich). Mehrfarbige Altbilder (Ampel, Beacon, Vergleichs-Markierungen) verlieren die zweite Farbe; die Farbe kommt dann aus dem Token (Status-Rolle), wie es das Migrationsskript mit `circle-light icon-green` schon vorsah. „+ Overlay“ heißt: Basisform aus Lucide, Zusatzmerkmal als Overlay neu zeichnen.

Mechanik für die *mime-Schlüssel* (Urteil „unsicher“): `DefaultResourceProvider.getTypeImage(type, flavor)` und `ThemeImage.typeIcon(type)` lesen die Theme-Variable `mime.<Typname>` (bzw. `.large`); `TLMimeTypes.getMimeTypeImage` und `DownloadImageRenderer` lesen `mime.<Content-Type>`; `ImageVisitor`/`TLPartResourceProvider` hängen `@mandatory`, `@containment`, `@multiple` an Modell-Teile (`TLProperty`, `TLReference`, `TLAssociationEnd`). Ob ein Schlüssel gebraucht wird, hängt vom Typ des gezeigten Objekts ab; der Typname selbst steht nicht im Code. Die Modell-Teile `TLProperty|TLReference|TLAssociationEnd|TLClassifier|TLPrimitive|TLAssociation` sind darum als gelesen (dynamisch) geführt, alle anderen als unsicher.


### `c.tl.demo/themes/core/demo` (18)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| Milestone.png | 16x16 | gelesen | Meilenstein | `milestone` | Schlüssel c.tl.demo.layout.gantt.Icons.MILESTONE in DemoGanttNodeBuilder.java |
| a.png | 18x18 | gelesen | Demo-Typ A | `file` | Schlüssel DEMO_A in DemoPlain.model.xml |
| as-large.png | 60x60 | gelesen | Demo-Typ A groß | `file` | Pfad/Name in TestLargeImageProvider.java |
| as.png | 18x18 | gelesen | Demo-Typ A (Aspekt) | `file` | Schlüssel DEMO_AS in DemoSecurity.model.xml, tl.demo.aspect.model.xml |
| b.png | 18x18 | gelesen | Demo-Typ B | `file` | Schlüssel DEMO_B in DemoPlain.model.xml |
| bs.png | 18x18 | gelesen | Demo-Typ B (Aspekt) | `file` | Schlüssel DEMO_BS in DemoSecurity.model.xml, tl.demo.aspect.model.xml |
| c.png | 18x18 | gelesen | Demo-Typ C | `file` | Schlüssel DEMO_C in DemoPlain.model.xml |
| cs.png | 18x18 | gelesen | Demo-Typ C (Aspekt) | `file` | Schlüssel DEMO_CS in DemoTypes.model.xml, tl.demo.aspect.model.xml |
| dialog-icon.png | 48x48 | nur Test | Demo-Dialog | `square-pen` | nur Test-Code: TestPageLayoutEdit.jsp |
| new-ap.png | 22x22 | gelesen | Demo: A anlegen | `file-plus` | Schlüssel DEMO_NEW_AP in demoPlainView.layout.xml, tree_grid_table.xml |
| new-as-child.png | 22x22 | gelesen | Demo: A-Kind anlegen | `folder-plus` | Schlüssel DEMO_NEW_AS_CHILD in tree_grid.xml |
| new-as.png | 22x22 | gelesen | Demo: A anlegen | `file-plus` | Schlüssel DEMO_NEW_AS in demoChartCockpit.xml, editStructureWithExport.xml, tree_grid.xml |
| new-bp.png | 22x22 | gelesen | Demo: B anlegen | `file-plus` | Schlüssel DEMO_NEW_BP in demoPlainView.layout.xml |
| new-bs-child.png | 22x22 | gelesen | Demo: B-Kind anlegen | `folder-plus` | Schlüssel DEMO_NEW_BS_CHILD in tree_grid.xml |
| new-bs.png | 22x22 | gelesen | Demo: B anlegen | `file-plus` | Schlüssel DEMO_NEW_BS in editStructureWithExport.xml, tree_grid.xml |
| new-cp.png | 22x22 | gelesen | Demo: C anlegen | `file-plus` | Schlüssel DEMO_NEW_CP in demoPlainView.layout.xml |
| new-cs-child.png | 22x22 | gelesen | Demo: C-Kind anlegen | `folder-plus` | Schlüssel DEMO_NEW_CS_CHILD in tree_grid.xml |
| new-cs.png | 22x22 | gelesen | Demo: C anlegen | `file-plus` | Schlüssel DEMO_NEW_CS in editStructureWithExport.xml, tree_grid.xml |

### `c.tl.element/themes/core/mimetypes` (11)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| BoolMetaAttr.png | 14x16 | unsicher | Attributtyp Ja/Nein | `toggle-left` | mime-Schlüssel (dynamisch): BooleanMetaAttribute |
| CalcMetaAttr.png | 14x16 | unsicher | Attributtyp berechnet | `calculator` | mime-Schlüssel (dynamisch): CalculatedPrimitiveMetaAttribute |
| ClassMetaAttr.png | 14x16 | unsicher | Attributtyp Klassifikation | `list` | mime-Schlüssel (dynamisch): ClassificationMetaAttribute |
| DateMetaAttr.png | 14x16 | unsicher | Attributtyp Datum | `calendar` | mime-Schlüssel (dynamisch): DateMetaAttribute |
| FloatMetaAttr.png | 14x16 | unsicher | Attributtyp Dezimalzahl | `hash` | mime-Schlüssel (dynamisch): FloatMetaAttribute |
| KOMetaAttr.png | 14x16 | unsicher | Attributtyp Objektverweis | `link` | mime-Schlüssel (dynamisch): TypedWrapperMetaAttribute +2 |
| LongMetaAttr.png | 14x16 | unsicher | Attributtyp Ganzzahl | `hash` | mime-Schlüssel (dynamisch): LongMetaAttribute |
| TextMetaAttr.png | 14x16 | unsicher | Attributtyp Text | `type` | mime-Schlüssel (dynamisch): StringMetaAttribute |
| mandator.png | 14x16 | gelesen | Mandant | `building` | Schlüssel MIMETYPES_MANDATOR in mandatorStructure.model.xml |
| mandatorRoot.png | 14x16 | gelesen | Mandant (Wurzel) | `building` | Schlüssel MIMETYPES_MANDATOR_ROOT in mandatorStructure.model.xml |
| se.png | 14x16 | unsicher | Strukturelement | `folder-tree` | mime-Schlüssel (dynamisch): StructuredElement +1 |

### `c.tl.element/themes/core/mimetypes/tl` (2)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| RoleRule.png | 14x16 | unsicher | Rollenregel | `shield-check` | mime-Schlüssel (dynamisch): RoleRule |
| StoredQuery.png | 16x16 | unsicher | Gespeicherte Suche | `search` | mime-Schlüssel (dynamisch): tl.legacy.tabletypes.StoredQueryTable +1 |

### `c.tl.element/themes/core/tree/proj` (1)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| p.png | 14x16 | nur Test | Projekt-Knoten (Test) | – | nur Test-Code: projElement.model.xml |

### `c.tl.kafka/themes/core/kafka` (2)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| Messages22.png | 22x22 | gelesen | Nachrichten | `message-square` | Schlüssel KAFKA_MESSAGES22 in kafkaView.layout.xml |
| Sensor22.png | 22x22 | gelesen | Sensor | `radio-tower` | Schlüssel KAFKA_SENSOR22 in sensorView.layout.xml |

### `c.tl.kafka/themes/core/mimetypes/sensorState` (3)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| Active.png | 16x16 | unsicher | Sensor aktiv | `activity` | mime-Schlüssel (dynamisch): SensorActivityState.ACTIVE |
| Inactive.png | 16x16 | unsicher | Sensor inaktiv | `circle-pause` | mime-Schlüssel (dynamisch): SensorActivityState.INACTIVE |
| Running.png | 16x16 | unsicher | Sensor läuft | `play` | mime-Schlüssel (dynamisch): SensorActivityState.RUNNING |

### `c.tl.kafka/themes/core/mimetypes/sensorState/large` (3)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| Active60.png | 60x60 | unsicher | Sensor aktiv | `activity` | mime-Schlüssel (dynamisch): SensorActivityState.ACTIVE.large |
| Inactive60.png | 60x60 | unsicher | Sensor inaktiv | `circle-pause` | mime-Schlüssel (dynamisch): SensorActivityState.INACTIVE.large |
| Running60.png | 60x60 | unsicher | Sensor läuft | `play` | mime-Schlüssel (dynamisch): SensorActivityState.RUNNING.large |

### `c.tl.mail/themes/core/mimetypes` (3)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| Mail.png | 16x16 | unsicher | E-Mail | `mail` | mime-Schlüssel (dynamisch): tl.mail.Mail |
| MailExt.png | 16x16 | unsicher | E-Mail extern | `mail` | mime-Schlüssel (dynamisch): MailExt |
| MailFolder.png | 16x16 | unsicher | Mail-Ordner | `folder-open` | mime-Schlüssel (dynamisch): tl.mail.MailFolder |

### `c.tl.reporting/themes/core/mimetypes/tl` (1)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| StoredReport.png | 16x16 | unsicher | Gespeicherter Bericht | `file-chart-column` | mime-Schlüssel (dynamisch): tl.legacy.tabletypes.StoredReportTable |

### `tl.themes.core/themes/core/beacon` (5)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| empty.png | 22x22 | unsicher | leerer Platzhalter | – (Spacer, kein Icon) | zusammengesetzt: "/beacon/"+Name+".png" in AbstractGanttChartCreator (Reporting-Gantt); BeaconRenderer ist ohn |
| green.png | 22x22 | unsicher | Status grün | `circle` | zusammengesetzt: "/beacon/"+Name+".png" in AbstractGanttChartCreator (Reporting-Gantt); BeaconRenderer ist ohn |
| red.png | 22x22 | unsicher | Status rot | `circle` | zusammengesetzt: "/beacon/"+Name+".png" in AbstractGanttChartCreator (Reporting-Gantt); BeaconRenderer ist ohn |
| white.png | 22x22 | unsicher | Status leer/weiß | `circle` | zusammengesetzt: "/beacon/"+Name+".png" in AbstractGanttChartCreator (Reporting-Gantt); BeaconRenderer ist ohn |
| yellow.png | 22x22 | unsicher | Status gelb | `circle` | zusammengesetzt: "/beacon/"+Name+".png" in AbstractGanttChartCreator (Reporting-Gantt); BeaconRenderer ist ohn |

### `tl.themes.core/themes/core/beacon/balls` (4)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| Green.png | 22x22 | gelesen | Status grün | `circle` | Schlüssel BEACON_BALLS_GREEN in ElementMessages_de.properties, ElementMessages_en.properties, Messages_de.prop |
| Red.png | 22x22 | gelesen | Status rot | `circle` | Schlüssel BEACON_BALLS_RED in ElementMessages_de.properties, ElementMessages_en.properties, Messages_de.proper |
| White.png | 22x22 | gelesen | Status leer/weiß | `circle` | Schlüssel BEACON_BALLS_WHITE in ElementMessages_de.properties, ElementMessages_en.properties, Messages_de.prop |
| Yellow.png | 22x22 | gelesen | Status gelb | `circle` | Schlüssel BEACON_BALLS_YELLOW in ElementMessages_de.properties, ElementMessages_en.properties, Messages_de.pro |

### `tl.themes.core/themes/core/icons` (8)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| inputfield.svg | 10x10 | gelesen | Feldtyp Eingabefeld (Formeditor) | `text-cursor-input` | Schlüssel c.tl.layout.form.control.Icons.FORM_EDITOR__FLOAT in AttributeImageProvider.java |
| invertSelection.png | 22x22 | gelesen | Auswahl umkehren | `arrow-left-right` | Schlüssel c.tl.layout.form.treetable.component.Icons.INVERT_SELECTION in StructureEditComponent.java |
| invertSelectionDisabled.png | 22x22 | gelesen | Auswahl umkehren (deaktiviert) | `arrow-left-right` | Schlüssel c.tl.layout.form.treetable.component.Icons.INVERT_SELECTION_DISABLED in StructureEditComponent.java |
| selectSiblings.png | 22x22 | gelesen | Geschwister auswählen | `list-checks` | Schlüssel c.tl.layout.form.treetable.component.Icons.SELECT_SIBLINGS in StructureEditComponent.java |
| selectSiblingsDisabled.png | 22x22 | gelesen | Geschwister auswählen (deaktiviert) | `list-checks` | Schlüssel c.tl.layout.form.treetable.component.Icons.SELECT_SIBLINGS_DISABLED in StructureEditComponent.java |
| sort-config-60.png | 60x60 | gelesen | Sortierung konfigurieren | `arrow-up-down` | Schlüssel c.tl.layout.table.control.Icons.SORT_CONFIG_60 in SortConfigDialog.java |
| textarea.svg | 10x10 | gelesen | Feldtyp Textbereich (Formeditor) | `text-align-start` | Schlüssel c.tl.layout.form.control.Icons.FORM_EDITOR__STRING_MULTILINE in AttributeImageProvider.java |
| warn.png | 8x8 | gelesen | Warnhinweis an Feld | `triangle-exclamation-point` | Schlüssel c.tl.layout.form.control.Icons.WARN in ErrorControl.java |

### `tl.themes.core/themes/core/inspector` (7)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| private.png | 16x16 | gelesen | Inspector: privates Feld | `lock` | Schlüssel c.tl.layout.inspector.resources.Icons.PRIVATE in JavaFieldResourceProvider.java, PropertyDescriptorR |
| privateList.png | 16x16 | gelesen | Inspector: privat, Liste | neu zeichnen (lock + list) | Schlüssel c.tl.layout.inspector.resources.Icons.PRIVATE_LIST in JavaFieldResourceProvider.java, PropertyDescri |
| privateMap.png | 16x16 | gelesen | Inspector: privat, Map | neu zeichnen (lock + braces) | Schlüssel c.tl.layout.inspector.resources.Icons.PRIVATE_MAP in JavaFieldResourceProvider.java, PropertyDescrip |
| privatePrimitive.png | 16x16 | gelesen | Inspector: privat, primitiv | neu zeichnen (lock + hash) | Schlüssel c.tl.layout.inspector.resources.Icons.PRIVATE_PRIMITIVE in JavaFieldResourceProvider.java, PropertyD |
| publicList.png | 16x16 | gelesen | Inspector: öffentlich, Liste | neu zeichnen (lock-open + list) | Schlüssel c.tl.layout.inspector.resources.Icons.PUBLIC_LIST in JavaFieldResourceProvider.java, PropertyDescrip |
| publicMap.png | 16x16 | gelesen | Inspector: öffentlich, Map | neu zeichnen (lock-open + braces) | Schlüssel c.tl.layout.inspector.resources.Icons.PUBLIC_MAP in JavaFieldResourceProvider.java, PropertyDescript |
| publicPrimitive.png | 16x16 | gelesen | Inspector: öffentlich, primitiv | neu zeichnen (lock-open + hash) | Schlüssel c.tl.layout.inspector.resources.Icons.PUBLIC_PRIMITIVE in JavaFieldResourceProvider.java, PropertyDe |

### `tl.themes.core/themes/core/mimetypes` (13)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| BoolMetaAttr.png | 14x16 | unsicher | Attributtyp Ja/Nein | `toggle-left` | mime-Schlüssel (dynamisch): BooleanMetaAttribute |
| CalcMetaAttr.png | 14x16 | unsicher | Attributtyp berechnet | `calculator` | mime-Schlüssel (dynamisch): CalculatedPrimitiveMetaAttribute |
| ClassMetaAttr.png | 14x16 | unsicher | Attributtyp Klassifikation | `list` | mime-Schlüssel (dynamisch): ClassificationMetaAttribute |
| DateMetaAttr.png | 14x16 | unsicher | Attributtyp Datum | `calendar` | mime-Schlüssel (dynamisch): DateMetaAttribute |
| FloatMetaAttr.png | 14x16 | unsicher | Attributtyp Dezimalzahl | `hash` | mime-Schlüssel (dynamisch): FloatMetaAttribute |
| KOMetaAttr.png | 14x16 | unsicher | Attributtyp Objektverweis | `link` | mime-Schlüssel (dynamisch): TypedWrapperMetaAttribute +2 |
| LongMetaAttr.png | 14x16 | unsicher | Attributtyp Ganzzahl | `hash` | mime-Schlüssel (dynamisch): LongMetaAttribute |
| TextMetaAttr.png | 14x16 | unsicher | Attributtyp Text | `type` | mime-Schlüssel (dynamisch): StringMetaAttribute |
| empty.png | 14x16 | gelesen | leerer Platzhalter | – (Spacer, kein Icon) | Schlüssel c.tl.layout.table.renderer.Icons.EMPTY in IconOnlyRenderer.java |
| mandator.png | 14x16 | gelesen | Mandant | `building` | Schlüssel MIMETYPES_MANDATOR in mandatorStructure.model.xml |
| mandatorRoot.png | 14x16 | gelesen | Mandant (Wurzel) | `building` | Schlüssel MIMETYPES_MANDATOR_ROOT in mandatorStructure.model.xml |
| se.png | 14x16 | unsicher | Strukturelement | `folder-tree` | mime-Schlüssel (dynamisch): StructuredElement +1 |
| tag.png | 16x16 | gelesen | Stichwort | `tag` | Schlüssel MIMETYPES_TAG in Tag.model.xml, Ticket_27517_fix_legacy_migrations.migration.xml |

### `tl.themes.core/themes/core/mimetypes/tl` (2)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| RoleRule.png | 14x16 | unsicher | Rollenregel | `shield-check` | mime-Schlüssel (dynamisch): RoleRule |
| StoredQuery.png | 16x16 | unsicher | Gespeicherte Suche | `search` | mime-Schlüssel (dynamisch): tl.legacy.tabletypes.StoredQueryTable +1 |

### `tl.themes.core/themes/core/misc/compare` (11)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| changed.png | 11x10 | gelesen | Vergleich: geändert | `pencil` | Schlüssel c.tl.layout.form.decorator.Icons.CHANGED in ChangeInfo.java |
| compare-mode-active.png | 22x22 | gelesen | Vergleichsmodus an | `git-compare` | Schlüssel c.tl.layout.form.decorator.Icons.COMPARE_MODE_ACTIVE in SimpleConfiguredCompareCommandHandler.java |
| compare-mode-inactive.png | 22x22 | gelesen | Vergleichsmodus aus | `git-compare` | Schlüssel c.tl.layout.form.decorator.Icons.COMPARE_MODE_INACTIVE in SimpleConfiguredCompareCommandHandler.java |
| created.png | 11x10 | gelesen | Vergleich: neu | `plus` | Schlüssel c.tl.layout.form.decorator.Icons.CREATED in ChangeInfo.java |
| deep_changed.png | 11x10 | gelesen | Vergleich: Unterstruktur geändert | neu zeichnen (pencil + Zusatzpunkt) | Schlüssel c.tl.layout.form.decorator.Icons.DEEP_CHANGED in ChangeInfo.java |
| overlay-view.png | 22x22 | gelesen | Überlagerungsansicht | `layers` | Pfad/Name in OverlayCompareCommand.java |
| removed.png | 11x10 | gelesen | Vergleich: entfernt | `minus` | Schlüssel c.tl.layout.form.decorator.Icons.REMOVED in ChangeInfo.java |
| showNextChange.png | 22x22 | gelesen | nächste Änderung | `arrow-down` | Pfad/Name in ShowNextChangeCommand.java |
| showPreviousChange.png | 22x22 | gelesen | vorige Änderung | `arrow-up` | Pfad/Name in ShowPreviousChangeCommand.java |
| side-by-side-view.png | 22x22 | gelesen | Nebeneinander-Ansicht | `columns-2` | Pfad/Name in SideBySideCompareCommand.java |
| unchanged.png | 11x10 | gelesen | Vergleich: unverändert | `equal` | Schlüssel c.tl.layout.form.decorator.Icons.UNCHANGED in ChangeInfo.java |

### `tl.themes.core/themes/core/tree/proj` (1)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| p.png | 16x16 | nur Test | Projekt-Knoten (Test) | – | nur Test-Code: projElement.model.xml |

### `c.tl.umljs/images/icons/context-pad` (12)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| aggregation.svg | 46x46 | gelesen | UML-Aggregation | neu zeichnen (UML-Relation) | Pfad/Name in uml-js.css |
| association.svg | 46x46 | gelesen | UML-Assoziation | neu zeichnen (UML-Relation) | Pfad/Name in uml-js.css |
| composition.svg | 46x46 | gelesen | UML-Komposition | neu zeichnen (UML-Relation) | Pfad/Name in uml-js.css |
| dependency.svg | 46x46 | gelesen | UML-Abhängigkeit | neu zeichnen (UML-Relation) | Pfad/Name in uml-js.css |
| eye-slash-regular.svg | 22x22 | nur Test | Ausblenden | `eye-off` | nur Test-Code: custom.css |
| goto-element.svg | 22x22 | gelesen | Zum Element springen | `locate` | Pfad/Name in uml-js.css |
| hide-element.svg | 22x22 | gelesen | Element ausblenden | `eye-off` | Pfad/Name in uml-js.css |
| inheritance.svg | 46x46 | gelesen | UML-Vererbung | neu zeichnen (UML-Relation) | Pfad/Name in uml-js.css |
| property.svg | 46x46 | gelesen | UML-Property anlegen | neu zeichnen (UML-Property) | Pfad/Name in uml-js.css |
| realization.svg | 46x46 | gelesen | UML-Realisierung | neu zeichnen (UML-Relation) | Pfad/Name in uml-js.css |
| show-element.svg | 22x22 | gelesen | Element einblenden | `eye` | Pfad/Name in uml-js.css |
| trash-alt-regular.svg | 22x22 | gelesen | Löschen | `trash` | Pfad/Name in uml-js.css |

### `c.tl.umljs/images/icons/palette` (3)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| create_class.svg | 46x46 | gelesen | UML-Klasse anlegen | neu zeichnen (UML-Klasse) | Pfad/Name in uml-js.css |
| create_enumeration.svg | 46x46 | gelesen | UML-Enumeration anlegen | neu zeichnen (UML-Enum) | Pfad/Name in uml-js.css |
| create_label.svg | 46x46 | nur Test | UML-Label anlegen | `text-cursor` | nur Test-Code: custom.css |

### `c.tl/images/icons` (1)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| securityAlert.png | 32x32 | gelesen | Zugriff verweigert | `shield-x` | Pfad/Name in UnallowedAccess.jsp |

### `c.tl/images/icons/systemstate` (3)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| green.png | 16x16 | gelesen | Systemstatus grün | `circle` | Pfad/Name in SystemState.jsp |
| red.png | 16x16 | gelesen | Systemstatus rot | `circle` | Pfad/Name in SystemState.jsp |
| yellow.png | 16x16 | gelesen | Systemstatus gelb | `circle` | Pfad/Name in SystemState.jsp |

### `c.tl/themes/core/mimetypes` (23)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| Unit16.png | 16x16 | unsicher | Einheit | `ruler` | mime-Schlüssel (dynamisch): tl.units.Unit |
| avi.png | 16x16 | unsicher | Video AVI | `file-video-camera` | mime-Schlüssel (dynamisch): video/x-msvideo |
| binaryContent.png | 14x16 | unsicher | Binärdatei | `file` | mime-Schlüssel (dynamisch): application/octet-stream |
| csv.png | 16x16 | unsicher | CSV-Datei | `file-spreadsheet` | mime-Schlüssel (dynamisch): text/comma-separated-values |
| doc.png | 18x18 | unsicher | Word-Datei | `file-text` | mime-Schlüssel (dynamisch): application/msword +1 |
| html.png | 14x16 | unsicher | HTML-Datei | `file-code` | mime-Schlüssel (dynamisch): text/html |
| jpg.png | 18x18 | unsicher | Bild JPEG | `file-image` | mime-Schlüssel (dynamisch): image/jpeg |
| jsp.png | 16x16 | unsicher | JSP-Datei | `file-code` | mime-Schlüssel (dynamisch): text/jsp |
| mdb.png | 14x16 | unsicher | Access-Datenbank | `database` | mime-Schlüssel (dynamisch): application/vnd.ms-access |
| mpg.png | 16x16 | unsicher | Video MPEG | `file-video-camera` | mime-Schlüssel (dynamisch): video/mpeg |
| mpp.png | 16x16 | unsicher | MS-Project-Datei | `chart-gantt` | mime-Schlüssel (dynamisch): application/vnd.ms-project |
| pdf.png | 18x18 | unsicher | PDF-Datei | `file-text` | mime-Schlüssel (dynamisch): application/pdf |
| ppt.png | 18x18 | unsicher | PowerPoint-Datei | `presentation` | mime-Schlüssel (dynamisch): application/vnd.ms-powerpoint +1 |
| ps.png | 16x16 | unsicher | PostScript | `file` | mime-Schlüssel (dynamisch): application/postscript |
| psd.png | 16x16 | unsicher | Photoshop | `file-image` | mime-Schlüssel (dynamisch): application/x-photoshop |
| tif.png | 16x16 | unsicher | Bild TIFF | `file-image` | mime-Schlüssel (dynamisch): image/tiff |
| txt.png | 14x16 | unsicher | Textdatei | `file-text` | mime-Schlüssel (dynamisch): text/css +1 |
| unknown.png | 14x16 | gelesen | unbekannter Typ | `file-question-mark` | Schlüssel c.tl.util.Icons.UNKNOWN_TYPE in TLMimeTypes.java |
| wav.png | 16x16 | unsicher | Audio WAV | `file-music` | mime-Schlüssel (dynamisch): audio/x-wav |
| wmf.png | 16x16 | unsicher | Metafile | `file-image` | mime-Schlüssel (dynamisch): application/x-msmetafile |
| xls.png | 18x18 | unsicher | Excel-Datei | `file-spreadsheet` | mime-Schlüssel (dynamisch): application/vnd.ms-excel +1 |
| xml.png | 14x16 | unsicher | XML-Datei | `file-code` | mime-Schlüssel (dynamisch): application/xml +1 |
| zip.png | 18x18 | unsicher | Archiv | `file-archive` | mime-Schlüssel (dynamisch): application/x-gzip +1 |

### `c.tl/themes/core/mimetypes/large` (25)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| OrganisationalUnit.png | 32x32 | unsicher | Organisationseinheit | `building` | mime-Schlüssel (dynamisch): OrganisationalUnit.large |
| Portal.png | 32x32 | unsicher | Portal | `layout-dashboard` | mime-Schlüssel (dynamisch): Portal.large |
| Unit60.png | 60x60 | unsicher | Einheit | `ruler` | mime-Schlüssel (dynamisch): tl.units.Unit.large |
| WebFolder60.png | 60x49 | unsicher | Web-Ordner | `folder` | mime-Schlüssel (dynamisch): WebFolder.child.large +1 |
| avi.png | 32x32 | unsicher | Video AVI | `file-video-camera` | mime-Schlüssel (dynamisch): video/x-msvideo.large |
| binaryContent.png | 32x32 | unsicher | Binärdatei | `file` | mime-Schlüssel (dynamisch): application/octet-stream.large |
| bmp.png | 32x32 | unsicher | Bild BMP | `file-image` | mime-Schlüssel (dynamisch): image/bmp.large |
| csv.png | 32x32 | unsicher | CSV-Datei | `file-spreadsheet` | mime-Schlüssel (dynamisch): text/comma-separated-values.large |
| doc.png | 52x52 | unsicher | Word-Datei | `file-text` | mime-Schlüssel (dynamisch): application/msword.large +1 |
| gif.png | 32x32 | unsicher | Bild GIF | `file-image` | mime-Schlüssel (dynamisch): image/gif.large +1 |
| html.png | 32x32 | unsicher | HTML-Datei | `file-code` | mime-Schlüssel (dynamisch): text/html.large |
| jpg.png | 32x32 | unsicher | Bild JPEG | `file-image` | mime-Schlüssel (dynamisch): image/jpeg.large |
| mpg.png | 32x32 | unsicher | Video MPEG | `file-video-camera` | mime-Schlüssel (dynamisch): video/mpeg.large |
| mpp.png | 32x32 | unsicher | MS-Project-Datei | `chart-gantt` | mime-Schlüssel (dynamisch): application/vnd.ms-project.large |
| pdf.png | 52x52 | unsicher | PDF-Datei | `file-text` | mime-Schlüssel (dynamisch): application/pdf.large |
| ppt.png | 52x52 | unsicher | PowerPoint-Datei | `presentation` | mime-Schlüssel (dynamisch): application/vnd.ms-powerpoint.large +1 |
| ps.png | 32x32 | unsicher | PostScript | `file` | mime-Schlüssel (dynamisch): application/postscript.large |
| psd.png | 32x32 | unsicher | Photoshop | `file-image` | mime-Schlüssel (dynamisch): application/x-photoshop.large |
| tif.png | 32x32 | unsicher | Bild TIFF | `file-image` | mime-Schlüssel (dynamisch): image/tiff.large |
| unknown.png | 32x32 | unsicher | unbekannter Typ | `file-question-mark` | mime-Schlüssel (dynamisch): Unknown.large +1 |
| wav.png | 32x32 | unsicher | Audio WAV | `file-music` | mime-Schlüssel (dynamisch): audio/x-wav.large |
| wmf.png | 32x32 | unsicher | Metafile | `file-image` | mime-Schlüssel (dynamisch): application/x-msmetafile.large |
| xls.png | 52x52 | unsicher | Excel-Datei | `file-spreadsheet` | mime-Schlüssel (dynamisch): application/vnd.ms-excel.large |
| xml.png | 32x32 | unsicher | XML-Datei | `file-code` | mime-Schlüssel (dynamisch): application/xml.large +1 |
| zip.png | 52x52 | unsicher | Archiv | `file-archive` | mime-Schlüssel (dynamisch): application/x-gzip.large |

### `c.tl/themes/core/mimetypes/tl` (31)

| Datei (rel. zu src/main/webapp) | Maße | Urteil | Bedeutung | Lucide / Ersatz | Fundstelle |
|---|---|---|---|---|---|
| TLAssociation.png | 14x16 | gelesen | Modell: Assoziation | `network` | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd.png | 14x16 | gelesen | Modell: Assoziationsende | `network` | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd@containment.png | 14x16 | gelesen | Modell: Assoziationsende (containment) | `network` + Overlay für containment | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd@containment@mandatory.png | 14x16 | gelesen | Modell: Assoziationsende (containment, mandatory) | `network` + Overlay für containment/mandatory | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd@containment@mandatory@multiple.png | 14x16 | gelesen | Modell: Assoziationsende (containment, mandatory, multiple) | `network` + Overlay für containment/mandatory/multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd@containment@multiple.png | 14x16 | gelesen | Modell: Assoziationsende (containment, multiple) | `network` + Overlay für containment/multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd@mandatory.png | 14x16 | gelesen | Modell: Assoziationsende (mandatory) | `network` + Overlay für mandatory | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd@mandatory@multiple.png | 14x16 | gelesen | Modell: Assoziationsende (mandatory, multiple) | `network` + Overlay für mandatory/multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLAssociationEnd@multiple.png | 14x16 | gelesen | Modell: Assoziationsende (multiple) | `network` + Overlay für multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLClass.generalizations.png | 16x14 | unsicher | Modell: Generalisierungen | `arrow-up` | mime-Schlüssel (dynamisch): com.top_logic.model.TLClass.generalizations |
| TLClass.specializations.png | 16x14 | unsicher | Modell: Spezialisierungen | `arrow-down` | mime-Schlüssel (dynamisch): com.top_logic.model.TLClass.specializations |
| TLClassifier.png | 14x16 | gelesen | Modell: Klassifizierer | `bookmark` | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLPrimitive.png | 14x16 | gelesen | Modell: Primitivtyp | `type` | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLProperty.png | 14x16 | gelesen | Modell: Property | `tag` | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLProperty@mandatory.png | 14x16 | gelesen | Modell: Property (mandatory) | `tag` + Overlay für mandatory | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference.png | 14x16 | gelesen | Modell: Referenz | `link` | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference@containment.png | 14x16 | gelesen | Modell: Referenz (containment) | `link` + Overlay für containment | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference@containment@mandatory.png | 14x16 | gelesen | Modell: Referenz (containment, mandatory) | `link` + Overlay für containment/mandatory | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference@containment@mandatory@multiple.png | 14x16 | gelesen | Modell: Referenz (containment, mandatory, multiple) | `link` + Overlay für containment/mandatory/multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference@containment@multiple.png | 14x16 | gelesen | Modell: Referenz (containment, multiple) | `link` + Overlay für containment/multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference@mandatory.png | 14x16 | gelesen | Modell: Referenz (mandatory) | `link` + Overlay für mandatory | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference@mandatory@multiple.png | 14x16 | gelesen | Modell: Referenz (mandatory, multiple) | `link` + Overlay für mandatory/multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLReference@multiple.png | 14x16 | gelesen | Modell: Referenz (multiple) | `link` + Overlay für multiple | dynamisch: ImageVisitor/TLPartResourceProvider → DefaultResourceProvider.getTypeImage("TL…"+@mandatory/@contai |
| TLStructuredType.parts.png | 14x16 | unsicher | Modell: Teile | `list` | mime-Schlüssel (dynamisch): com.top_logic.model.TLStructuredType.parts |
| TLType.usage.png | 14x16 | unsicher | Modell: Verwendung | `search` | mime-Schlüssel (dynamisch): com.top_logic.model.TLType.usage |
| office.png | 16x16 | unsicher | Büro | `building` | mime-Schlüssel (dynamisch): Office |
| organisation.png | 16x16 | unsicher | Organisationseinheit | `building` | mime-Schlüssel (dynamisch): OrganisationalUnit |
| portal.png | 16x16 | unsicher | Portal | `layout-dashboard` | mime-Schlüssel (dynamisch): Portal |
| profile_expert.png | 16x16 | unsicher | Profil Experte | `user-cog` | mime-Schlüssel (dynamisch): Profile +2 |
| profile_search.png | 16x16 | unsicher | Profil Suche | `search` | mime-Schlüssel (dynamisch): Profile.search |
| webfolder.png | 18x18 | unsicher | Web-Ordner | `folder` | mime-Schlüssel (dynamisch): com.top_logic.common.folder.FolderDefinition +1 |

## 4. Spinner / Lade-Animationen

Ersatz im Design-System-Paket **vorhanden**: `.tl-spinner` (Ring, Größen `--sm`, Keyframes `tl-spinner-turn`) in `tl-design-system/src/components/progress/progress.css:56ff`, Part `Spinner` (`SpinnerPartProps`, Größe `small|medium`) in `com.top_logic.layout.react/react-src/bridge/parts.ts`, dazu der unbestimmte Balken `tl-progress` (`fraction: null`, Vertrag `progress.contract.md`) und `aria-busy`-Zustände in `button.css`, `media.css`, `skeleton.css`.

| Datei | Maße | Urteil | Leser | Ersatz |
|---|---|---|---|---|
| `tl.themes.core/…/themes/core/images/Slider.gif` | 132x16 GIF | gelesen | `Icons.SLIDER_IMG` (`@DefaultValue("Slider.gif")`): `ButtonBarControl.java:397`, `SelectionControl.java:585`, `ImageControl.java:352`, `MaintenanceJspBase.java:375` (alle klassisch); Kommentar in `ajax-form.js:3151` | `tl-progress` unbestimmt oder `.tl-spinner` |
| `com.top_logic/…/images/icons/loading.gif` | 32x32 GIF | **tot** | keine Fundstelle (Pfad, Name) | – |
| `tl-ai-demo/…/images/tl-ai-demo-working.svg` | 24x24 | gelesen (Demo) | `albert.view.xml working-indicator="/images/tl-ai-demo-working.svg"` → `tl-chat/ui/src/chat-conversation.tsx` (`workingIndicatorForm`); bewusst Demo-Beispiel für das Attribut, kein Marken-Spinner | bleibt als Demo-Beispiel oder `.tl-spinner` |
| Fremd: `ext.org.mozilla.pdfjs/…/images/loading-icon.gif`, `loading.svg`, `altText_spinner.svg` | – | gelesen (pdf.js-CSS) | pdf.js `viewer.css` | gehört zum Fremdpaket |
| Fremd: `ext.com.ckeditor/…/skins/moono-lisa/images/spinner.gif` | – | gelesen (Skin) | CKEditor-Skin | gehört zum Fremdpaket |

Kein Bild, aber CSS-Spinner: `fotorama_core.css` (`@keyframes spinner`, Galerie, klassisch). Daneben nutzt `fotorama.png` und `fotorama@2x.png` als Sprite (siehe 5).

## 5. Bedienteile alter Art

| Gruppe | Dateien | Urteile | Ersatz / Leser |
|---|--:|---|---|
| Baumlinien, Plus/Minus, Knoten-Sprites (`tree/`, `tree/table/`, `tree/breadcrumb/`, `tree/prod|proj/`) | 74 | 12 gelesen, 14 nur Test, 48 tot | DS-Baum `tl-tree` (Komponente `tree/`) zeichnet Linien und Expander selbst. Klassische Leser: `DefaultTreeImageProvider`, `DefaultTreeTableImageProvider` (Schlüssel `Icons.L|S|TREE_LF|TREE_LL|TREE_LNL|TREE_LS`, `tree/table`: `Icons.LF|LL|LNL|LS`), `DefaultBreadcrumbTreeImageProvider` (ohne jeden Aufrufer). |
| Checkbox-Zustände (`accumulatedTristate/`, `element/images/tristate/`) | 27 | 6 gelesen, 3 unsicher, 18 tot | DS `toggle`/`field` zeichnen Checkbox selbst. Leser: `IconSelectControl` (klassisch, Schlüssel `ACCUMULATED_TRISTATE_*`), `tristate.js` (zusammengesetzt, JSP-Altkomponente). |
| Farbwahl-Sprites (`colorchooser/`) | 5 | 4 gelesen, 1 tot | DS `color-picker`. Leser: `colorchooser.js` (Pfad `../../../themes/default/colorchooser/`, ein Theme `default` gibt es nicht) und `ColorChooserSelectionControl`. |
| Spacer, Platzhalter, Einzelteile (`alert-spacer`, `buttonEmpty`, `spacer/right`, `sortNo`, `tree-leaf`, `sortElementsDisabled`) | 7 | 4 gelesen, 3 tot | kein Ersatz nötig (Layoutabstand, leere Platzhalter). `spacer/right.png` liest `AssistentProgressComponent` (klassisch). |
| Galerie-/Hintergrund-Sprites (`fotorama`, `semi64x64lg`, `button-background`, `openDetail*`) | 5 | 1 gelesen, 4 tot | DS `media`/`image-field`. `fotorama.png`: `fotorama_core.css` (klassische Galerie `GalleryControl`); `semi64x64lg.png`: `form.css`; übrige ohne Leser. |
| Chooser-Buttons (`element/images/popup`) | 3 | 3 tot | DS `picker`/`select`. |
| Swing-Demo-Knotensymbole 14x16 (`reporting/…/chart/demo/img`) | 6 | 3 gelesen, 3 tot | Dev-Demo (`ProgressMain.java` per `main`), keine Produktfunktion; Ordner mit samt `demo/` löschbar, wenn die Swing-Mains fallen. |
| Fremd (pdf.js Cursor, CKEditor-Skin/Sprites/showblocks/magicline) | 37 | 22 gelesen, 15 unsicher | bleibt beim Fremdpaket. |

**Als Ganzes fallbar, sobald der klassische Leser fällt** (Ordner mit Dateizahl, Anzahl gelesener Dateien in Klammern): `tl.themes.core/themes/core/tree` (26, davon 8 klassisch gelesen), `tree/table` (23, 4), `tree/breadcrumb` (14, 0), `tree/prod` (10, 0), `tree/proj` (9, 0), `element/themes/core/tree/{prod,proj}` (8, 0), `accumulatedTristate` (14, 6), `element/images/tristate` (13, 0 sicher), `colorchooser` (7, 4), `element/images/popup` (3, 0), `themes/core/beacon/traffic` (6, 0). Davon heute schon ohne jeden Leser: `breadcrumb`, `prod`, `proj`, `popup`, `traffic`, `*/mandatory`.

## 6. `tl-icon`-Glyphen

Font: `com.top_logic.layout.icons`, Dateien `webfonts/tl_iconFont.{eot,ttf,woff,svg}`, CSS `style/tl_iconFont.css`, Metadaten `webfonts/tl_iconFontMetadata.json`. **Die Glyphen sind zusätzlich über den Icon-Chooser wählbar**: `tl-layout-icons.conf.config.xml` hängt die Metadaten als Ressource `tl_icon` an `IconInputControl` (`encoded-icon="colored:tl-icon ${name}"`). Ungenutzt im Repo heißt also nicht ungenutzt in Kundenlayouts und -modellen: jeder gewählte Wert steht als `colored:tl-icon <name>` in deren Konfiguration/Modell. Die Namensraumlage ist zu beachten: die Font-Klasse `.tl-icon` kollidiert im Präfix mit den Klassen des Design-Systems (`.tl-icon-sm|md|lg|glyph`).

### 6a. Verwendete Glyphen (32)

| Glyphe | Bedeutung | Fundstellen (Schlüssel/Ort) | Lucide-Kandidat |
|---|---|---|---|
| `caret-right` | Pfeil/Dreieck rechts (gefüllt), Gruppe zu, Breadcrumb | 7: `c.tl.layout.form.tag.Icons.GROUP_COLLAPSED`, `c.tl.layout.tree.renderer.Icons.BREADCRUMB_LF`, `c.tl.layout.tree.renderer.Icons.BREADCRUMB_LL` … | `chevron-right` (gefüllt: `triangle-right`) |
| `caret-down` | Pfeil unten, Gruppe auf, Breadcrumb | 4: `c.tl.layout.form.tag.Icons.GROUP_EXPANDED`, `c.tl.layout.tree.renderer.Icons.BREADCRUMB_MF`, `c.tl.layout.tree.renderer.Icons.BREADCRUMB_ML` … | `chevron-down` |
| `form` | Formular (Person + Liste), zweifarbig | 3: `c.tl.element.layout.formeditor.Icons.OPEN_GUI_EDITOR`, `c.tl.element.layout.formeditor.Icons.OPEN_GUI_EDITOR_DISABLED`, `ICONS_FORM_WHITE` | neu zeichnen (Näherung `contact`) |
| `form-border-reset` | Formular zurücksetzen | 2: `c.tl.element.layout.formeditor.DeleteFormDefinitionCommand.disabledImage`, `c.tl.layout.Icons (@DefaultValue)` | neu zeichnen (Näherung `contact` + Overlay) |
| `chart-bar-line` | Diagramm Balken+Linie | 2: `IMAGE_BUTTONS_CHART_ACTIVE`, `c.tl.base.chart.util.Icons.DEFAULT_CHART` | neu zeichnen (Näherung `chart-no-axes-combined`) |
| `form-border` | Formular mit Rahmen | 2: `c.tl.layout.Icons (@DefaultValue)`, `demo generalForms/tabLayout.layout.xml` | neu zeichnen (Näherung `contact`) |
| `chain` | Aufzählung/Kette (3 Ringe) | 1: `mime.TLEnumeration` | `link` |
| `arrow-down-quarter-circle` | Debugger: Einsteigen | 1: `ICONS_BUTTON_STEP_INTO` | neu zeichnen (Näherung `corner-down-right`) |
| `arrow-up-quarter-circle` | Debugger: Aussteigen | 1: `ICONS_BUTTON_STEP_OUT` | neu zeichnen (Näherung `corner-up-right`) |
| `arrow-half-circle` | Debugger: Überspringen | 1: `ICONS_BUTTON_STEP_OVER` | neu zeichnen (Näherung `redo-2`) |
| `text-arrow-right` | Gruppieren | 1: `ICONS_BUTTON_GROUP` | neu zeichnen (Näherung `group`) |
| `text-arrow-left` | Gruppierung aufheben | 1: `ICONS_BUTTON_UNGROUP` | neu zeichnen (Näherung `ungroup`) |
| `columns` | Formeditor: Spalten | 1: `c.tl.layout.form.control.Icons.FORM_EDITOR__COLUMNS` | `columns-2` |
| `square-dashed` | Formeditor: leere Zelle | 1: `c.tl.layout.form.control.Icons.FORM_EDITOR__EMPTY_CELL` | `square-dashed` |
| `fieldset` | Formeditor: Gruppe | 1: `c.tl.layout.form.control.Icons.FORM_EDITOR__GROUP` | neu zeichnen (Näherung `square-dashed-top-solid`) |
| `separator` | Formeditor: Trenner | 1: `c.tl.layout.form.control.Icons.FORM_EDITOR__SEPARATOR` | `separator-horizontal` |
| `table` | Formeditor/Tabelle | 1: `c.tl.layout.form.control.Icons.FORM_EDITOR__TABLE` | `table` |
| `caret-right-double` | Vorwärts doppelt | 1: `ICONS_BUTTON_FORWARD` | `chevrons-right` |
| `collapse` | Einklappen (zwei Chevrons gegeneinander) | 1: `ICONS_COLLAPSE` | `chevrons-down-up` |
| `question-circle` | Hilfe | 1: `ICONS_HELP` | `circle-question-mark` |
| `chart-bar` | Balkendiagramm | 1: `SPACER_BAR_CHART_TYPE` | `chart-column` |
| `caret-left-light` | Zurück dünn | 1: `c.tl.layout.accordion.Icons.BACK22` | `chevron-left` |
| `caret-right-light` | Weiter dünn | 1: `c.tl.layout.accordion.Icons.FORWARD22` | `chevron-right` |
| `arrow-top-right-square` | Link öffnen (extern) | 1: `c.tl.layout.form.control.Icons.URL_LINK` | `square-arrow-up-right` |
| `filter` | Filter | 1: `c.tl.layout.form.tag.Icons.FILTER_FORM` | `list-filter` |
| `caret-up` | Pfeil oben | 1: `c.tl.layout.form.tag.Icons.UP` | `chevron-up` |
| `bars` | Menü/Typ wählen | 1: `c.tl.layout.form.values.edit.editor.Icons.SELECT_TYPE` | `menu` |
| `tools` | Werkzeuge (Schlüssel+Schraubendreher) | 1: `c.tl.layout.table.renderer.Icons.EDIT_NAMED_TABLE_SETTINGS` | `wrench` |
| `plus` | Hinzufügen | 1: `c.tl.layout.Icons (@DefaultValue)` | `plus` |
| `cross` | Schließen/Löschen (rosa X; Lucide `cross` ist ein medizinisches Kreuz!) | 1: `element tl.changelog.model.xml (instance-presentation)` | `x` |
| `row-top-add` | Zeile oben einfügen | 1: `demo gridGrid.layout.xml` | neu zeichnen (Näherung `list-plus`) |
| `logo-tl-small` | TopLogic-Marke klein | 1: `maintabbar.template.xml (css:tl-icon)` | Marke/Bild, kein Lucide |

Die Schlüssel `BREADCRUMB_*` (9 Stück) zeigen bereits auf `caret-right|down`, die zugehörigen PNG sind darum tot (2b). `mime.TLEnumeration` nutzt `chain`.

### 6b. Nicht verwendete Glyphen (220, nur im Chooser wählbar)

| Gruppe | Glyphen | Lucide-Kandidat / neu zeichnen |
|---|---|---|
| Fertigung/Anlage (Domäne) (19) | base-frame, device-grouping, equipment, fixture, gears-connected, gripper, handling-device, handling-system, inline-construction, inline-transport, line, robot, robot-system, station, workplace, traffic-hoizontal, traffic-vertical, program, portfolio | neu zeichnen (Domäne ohne Lucide-Entsprechung; Näherung `bot`, `blocks`) |
| Projekt/Ziel/Struktur (18) | project, project-add, project-line, project-line-mono, project-root, project-sub, milestone-add, milestone-line, milestone-line-mono, result, rule, structure, hierarchy, target-hexagon, target-number, target-qualitative, target-sum, network-small | `milestone`, `network`, `list-tree`, `target`; Ziel-Varianten neu zeichnen |
| Datei-Typen (35) | file-binary, file-c, file-create, file-float, file-hashtag, file-i, file-o, file-p, file-person, file-reset, file-root, file-sp, file-upload, file-v, file-wp, file-zip, type-a, type-as, type-as-large, type-b, type-bs, type-c, type-cs, type-ls, type-new-ap, type-new-as, type-new-as-child, type-new-bp, type-new-bs, type-new-bs-child, type-new-cp, type-new-cs, type-new-cs-child, type-xs, type-xs-large | `file-archive` (zip), `file-up` (upload), `file-plus` (create); die Demo-Typ-Glyphen (`type-*`, `file-c|i|o|p|sp|v|wp`) sind Kopien der Demo-Icons und entfallen mit ihnen |
| Pfeile, Caret, Chevron (20) | arrow-right-circle, arrow-right-plus, arrow-square, arrow-to-left-solid, arrow-to-right-solid, arrow-top-right, caret-bottom-right, caret-down-double, caret-left, caret-left-border, caret-left-double, caret-right-border, caret-top-right, caret-up-double, chevron-double-right, chevron-flat-down, chevron-round-down, chevron-round-right, pointer-chevron, question-chevron | `circle-arrow-right`, `arrow-left-to-line`, `arrow-right-to-line`, `arrow-up-right`, `chevrons-down|left|up|right`, `chevron-left` |
| Status/Meldung (18) | check-circle, check-square, cancel, cross-circle, cross-circle-border, error, exclamation, exclamation-border, exclamation-circle, exclamation-circle-border, exclamation-triangle, info-square, question-speachbubble, minus-square, null-square, star-circle, star-square, lightbulb-circle | `circle-check`, `square-check`, `ban`, `circle-x`, `triangle-exclamation-point`, `info`, `message-circle-question-mark`, `square-minus` |
| Aktionen (56) | clipboard-add, clipboard-remove, edit, edit-document, element, element-create, element-search, folder-create, folder-download, garbage-can-open, reload, gear, gear-double, gear-arrow-right, gear-arrow-right-create, gear-reload, home, leave, locked, unlock, person, person-gear, paused, play-cancel, start, stop, step-into, step-out, step-over, save-modified, selection-invert, sort, table-add, table-reset, table-sort, row-add, tools-details, filter-remove, form-reset, checkbox-remove, checkbox-select-all, commands, cockpit, dashboard, dashboard-alt, debug, debug-alt, design-reload, design-reload-alt, company, compare, international-text, international-text-alt, flashlight-square, logo-tl-big, button-background | `clipboard-plus`, `pencil`, `file-pen`, `folder-plus`, `folder-down`, `trash`, `refresh-cw`, `settings`, `house`, `log-out`, `lock`, `lock-open`, `user`, `user-cog`, `pause`, `play`, `square`, `arrow-up-down`, `funnel-x`, `terminal`, `layout-dashboard`, `bug`, `building`, `git-compare`, `languages`; Debugger-Schritte, Overlay-Kombinationen und `logo-tl-big` neu zeichnen bzw. Bild |
| Fenster/Skalierung (7) | maximize-arrows, minimize-arrows, window-maximize, window-minimize, window-minimize-thin, window-normalize, window-restore | `maximize-2`, `minimize-2`, `maximize`, `minimize` |
| Export/Import (5) | export-excel, export-pdf, export-ppt, export-xml, import-excel | `file-spreadsheet`, `file-text`, `presentation`, `file-code` + Export-Overlay |
| Bücher (3) | book-exclamation, book-open-exclamation, building-blocks | `book-open`, `blocks`; Warn-Overlay neu zeichnen |

Glyphen mit gleichnamigem Lucide-Icon (nach Entfernung der Endung `-solid|-light|-thin`, 39 Stück): `arrow-right`, `ban`, `book`, `book-open`, `bookmark`, `calendar`, `camera`, `chart-bar`, `check`, `chevron-down`, `chevron-up`, `circle`, `clipboard`, `clipboard-paste`, `clock`, `download`, `expand`, `file`, `file-clock`, `file-text`, `group`, `hourglass`, `image`, `lightbulb`, `milestone`, `network`, `pencil`, `quote`, `save`, `scale`, `scissors`, `search`, `star`, `target`, `triangle`, `triangle-right`, `upload`. Falsche Freunde: `cross` (Lucide: medizinisches Kreuz), `form`, `expand`, `scale`, `group`, `quote` haben dort andere Bedeutung, vor Übernahme ansehen.

## 7. Bilder (nicht im Geltungsbereich, nur Liste)

| Ordner | Dateien | Urteil | Inhalt |
|---|--:|---|---|
| `com.top_logic.demo.react/images` | 4 | 4 gelesen | Demo-Logos, Demo-Bilder |
| `com.top_logic.demo/images` | 1 | 1 gelesen | appLogo.svg |
| `com.top_logic.demo/images/federalstates` | 16 | 16 gelesen | Landesflaggen/-umrisse (Demo-Daten, per `instance-presentation icon=` in DemoTypes.model.xml) |
| `com.top_logic.demo/themes/core/demo` | 1 | 1 gelesen | TL_Logo_blue.svg |
| `com.top_logic.demo/themes/dark/images` | 1 | 1 gelesen | appLogo.svg |
| `com.top_logic.layout.wysiwyg/script/ckeditor/plugins/templates/templates/images` | 7 | 7 gelesen | Vorlagen-Vorschauen des CKEditor-Templates-Plugins (100x70 GIF) |
| `com.top_logic.reporting.office/J/reporting/office/doc-files` | 1 | 1 tot | collaboration-reportHandler.jpg |
| `com.top_logic.reporting/J/reporting/chart/demo/img` | 2 | 2 gelesen | ball.jpg, snoopy.jpg |
| `com.top_logic.reporting/J/reporting/chart/demo/overview` | 2 | 2 gelesen | imageOverview.png, overview.png |
| `com.top_logic.reporting/J/reporting/chart/demo/progress` | 1 | 1 gelesen | progress.png |
| `com.top_logic.reporting/J/reporting/chart/demo/swing` | 2 | 2 gelesen | swing1.png, swing2.png |
| `com.top_logic.themes.core/style` | 1 | 1 gelesen | fotorama.png |
| `com.top_logic.themes.core/themes/core/images` | 1 | 1 gelesen | noPreviewImage.png (800x800) |
| `com.top_logic.themes.core/themes/core/misc` | 2 | 1 gelesen, 1 tot | brokenImage.png (168 px), unknownPerson.jpg |
| `com.top_logic/J/knowledge/journal` | 2 | 2 tot | JournalClasses.jpg, Journalling.jpg |
| `com.top_logic/J/knowledge/service/migration` | 3 | 3 gelesen | 01-simple-dependency.svg, 02-rule-dependency-inversion.svg, 03-rule-module-dependencies.svg |
| `com.top_logic/J/tool/boundsec/compound` | 2 | 2 tot | DelegateProjectLayout.jpg, ProjectLayout.jpg |
| `com.top_logic/J/tool/boundsec/doc-files` | 1 | 1 tot | bound-security.jpg |
| `com.top_logic/images` | 6 | 5 gelesen, 1 tot | appLogo(+Minimized), TL-Logo, favicon, null.png (1x1), preview_empty.png |
| `com.top_logic/images/login` | 1 | 1 gelesen | login-background.jpg (`login.css`) |
| `com.top_logic/images/logos` | 3 | 3 tot | BOS-/TopLogic-Logos |
| `com.top_logic/images/people` | 1 | 1 tot | unknown.jpg |
| `com.top_logic/jsp/administration/maintenance/benchmark` | 2 | 2 gelesen | Benchmark-Bilder der Wartungs-JSP |
| `ext.com.ckeditor/script/ckeditor/plugins/about/dialogs` | 1 | 1 gelesen | logo_ckeditor.png |
| `ext.com.ckeditor/script/ckeditor/plugins/about/dialogs/hidpi` | 1 | 1 gelesen | logo_ckeditor.png |
| `ext.com.ckeditor/script/ckeditor/plugins/image/images` | 1 | 1 gelesen | noimage.png |
| `ext.com.ckeditor/script/ckeditor/samples/img` | 6 | 6 tot | github-top.png, header-bg.png, header-separator.png, logo.png, logo.svg, navigation-tip.png |
| `ext.com.ckeditor/script/ckeditor/samples/old/assets` | 1 | 1 tot | sample.jpg |
| `ext.com.ckeditor/script/ckeditor/samples/old/assets/inlineall` | 1 | 1 tot | logo.png |
| `ext.com.ckeditor/script/ckeditor/samples/toolbarconfigurator/font` | 1 | 1 tot | fontello.svg |
| `ext.com.meterware.httpunit` | 2 | 2 tot | favicon.ico, temp.gif |
| `tl-build_doclet/J/build/doclet` | 1 | 1 gelesen | toplogic.svg |
| `tl-chat-classic/themes/core/icons` | 1 | 1 gelesen | albert.svg |

Bilder mit Theme-Variante (andere Datei im Theme `dark`): `appLogo.svg` (Demo). Logo-Schlüssel: `IMAGES_APP_LOGO`, `IMAGES_APP_LOGO_MINIMIZED`, `Icons.APP_LOGO`, `TOP_LOGIC_WITHOUT_TEXT`, `TL_CHAT_AGENT`.

## 8. Unsicher und Auffälligkeiten

- **mime-Schlüssel** (89 Icons): Dateityp- und Modelltyp-Icons werden nur über `mime.<Typ>` gelesen; ob ein Typ vorkommt, ist laufzeitabhängig. Ein sicherer Schnitt braucht eine Liste der Typnamen, die in Anwendungsmodellen vorkommen (Modell-XML der Kunden unbekannt).
- **Zusammengesetzt, unsicher** (5 Icons `beacon/*.png`, 3 Bedienteile `tristate/{dontcare,false,true}.png`) und weitere Hinweise: `/beacon/<name>.png` (`AbstractGanttChartCreator` im Reporting-Gantt; `BeaconRenderer` hat keinen Aufrufer), `/images/tristate/<Zustand>.png` (`tristate.js`, geladen von `EditAttributedComponent`; `formCheck.js` ohne Einbindung), `/images/icons/systemstate/<farbe>.png` in `SystemState.jsp` (gelesen).
- **Tote Verweise ohne Datei**: `ExportUtil.java:529ff` liest `/beacon/ppt/greenVertical.png` u. a.; der Ordner `beacon/ppt/` existiert nicht (Export wirft oder fällt auf Leer zurück, nicht geprüft). `colorchooser.js` verweist auf `themes/default/colorchooser/`, ein Theme `default` gibt es nicht.
- **Leser selbst ohne Aufrufer**: `DefaultBreadcrumbTreeImageProvider` (Schlüssel `BREADCRUMB_LS|MS|PS` → `tree/ls|ms|ps.png`), `IconOnlyRenderer` (Schlüssel `Icons.EMPTY` → `mimetypes/empty.png`), `BeaconRenderer`. Diese Dateien sind nach Schlüssel „gelesen“, faktisch aber ohne Wirkung; ich habe sie nach Schlüssel als gelesen geführt (nicht als tot), weil die Prüfung der Klasse nur auf Textreferenzen beruht (Reflection/Config nicht ausgeschlossen).
- **Leser klassisch (Erreichbarkeit im React-Pfad nicht geprüft)**: Tree-/Tabellen-Provider, `IconSelectControl`, `StructureEditComponent`, `ErrorControl`, `ChangeInfo`, `ButtonBarControl`, `SelectionControl`, `GalleryControl`. Vor dem Löschen der zugehörigen Bilder zählt der Leser, nicht das Bild.
- **Test-Modelle halten Bilder am Leben**: `tree/proj/*` und `tree/prod/{i,iO}` werden nur von `src/test/webapp/WEB-INF/model/*.model.xml` gelesen.
- **Doppelte Dateien**: 23 virtuelle Pfade in zwei Modulen (17 byteidentisch); 149 Dateien haben ein Inhalts-Duplikat unter anderem Pfad (61 Gruppen, z. B. `mimetypes/*` in `themes.core` und `com.top_logic`/`element`).
- **Präfixkollision**: Font-Klasse `.tl-icon` (alt) gegen `.tl-icon-sm|md|lg|glyph` (Design-System, Vertrag `icon.contract.md`).
- **Migrationsskript im Weg**: `imageIconFontMapping.txt` (257 Zeilen) trägt die Zuordnung Bild → Glyphe; bei der Migration der Modelldaten nützlich, danach löschbar mit `imagesToIconFonts.py`, `changeCssFile.py`.
- `com.top_logic.layout.icons/icons/*.svg`: 12 SVG ohne Glyphe (`overlay-*`, `file-knowledgeObject|metaAttribute|metaClass`, `type-iO`), die CSS-Regeln `i[class*=" overlay-"] span` gehören zu einem Overlay-Mechanismus (`colored:fas fa-save overlay-add` in `Icons.SAVE_SCRIPT_AS`, noch FontAwesome); nicht weiter verfolgt.
- CKEditor-Plugin-Icons (`wysiwyg*`) sind „gelesen“ über `plugin.js icons:`; ob der klassische CKEditor im React-Pfad noch erscheint, wurde nicht geprüft (Abhängigkeit: `tl-layout-wysiwyg` ← `formeditor`, `model.wysiwyg`, `doc`, `demo`).

## 9. Befehle zur Nachprüfung

```sh
REPO="/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/TopLogic 8 (NewUI)"
git -C "$REPO" fetch origin master
# 1. Bestand (1175)
git -C "$REPO" ls-tree -r --name-only origin/master | grep -Ei '\.(png|gif|jpe?g|svg|ico)$' \
  | grep -Ev '/(test|doc)/|node_modules|^ext\.com\.(fontawesome|bootstrap\.icons)' | wc -l
# 2. Theme-Einträge mit Bildpfad (226)
git -C "$REPO" grep -hE 'value="/[^"]*\.(png|gif|svg)"' origin/master -- '*theme-settings.xml' | wc -l
# 3. Theme-Schlüssel, Beispiel
git -C "$REPO" grep -n 'TABLE_EMPTY' origin/master -- '*.java' '*.xml' '*.properties'
git -C "$REPO" grep -n 'Icons.SLIDER_IMG' origin/master -- '*.java'
# 4. Dateiname ohne Pfad (Beispiel Slider.gif, loading.gif)
git -C "$REPO" grep -nIi 'slider\.gif' origin/master
git -C "$REPO" grep -nIi 'loading\.gif' origin/master
# 5. tl-icon
git -C "$REPO" grep -c 'colored:tl-icon' origin/master | awk -F: '{s+=$NF} END {print s}'
git -C "$REPO" grep -n 'colored:tl-icon' origin/master -- ':!*imageIconFontMapping.txt' | wc -l
git -C "$REPO" show origin/master:com.top_logic.layout.icons/src/main/webapp/style/tl_iconFont.css | grep -c '^\.tl-icon\.[a-z0-9-]*::before'
# 6. mime-Mechanik
git -C "$REPO" grep -n 'getTypeImage\|typeIcon(' origin/master -- '*.java' | grep -v /test/
# 7. Lucide
npm view lucide-static version
curl -sL https://unpkg.com/lucide-static@1.77.0/tags.json | python3 -c 'import json,sys; print(len(json.load(sys.stdin)))'
```

Die Auswertung selbst läuft über Skripte im Scratchpad (`py/scan.py` Namens-/Schlüsselsuche über 28 701 Textdateien, `py/final.py` Urteile, `py/build.py` Art und Overrides, `py/md*.py` dieser Bericht); die Einzelergebnisse je Datei stehen in `bild-erhebung-dateien.tsv` (Pfad, Modul, Art, Maße, Urteil, Fundstelle, Demo/Produkt/Fremd, Lucide/Ersatz).
