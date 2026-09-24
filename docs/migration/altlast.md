# Altlast — Arbeitsliste für die Wellen 1 bis 5

Einmalig exportiert aus abbildung.json, stellen.json und dem Inventar am 2026-09-17.
Die Werkzeuge dahinter sind gelöscht; diese Datei ist ihr Erbe.

## Alte Theme-Tokens → neue Tokens

| Alt (tl-react-theme.config.xml) | Art | Neu (`--tl-…`) | Regel |
|---|---|---|---|
| `background` | bleibt | `surface-base` | Rolle und Name unverändert; nur der Wert wechselt von Weiß auf #FAFAFA. |
| `layer-01` | bleibt | `surface-layer` | Erste Ebene über dem Grund, Rolle unverändert. |
| `layer-02` | bleibt | `surface-layer-nested` | Zweite Ebene, Rolle unverändert. |
| `field` | bleibt | `surface-field` | Eingabefläche, Rolle unverändert; der Wert erfüllt jetzt den Kontrast zum Platzhalter. |
| `layer-hover` | bleibt | `surface-interactive-hover` | Zeigerzustand einer Fläche, Rolle unverändert. |
| `layer-selected` | bleibt | `surface-interactive-selected` | Ausgewählte Fläche, Rolle unverändert. |
| `layer-active` | bleibt | `surface-interactive-active` | Gedrückte Fläche, Rolle unverändert. |
| `text-primary` | bleibt | `text-primary` | Fließtext, Rolle unverändert; Wert aus der Anforderung 16,0 abgeleitet. |
| `text-secondary` | bleibt | `text-secondary` | Nachgeordneter Text, Anforderung 7,0. |
| `text-helper` | bleibt | `text-helper` | Hilfstext, Anforderung 5,2. |
| `text-placeholder` | bleibt | `text-placeholder` | Platzhalter, misst jetzt gegen field statt gegen den Grund. |
| `focus` | bleibt | `focus-ring` | Fokusfarbe, Rolle unverändert; Wert folgt border-interactive. |
| `border-interactive` | bleibt | `border-interactive` | Markenlinie an Fokus und aktivem Zustand. |
| `layer` | umbenannt | `surface-layer` | Namenloser Vorgänger von layer-01; im Ist derselbe Wert wie field und layer-02. |
| `color-surface` | umbenannt | `surface-layer` | Vierter Name für dieselbe weiße Fläche — eine der gefundenen Dubletten. |
| `background-selected` | umbenannt | `surface-interactive-selected` | Auswahl ist eine Flächenrolle, kein eigener Hintergrund. |
| `layer-selected-hover` | umbenannt | `surface-interactive-active` | Zeiger auf ausgewählter Fläche ist die nächste Stufe der Flächenrampe. |
| `border-strong` | umbenannt | `border-emphasis` | Dieselbe Aufgabe: hervorheben. Der Name sagt jetzt wozu, nicht wie stark. |
| `button-primary` | umbenannt | `surface-brand` | Die Fläche trägt die Marke, nicht die Komponente — Rolle statt Bauteil. |
| `button-primary-hover` | umbenannt | `surface-brand-hover` | wie button-primary. |
| `button-primary-active` | umbenannt | `surface-brand-active` | wie button-primary. |
| `interactive` | umbenannt | `border-interactive` | Im Ist die Markenfarbe an Linien und Zuständen; die Rolle ist die Linie. |
| `link-primary` | umbenannt | `text-link` | Linktext trägt die Marke; hell gleich brand-primary, dunkel bewusst heller. |
| `link-primary-hover` | umbenannt | `text-link-hover` | wie link-primary. |
| `text-error` | umbenannt | `status-error-text` | Die Semantik führt jetzt vier Rollen je Bedeutung; dies ist die Textrolle. |
| `icon-primary` | umbenannt | `text-primary` | Ein Icon schuldet denselben Kontrast wie Text; eine eigene Farbe dafür war eine Dublette. |
| `text-inverse` | umbenannt | `surface-layer` | Weißer Text auf invertierter Fläche. Die Rolle entfällt mit background-inverse; wo heute invertiert wird, trägt künftig layer-overlay mit abgeleiteter Beschriftung. |
| `border-subtle` | mehrdeutig | `border-separator / border-control` | Trennt die Linie nur (Tabellenzeile, Abgrenzung), gilt border-separator. Umschließt sie ein Bedienelement, auf das der Zeiger wirkt (Eingabefeld, Auswahlfeld, Umriss-Schaltfläche), gilt border-control — das ist die Stelle, an der heute kein Feld die 3,0 aus WCAG 1.4.11 erreicht. |
| `support-error` | mehrdeutig | `status-error-text / status-error-border / status-error-surface / status-error-subtle` | Als Text gilt -text, als Linie -border, als gefüllte Fläche -surface (Beschriftung abgeleitet), als getönter Hinweisstreifen -subtle. |
| `support-warning` | mehrdeutig | `status-warning-text / status-warning-border / status-warning-surface / status-warning-subtle` | Wie support-error. Als Text schuldet die Rolle 4,5 — heute erreicht das Token 2,27 und ist unlesbar. |
| `support-success` | mehrdeutig | `status-success-text / status-success-border / status-success-surface / status-success-subtle` | Wie support-error. Die Snackbar mit hartkodiertem #fff auf dieser Fläche erreicht 3,17 und bekommt künftig die abgeleitete dunkle Beschriftung. |
| `layer-accent` | mehrdeutig | `surface-overlay / surface-brand-subtle` | Hebt die Fläche durch Höhe ab (Popover, Menü), gilt layer-overlay. Hebt sie durch Zugehörigkeit zur Marke ab (aktiver Navigationspunkt, ausgewählter Reiter), gilt brand-subtle. |
| `layer-accent-hover` | mehrdeutig | `surface-interactive-hover / surface-brand-subtle-hover` | Folgt der Entscheidung, die für layer-accent an derselben Stelle getroffen wurde: layer-hover bei Höhe, brand-subtle-hover bei Zugehörigkeit zur Marke. |
| `layer-accent-active` | mehrdeutig | `surface-interactive-active / surface-brand-subtle-hover` | Folgt der Entscheidung, die für layer-accent an derselben Stelle getroffen wurde: layer-active bei Höhe, brand-subtle-hover bei Zugehörigkeit zur Marke. |
| `button-secondary` | mehrdeutig | `border-control / surface-brand` | Die Umriss-Schaltfläche nimmt border-control für ihre Linie und brand-primary für Beschriftung und Symbol. Im Ist trägt ein Token beides. |
| `button-secondary-hover` | mehrdeutig | `border-interactive / surface-brand-hover` | Wie button-secondary, eine Stufe weiter: die Linie nimmt border-interactive, Beschriftung und Symbol nehmen brand-primary-hover. |
| `button-secondary-active` | mehrdeutig | `border-interactive / surface-brand-active` | Wie button-secondary, gedrückt: die Linie nimmt border-interactive, Beschriftung und Symbol nehmen brand-primary-active. |
| `button-danger` | mehrdeutig | `status-error-surface / status-error-text / status-error-border` | Die gefüllte Gefahr-Schaltfläche nimmt support-error-surface, die Beschriftung darauf wird abgeleitet. Eine Schaltfläche, die Gefahr nur als Text zeigt, nimmt support-error-text. Dazu die Linie: support-error-border. Die Linie kam beim Aufschreiben nicht vor: Der Aufnahmeknopf trägt seinen Gefahrzustand als Rahmen, nicht als Fläche — an drei Stellen als "box-shadow: inset 0 0 0 2px". Gefunden beim Zuordnen der Lesestellen, nicht beim Aufschreiben der Regel. |
| `button-danger-hover` | mehrdeutig | `status-error-surface / status-error-text / status-error-border` | Wie button-danger, eine Stufe weiter: die gefüllte Fläche im Zeigerzustand nimmt support-error-surface, die Beschriftung darauf wird abgeleitet. Dazu die Linie: support-error-border. wie button-danger. Die Linie bleibt im Zeigerzustand dieselbe — die Skala führt keine Hover-Stufe der Semantikfarben; das ist vermerkt, nicht erfunden. |
| `text-on-color` | abgeleitet | `abgeleitet` | Wird je Fläche gerechnet, nie geschrieben: von zwei Kandidaten gewinnt der mit dem höheren Verhältnis. Ein fester Wert kann helle und dunkle Flächen nicht gleichzeitig bedienen — nachgewiesen an button-primary und button-danger im Dunkelmodus. |
| `text-on-brand` | abgeleitet | `abgeleitet` | Sonderfall von text-on-color für die Markenfläche; dieselbe Ableitung. |
| `text-on-danger` | abgeleitet | `abgeleitet` | Sonderfall von text-on-color für die Gefahrfläche; dieselbe Ableitung. |
| `icon-on-color` | abgeleitet | `abgeleitet` | Ein Symbol auf einer Fläche schuldet denselben Kontrast wie Text darauf. |
| `icon-on-brand` | abgeleitet | `abgeleitet` | wie icon-on-color. |
| `layer-accent-text` | abgeleitet | `abgeleitet` | Beschriftung auf einer Akzentfläche — abgeleitet wie jede Beschriftung auf einer Fläche. |
| `layer-accent-icon` | abgeleitet | `abgeleitet` | wie layer-accent-text. |
| `focus-inset` | entfaellt | `entfaellt` | War die Konterlinie des Inset-Fokusrings. Mit dem einen außen liegenden Ring gibt es keine Konterlinie mehr. |
| `background-inverse` | entfaellt | `entfaellt` | Die invertierte Fläche war Ursache des schwersten Verstoßes — text-inverse darauf erreicht 1,13, also Weiß auf Fast-Weiß. Wo Umkehrung nötig ist, tragen layer-overlay und die abgeleitete Beschriftung sie. |
| `text-disabled` | offen | `offen` | Von WCAG ausdrücklich ausgenommen und deshalb nie abgeleitet. Bleibt in der Skala, aber ohne Gate — der Wert steht noch aus. |
| `icon-disabled` | offen | `offen` | wie text-disabled. |
| `field-disabled` | offen | `offen` | wie text-disabled. |
| `button-disabled` | offen | `offen` | wie text-disabled. |
| `text-on-color-disabled` | offen | `offen` | wie text-disabled; zusätzlich von der Ableitung der Beschriftung abhängig. |
| `script-editor-text-highlight` | offen | `offen` | Hervorhebung im TL-Script-Editor. Die Skala führt bisher keine Rolle für Syntaxhervorhebung; sie gehört zur Code-Klasse und ist noch nicht entschieden. |

## Lesestellen der mehrdeutigen Tokens

| Selektor | Eigenschaft | Alt | Neu |
|---|---|---|---|
| `.tlPanel__header` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlPanel--card` | `border` | `border-subtle` | `border-separator` |
| `.tlSplitPanel__splitter` | `background` | `border-subtle` | `border-separator` |
| `.tlSidebar__nav` | `border-right` | `border-subtle` | `border-separator` |
| `.tlSidebar__headerSlot, .tlSidebar__footerSlot` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlSidebar__footerSlot` | `border-top` | `border-subtle` | `border-separator` |
| `.tlSidebar__separator` | `border-top` | `border-subtle` | `border-separator` |
| `.tlSidebar__collapseBtn` | `border-top` | `border-subtle` | `border-separator` |
| `.tlSidebar__flyoutHeader` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlCard--outlined` | `border` | `border-subtle` | `border-separator` |
| `.tlCard__header` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlAppBar--surface` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlBottomBar` | `border-top` | `border-subtle` | `border-separator` |
| `.tlWindow__header` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlWindow__footer` | `border-top` | `border-subtle` | `border-separator` |
| `.tlDrawer__header` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlMenu__separator` | `border-top` | `border-subtle` | `border-separator` |
| `.tlTableView__filterBar` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlTableView__chip` | `border` | `border-subtle` | `border-control` |
| `.tlTableView__header` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlTableView__headerCell` | `border-right` | `border-subtle` | `border-separator` |
| `.tlTableView__row` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlTableView__cell` | `border-right` | `border-subtle` | `border-separator` |
| `.tlFormGroup--border-subtle` | `border` | `border-subtle` | `border-separator` |
| `.tlFormGroup__header` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlAvatar--empty` | `border` | `border-subtle` | `border-control` |
| `.tlFileChip` | `border` | `border-subtle` | `border-separator` |
| `.tlFileChip__remove` | `border-left` | `border-subtle` | `border-separator` |
| `.tlFileChips__add` | `border` | `border-subtle` | `border-control` |
| `.tlTreeView__spinner` | `border` | `border-subtle` | `border-separator` |
| `.tlReactTextInput, .tlReactNumberInput, .tlReactDatePicker, .tlReactSelect` | `border` | `border-subtle` | `border-control` |
| `.tlToolbar__separator` | `background` | `border-subtle` | `border-separator` |
| `.tlDropdownSelect` | `border` | `border-subtle` | `border-control` |
| `.tlDropdownSelect__searchWrapper` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlDropdownSelect__spinner` | `border` | `border-subtle` | `border-separator` |
| `.tlColorInput--immutable` | `border` | `border-subtle` | `border-separator` |
| `.tlColorInput__swatch:disabled` | `border-color` | `border-subtle` | `border-control` |
| `.tlColorInput__popup` | `border` | `border-subtle` | `border-separator` |
| `.tlColorInput__tabs` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlColorInput__paletteCell--empty` | `border` | `border-subtle` | `border-control` |
| `.tlColorInput__previewSwatch` | `border` | `border-subtle` | `border-separator` |
| `.tlColorInput__divider` | `background` | `border-subtle` | `border-separator` |
| `.tlColorInput__input` | `border` | `border-subtle` | `border-control` |
| `.tlColorInput__btn--cancel` | `border` | `border-subtle` | `border-control` |
| `.tlColorInput__btn--reset` | `border` | `border-subtle` | `border-control` |
| `.tlIconSelect__swatch` | `border` | `border-subtle` | `border-control` |
| `.tlIconSelect__swatch:disabled:hover` | `border-color` | `border-subtle` | `border-control` |
| `.tlIconSelect__popup` | `border` | `border-subtle` | `border-separator` |
| `.tlIconSelect__tabs` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlIconSelect__searchWrapper` | `border-bottom` | `border-subtle` | `border-separator` |
| `.tlIconSelect__spinner` | `border` | `border-subtle` | `border-separator` |
| `.tlIconSelect__advancedArea` | `border-top` | `border-subtle` | `border-separator` |
| `.tlIconSelect__editInput` | `border` | `border-subtle` | `border-control` |
| `.tlIconSelect__previewIcon` | `border` | `border-subtle` | `border-separator` |
| `.tlIconSelect__actions` | `border-top` | `border-subtle` | `border-separator` |
| `.tlIconSelect__btn--cancel` | `border` | `border-subtle` | `border-control` |
| `.tlDashboard__tile` | `border` | `border-subtle` | `border-separator` |
| `.tlToolbar__dropdownSeparator` | `border-top` | `border-subtle` | `border-separator` |
| `.tlPanel__buttonBar` | `border-top` | `border-subtle` | `border-separator` |
| `.tlCalDayHead` | `border-left` | `border-subtle` | `border-separator` |
| `.tlCalAllDayCell` | `border-left` | `border-subtle` | `border-separator` |
| `.tlCalCol` | `border-left` | `border-subtle` | `border-separator` |
| `.tlCalHourLine` | `border-top` | `border-subtle` | `border-separator` |
| `.tlCalMonthCell` | `border-left` | `border-subtle` | `border-separator` |
| `.tlCalMonthCell` | `border-top` | `border-subtle` | `border-separator` |
| `.tlSnackbar--error` | `background` | `support-error` | `status-error-surface` |
| `.tlNoticeBar--error` | `background` | `support-error` | `status-error-surface` |
| `.tlViewError` | `border` | `support-error` | `status-error-border` |
| `.tlViewError__title` | `color` | `support-error` | `status-error-text` |
| `.tlTableView__cell:has(.tlReactTextInput--error, .tlReactNumberInput--error, .tlReactDatePicker--error, .tlReactSelect--error)` | `outline` | `support-error` | `status-error-border` |
| `.tlFileChip__remove:hover` | `color` | `support-error` | `status-error-text` |
| `.tlBooleanChoice--error .tlBooleanChoice__label, .tlBooleanChoice--error.tlReactSelect` | `color` | `support-error` | `status-error-text` |
| `.tlReactTextInput--error, .tlReactNumberInput--error, .tlReactDatePicker--error, .tlReactSelect--error` | `border-color` | `support-error` | `status-error-border` |
| `.tlReactTextInput--error:focus, .tlReactNumberInput--error:focus, .tlReactDatePicker--error:focus, .tlReactSelect--error:focus` | `outline-color` | `support-error` | `status-error-border` |
| `.tlReactTextInput--error:focus, .tlReactNumberInput--error:focus, .tlReactDatePicker--error:focus, .tlReactSelect--error:focus` | `border-color` | `support-error` | `status-error-border` |
| `.tlReactCheckbox--error` | `accent-color` | `support-error` | `status-error-surface` |
| `.tlColorInput__swatch--noColor::after` | `background` | `support-error` | `status-error-surface` |
| `.tlColorInput__input--error` | `border-color` | `support-error` | `status-error-border` |
| `.tlIconSelect__resetBtn:hover` | `color` | `support-error` | `status-error-text` |
| `.tlIconSelect__btn--clear` | `color` | `support-error` | `status-error-text` |
| `.tlIconSelect__btn--clear` | `border` | `support-error` | `status-error-border` |
| `.tlIconSelect__btn--clear:hover` | `background` | `support-error` | `status-error-surface` |
| `.tlSnackbar--warning` | `background` | `support-warning` | `status-warning-surface` |
| `.tlNoticeBar--warning` | `background` | `support-warning` | `status-warning-surface` |
| `.tlTableView__cell:has(.tlReactTextInput--warning, .tlReactNumberInput--warning, .tlReactDatePicker--warning, .tlReactSelect--warning)` | `outline` | `support-warning` | `status-warning-border` |
| `.tlFormField__warning` | `color` | `support-warning` | `status-warning-text` |
| `.tlReactTextInput--warning, .tlReactNumberInput--warning, .tlReactDatePicker--warning, .tlReactSelect--warning` | `border-color` | `support-warning` | `status-warning-border` |
| `.tlReactTextInput--warning:focus, .tlReactNumberInput--warning:focus, .tlReactDatePicker--warning:focus, .tlReactSelect--warning:focus` | `outline-color` | `support-warning` | `status-warning-border` |
| `.tlReactTextInput--warning:focus, .tlReactNumberInput--warning:focus, .tlReactDatePicker--warning:focus, .tlReactSelect--warning:focus` | `border-color` | `support-warning` | `status-warning-border` |
| `.tlReactCheckbox--warning` | `accent-color` | `support-warning` | `status-warning-surface` |
| `.tlSnackbar--success` | `background` | `support-success` | `status-success-surface` |
| `.tlAppBar--primary` | `background` | `layer-accent` | `surface-brand-subtle` |
| `.tlAvatar--empty` | `background` | `layer-accent` | `zweckfremd → surface-layer-nested` |
| `.tlFormField__dirtyDot` | `background` | `layer-accent` | `zweckfremd → surface-brand` |
| `.tlAppBar--primary .tlMenuRegion--click:hover` | `background` | `layer-accent-hover` | `surface-brand-subtle-hover` |
| `.tlAppBar--primary button.tlToolbar__menuTrigger:not(:disabled):hover` | `background` | `layer-accent-hover` | `surface-brand-subtle-hover` |
| `.tlAppBar--primary .tlMenuRegion--click[aria-expanded="true"]` | `background` | `layer-accent-active` | `surface-brand-subtle-hover` |
| `.tlAppBar--primary button.tlToolbar__menuTrigger[aria-expanded="true"]` | `background` | `layer-accent-active` | `surface-brand-subtle-hover` |
| `.tlReactButton` | `box-shadow` | `button-secondary` | `border-control` |
| `.tlReactButton` | `color` | `button-secondary` | `surface-brand` |
| `.tlCounter__button` | `box-shadow` | `button-secondary` | `border-control` |
| `.tlCounter__button` | `color` | `button-secondary` | `surface-brand` |
| `.tlAudioRecorder__button` | `box-shadow` | `button-secondary` | `border-control` |
| `.tlAudioPlayer__button` | `box-shadow` | `button-secondary` | `border-control` |
| `.tlDownload__downloadBtn` | `color` | `button-secondary` | `surface-brand` |
| `.tlFileUpload__button` | `color` | `button-secondary` | `surface-brand` |
| `.tlPhotoCapture__cameraBtn` | `box-shadow` | `button-secondary` | `border-control` |
| `.tlPhotoCapture__cameraIcon` | `border` | `button-secondary` | `border-control` |
| `.tlPhotoCapture__cameraIcon::before` | `background` | `button-secondary` | `surface-brand` |
| `.tlTableView__cell.tlRowCommandCell button.tlReactButton:not(:disabled):hover` | `box-shadow` | `button-secondary` | `border-control` |
| `.tlToolbar__menuTrigger` | `box-shadow` | `button-secondary` | `border-control` |
| `.tlToolbar__menuTrigger` | `color` | `button-secondary` | `surface-brand` |
| `button.tlCounter__button:hover` | `background` | `button-secondary-hover` | `surface-brand-hover` |
| `button.tlCounter__button:hover` | `box-shadow` | `button-secondary-hover` | `border-interactive` |
| `button.tlAudioRecorder__button:hover` | `background` | `button-secondary-hover` | `surface-brand-hover` |
| `button.tlAudioRecorder__button:hover` | `box-shadow` | `button-secondary-hover` | `border-interactive` |
| `button.tlAudioPlayer__button:hover` | `background` | `button-secondary-hover` | `surface-brand-hover` |
| `button.tlAudioPlayer__button:hover` | `box-shadow` | `button-secondary-hover` | `border-interactive` |
| `button.tlDownload__downloadBtn:hover` | `background` | `button-secondary-hover` | `surface-brand-hover` |
| `button.tlFileUpload__button:hover` | `background` | `button-secondary-hover` | `surface-brand-hover` |
| `button.tlPhotoCapture__cameraBtn:hover` | `background` | `button-secondary-hover` | `surface-brand-hover` |
| `button.tlPhotoCapture__cameraBtn:hover` | `box-shadow` | `button-secondary-hover` | `border-interactive` |
| `button.tlReactButton:not(:disabled):active` | `background` | `button-secondary-active` | `surface-brand-active` |
| `.tlAudioRecorder__icon` | `background` | `button-danger` | `status-error-surface` |
| `.tlAudioRecorder__button--recording` | `background` | `button-danger` | `status-error-surface` |
| `.tlAudioRecorder__button--recording` | `box-shadow` | `button-danger` | `status-error-border` |
| `.tlAudioRecorder__button--recording::before, .tlAudioRecorder__button--recording::after` | `border` | `button-danger` | `status-error-border` |
| `.tlPhotoCapture__overlayCaptureIcon` | `background` | `button-danger` | `status-error-surface` |
| `button.tlAudioRecorder__button--recording:hover` | `background` | `button-danger-hover` | `status-error-surface` |
| `button.tlAudioRecorder__button--recording:hover` | `box-shadow` | `button-danger-hover` | `status-error-border` |
| `button.tlDownload__clearBtn:hover` | `background` | `button-danger-hover` | `status-error-surface` |

## Nicht abgebildete Alt-Tokens (Maße, Schatten, Typo)

Das alte CSS liest 31 Namen ohne Ziel in der Skala; die Tabelle fasst sie zu Gruppen zusammen. Sie fallen mit ihrer Komponente:

| Alt | Neu |
|---|---|
| `spacing-01` … `spacing-06` | `space-2xs`, `space-xs`, `space-md`, `space-lg`, `space-xl`, `space-2xl` (Lücke 12 px = `space-sm`) |
| `corner-radius` | `radius-sm` |
| `border-radius-02` | `radius-md` |
| `body-compact-01-*`, `body-02-*` | Klasse `.tl-type-body` |
| `label-01-font-size` | Klasse `.tl-type-label` |
| `heading-compact-02-*` | Klasse `.tl-type-body-strong` (14/600) |
| `heading-compact-03-font-size` | Klasse `.tl-type-heading-sm` |
| `heading-03-font-size` | Klasse `.tl-type-heading-md` |
| `shadow-raised` | entfällt (Elevation nur für Schwebendes) |
| `shadow-menu` | `shadow-popover` |
| `shadow-dialog` | `shadow-dialog` |
| `overlay` | `surface-scrim` |
| `font-family`, `font-family-mono` | `font-family-sans`, `font-family-mono` |
| `border-subtle-01`, `border-color`, `color-border` | `border-separator` |
| `text-muted` | `text-secondary` |
| `link-color` | `text-link` |
| `color-drop-zone` | `surface-brand-subtle` |

## Sichtbare Befunde aus der laufenden Anwendung

Erhoben im Darkmode auf dem Branch der Welle 0; die Wellen prüfen je Komponente gegen diese Liste. Kein Fix an der Altlast — die Komponente wird in ihrer Welle neu geschrieben.

| Welle | Komponente | Kontext / Zustand | Befund | Klasse (alt) | Modus |
|---|---|---|---|---|---|
| 1 | Button | Werkzeugleiste, deaktiviert (`Bearbeiten`/`Löschen` ohne Auswahl) | Text `rgb(111,115,120)` auf Panel-Hintergrund `rgb(38,42,46)`, 3,03:1 — deaktivierter Zustand ist kaum lesbar — **bewusst ausgenommen** — deaktivierte Bedienelemente unterliegen WCAG 1.4.3 nicht (skalen.md „Disabled: vier Rollen ohne Gate“); `text-disabled` auf `surface-disabled` misst 2,06 hell / 2,35 dunkel | `.tlReactButton` (tlReactControls.css:82) | dark |
| 2 | Eingabefelder / Select | Dialog „Neues Demo-Objekt“, Feldrand im Ruhezustand (`Aktiv (Auswahl)` u. a.) | Rand `var(--border-subtle)` = `rgb(58,64,69)` auf Feldfläche `var(--field)` = `rgb(38,42,46)`, 1,38:1 — Feldgrenze im Dunkelmodus praktisch unsichtbar; betrifft gemeinsame Regel für `tlReactTextInput`, `tlReactNumberInput`, `tlReactDatePicker`, `tlReactSelect` | `.tlReactSelect` (tlReactControls.css:4197) | dark |
| 2 | Radio | Dialog „Neues Demo-Objekt“, Feld „Aktiv (Radio)“, unmarkiert | Für den Radio-Input ist kein `border`/`appearance` gesetzt (nur `accent-color` für den markierten Zustand) — der sichtbare Ring im unmarkierten Zustand ist reiner Browser-Standard, ohne Bezug zu einem Token; deutlich blasser als die benachbarte Checkbox mit eigenem Rand | `.tlBooleanChoice__option input` (tlReactControls.css:4343) | dark |
| 2 | Select (Ressourcen-Referenz) | Tabelle „Demo-Objekte“, Spalte „Eigentümer“, Linktext `root` | Text `rgb(0,0,170)` (unveränderter Browser-Link-Standard) auf Zeilenhintergrund `rgb(26,28,30)`, 1,29:1 — für `.tlResourceCell` existiert keine Regel, `.tlDropdownSelect__readonlyValue` setzt keine `color`; der Link bleibt vollständig ungestylt und im Dunkelmodus fast unsichtbar | `.tlDropdownSelect__readonlyValue` (tlReactControls.css:4651) | dark |
| 3 | Baum | Baum-Demo, Zeile bei Hover (`P2`) | Hover-Hintergrund `var(--layer-hover)` = `rgb(47,52,56)` auf Seitenhintergrund `rgb(26,28,30)`, 1,36:1 — Hover-Zustand kaum von der Ruhefläche zu unterscheiden | `.tlTreeView__node:hover` (tlReactControls.css:4093) | dark |
| 3 | Tooltip (an Toolbar) | Toolbar-Button, Hover | Weiß (#FFF) auf Hellgrau (#F0F1F2), 1,2:1 — `text-inverse` wird im Dark-Theme nicht überschrieben (tl-react-theme.config.xml, Dark-Block bei Zeile 120) | `.tl-tooltip-popover` (tlReactControls.css:5546) | dark |
| 3 | Menü | Benutzermenü „root“, Tastatur-Fokus auf erstem Eintrag („Abmelden“) | Fokus-Hintergrund `var(--layer-hover)` = `rgb(47,52,56)` auf Menühintergrund `rgb(38,42,46)`, 1,15:1, und kein sichtbarer Fokusring (`outline-style: none`); die einzige verlässliche Änderung ist die Texthelligkeit (`text-secondary` → `text-primary`) | `.tlMenu__item--focused` (tlReactControls.css:2593) | dark |

Nicht geprüft: Lightmode (das Theme wurde absichtlich nicht umgeschaltet), Dichte-Umschaltung (`data-tl-density`), Tabelle mit Paginierung bei großen Datenmengen, Popover- und Snackbar-Komponenten, Formularlayout im Fehler-/Warnzustand, Toolbar-Icons ohne Tooltip-Text, sowie alle Ansichten in „Objektliste“, „Projekte“, „Diagramm-Demo“, „Gantt-Demo“, „Dokumentanzeige“, „Tiles“-Ansichten und „Responsive Master-Detail“.

## Fremdgut im Namensraum `--tl`

Der Namensraum gehört dem Paket. Diese Namen führt der Altbestand heute; die Welle der Komponente entscheidet, ob daraus ein Token mit Kategorie wird oder ein anders benannter Mechanismus. Gate: `test/ratchet.json`, `foreignTl`.

| Name | Wo | Aufgabe | Welle |
|---|---|---|---|
| `--tlPill-color` | `TLPill.tsx`, `tlReactControls.css` | Serverseitige Farbe der Pill als Inline-Property | 1 |
| `--tl-tt-padding` | `tlReactControls.css` (Tooltip) | Innenabstand des Tooltips, aus `spacing-02` | 3 |
| `--tlGrid-gap` | `TLGrid.tsx`, `tlReactControls.css` (#29597) | Rasterabstand als Rechengröße für die Spaltenzahl | 4 |
| `--tl-item-index` | `items.tsx`, `ReactLayoutControl.java`, `ObjectListElement.java` (#29597) | Position eines wiederholten Elements für gestaffelte Animation | 4 |

`TLUploadButton` trägt am Wrapper die reservierte Klasse `tl-upload`; das Upload-Feld der Welle 2 definiert sie.

### Fremdgut-Nähe

Andere Stylesheets mit `tl…`-Klassen des Altbestands (z. B. `TLWysiwygEditor.css`) stehen außerhalb der Ratsche; Welle 5 prüft sie.

## Welle 1 · Button — fertig, gemerged 23.09. (!1649, Merge-Commit `0fa0085060`)

Alter Block (`TLButton`, `TLButton enhancements`) und die fünf Kontextblöcke (AppBar, Fenster-Toolbar, Tabellenzelle, Dropdown, AppBar-Kollaps) sind gelöscht. Der Container wählt die Erscheinung über `ButtonDefaults`: AppBar und Toolbar sagen `ghost`, Fensterfuß und Panel-Buttonleiste sagen `secondary`; die Toolbar setzt `ghost` nur, wenn kein Container etwas anderes vorgibt.

Der Kollaps zum Icon ist keine Sache des Buttons mehr: Mit #29626 (master, gemerged 22.09.) misst die kollabierende Toolbar ihre Einheiten und schaltet per Klasse `tlToolbar--compact` um; der Kontext `collapseToIcon` und `AppShellContext` sind gestrichen. Die AppBar rendert ihre Kommandos seit #29626 durch diese Toolbar.

Drei Übergangsregeln im alten Stylesheet lesen den neuen Button von außen (Dropdown-Eintrag füllt die Zeile und ist linksbündig, kompakte Toolbar blendet `tl-button__label` aus, AppBar-Flächen); Welle 3 (Toolbar, Menu) und Welle 4 (Shell) lösen sie ab. Die Ratsche wurde mit den Merges von master (22./23.09.) auf 7390 Zeilen gehoben (Fremdzuwachs #29626, #29523, #29596, #29497, #29500, #29503, #29505, TLImage, TLValueList, TLHtml); `--tl-toolbar-trigger-size` und `--tl-toolbar-shrink-priority` stehen in `foreignTl` für Welle 3, `--tlText-tone` (#29596) für die Typo.

Mit #29497 tragen die Buttons ihre Tooltips über die Bridge (`TOOLTIP_ATTR`, `WHEN_TRUNCATED`: der Label-Tooltip erscheint nur, wenn die Beschriftung abgeschnitten oder von der kompakten Toolbar ausgeblendet ist); mit #29596 setzt `rootClassName(state, …)` die vom View konfigurierte `css-class` an die Wurzel — beides umschließt `buttonClassName`, ändert die Klassen des Buttons aber nicht.

### Pill (Welle 1, in Arbeit)

Die Pill ist Teil von `TLText` (#29596) und wird von `withPill` in Select, Dropdown, Chips und Tabellenzelle gezeichnet. Umstellung: die Farbe wird eine Rolle (`neutral`, `brand`, `error`, `warning`, `success`, `info`, `category-1` … `category-8`); `ReactValueColor.COLOR` trägt den Rollennamen statt CSS, `TLPill` rendert `tl-pill tl-pill--<rolle>`. Es fallen: `--tlPill-color` (aus `foreignTl`), die `color-mix`-Regeln im Block „The shape the text takes“, `ColorSpec.getValue()` (Literal), `ColorTokenOptions`/`ColorTokenConstraint` samt Resource-Keys, das Token `support-info`. Modelle: `demo.tickets.model.xml` nennt drei Rollen statt Tokens. Entscheidung: `docs/skalen.md` „Pill: Rolle statt Farbe“.
