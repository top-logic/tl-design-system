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
| `.tlAvatar--empty` | `border` | `border-subtle` | `border-control` — **umgesetzt (Avatar, Welle 1)** |
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
| `.tlAvatar--empty` | `background` | `layer-accent` | zweckfremd → **entschieden `surface-interactive-selected`**, die neutrale Rolle der Pill — **umgesetzt (Avatar, Welle 1)** |
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
| 2 | Eingabefelder / Select | Dialog „Neues Demo-Objekt“, Feldrand im Ruhezustand (`Aktiv (Auswahl)` u. a.) | Rand `var(--border-subtle)` = `rgb(58,64,69)` auf Feldfläche `var(--field)` = `rgb(38,42,46)`, 1,38:1 — Feldgrenze im Dunkelmodus praktisch unsichtbar; betrifft gemeinsame Regel für `tlReactTextInput`, `tlReactNumberInput`, `tlReactDatePicker`, `tlReactSelect` — **umgesetzt in !1740, Sichtprüfung 30.09. auf `docker:8017` hell+dunkel bestanden** | `.tlReactSelect` (tlReactControls.css:4197) | dark |
| 2 | Radio | Dialog „Neues Demo-Objekt“, Feld „Aktiv (Radio)“, unmarkiert | Für den Radio-Input ist kein `border`/`appearance` gesetzt (nur `accent-color` für den markierten Zustand) — der sichtbare Ring im unmarkierten Zustand ist reiner Browser-Standard, ohne Bezug zu einem Token; deutlich blasser als die benachbarte Checkbox mit eigenem Rand — **umgesetzt in !1740, Sichtprüfung 30.09. auf `docker:8017` hell+dunkel bestanden** | `.tlBooleanChoice__option input` (tlReactControls.css:4343) | dark |
| 2 | Select (Ressourcen-Referenz) | Tabelle „Demo-Objekte“, Spalte „Eigentümer“, Linktext `root` | Text `rgb(0,0,170)` (unveränderter Browser-Link-Standard) auf Zeilenhintergrund `rgb(26,28,30)`, 1,29:1 — für `.tlResourceCell` existiert keine Regel, `.tlDropdownSelect__readonlyValue` setzt keine `color`; der Link bleibt vollständig ungestylt und im Dunkelmodus fast unsichtbar — **umgesetzt in !1740, Sichtprüfung 30.09. auf `docker:8017` hell+dunkel bestanden** | `.tlDropdownSelect__readonlyValue` (tlReactControls.css:4651) | dark |
| 3 | Baum | Baum-Demo, Zeile bei Hover (`P2`) | Hover-Hintergrund `var(--layer-hover)` = `rgb(47,52,56)` auf Seitenhintergrund `rgb(26,28,30)`, 1,36:1 — Hover-Zustand kaum von der Ruhefläche zu unterscheiden | `.tlTreeView__node:hover` (tlReactControls.css:4093) | dark |
| 3 | Tooltip (an Toolbar) | Toolbar-Button, Hover | Weiß (#FFF) auf Hellgrau (#F0F1F2), 1,2:1 — `text-inverse` wird im Dark-Theme nicht überschrieben (tl-react-theme.config.xml, Dark-Block bei Zeile 120) | `.tl-tooltip-popover` (tlReactControls.css:5546) | dark |
| 2 | Select (Einzelwert) | Objektliste, Filter „Status“, ein gewählter Wert | Der gewählte Einzelwert steht als blanker Text (`tlDropdownSelect__value`), ohne Pill — die Rolle geht beim Wählen verloren, obwohl Liste, Chips und Tabellenzelle sie zeigen; bewusste Regel im TSX (Bernhard, 10.09.), in der Select-Welle entscheiden — **umgesetzt in !1740, Sichtprüfung 30.09. auf `docker:8017` hell+dunkel bestanden** | `.tlDropdownSelect__value` (TLDropdownSelect.tsx:619) | light+dark |
| 2 | Select (readonly, Tabellenzelle) | Objektliste, Tabelle „Geschlossen“, Spalte „Status“ (120 px) | Pill wird hart abgeschnitten statt mit Ellipse: `.tlOptionValue` ist Flex-Kind ohne `min-width: 0` in `.tlDropdownSelect--immutable` (`overflow: hidden`), also so breit wie ihr Inhalt; `max-width: 100%` der Pill greift damit ins Leere; `tl-pill__label` hat die Ellipse schon — **umgesetzt in !1740, Sichtprüfung 30.09. auf `docker:8017` hell+dunkel bestanden** | `.tlOptionValue` (tlReactControls.css, Block Dropdown) | light+dark |
| 3 | Menü | Benutzermenü „root“, Tastatur-Fokus auf erstem Eintrag („Abmelden“) | Fokus-Hintergrund `var(--layer-hover)` = `rgb(47,52,56)` auf Menühintergrund `rgb(38,42,46)`, 1,15:1, und kein sichtbarer Fokusring (`outline-style: none`); die einzige verlässliche Änderung ist die Texthelligkeit (`text-secondary` → `text-primary`) | `.tlMenu__item--focused` (tlReactControls.css:2593) | dark |

Nicht geprüft: Lightmode (das Theme wurde absichtlich nicht umgeschaltet), Dichte-Umschaltung (`data-tl-density`), Tabelle mit Paginierung bei großen Datenmengen, Popover- und Snackbar-Komponenten, Formularlayout im Fehler-/Warnzustand, Toolbar-Icons ohne Tooltip-Text, sowie alle Ansichten in „Objektliste“, „Projekte“, „Diagramm-Demo“, „Gantt-Demo“, „Dokumentanzeige“, „Tiles“-Ansichten und „Responsive Master-Detail“.

## Fremdgut im Namensraum `--tl`

Der Namensraum gehört dem Paket. Diese Namen führt der Altbestand heute; die Welle der Komponente entscheidet, ob daraus ein Token mit Kategorie wird oder ein anders benannter Mechanismus. Gate: `test/ratchet.json`, `foreignTl`.

| Name | Wo | Aufgabe | Welle |
|---|---|---|---|
| `--tl-tt-padding` | `tlReactControls.css` (Tooltip) | Innenabstand des Tooltips, aus `spacing-02` | 3 |
| `--tlGrid-gap` | `TLGrid.tsx`, `tlReactControls.css` (#29597) | Rasterabstand als Rechengröße für die Spaltenzahl | 4 |
| `--tl-item-index` | `items.tsx`, `ReactLayoutControl.java`, `ObjectListElement.java` (#29597) | Position eines wiederholten Elements für gestaffelte Animation | 4 |

`TLUploadButton` trägt am Wrapper die reservierte Klasse `tl-upload`; das Upload-Feld der Welle 2 definiert sie (`form/upload.css`).

### Fremdgut-Nähe

Andere Stylesheets mit `tl…`-Klassen des Altbestands (z. B. `TLWysiwygEditor.css`) stehen außerhalb der Ratsche; Welle 5 prüft sie.

## Welle 1 · Button — fertig, gemerged 23.09. (!1649, Merge-Commit `0fa0085060`)

Alter Block (`TLButton`, `TLButton enhancements`) und die fünf Kontextblöcke (AppBar, Fenster-Toolbar, Tabellenzelle, Dropdown, AppBar-Kollaps) sind gelöscht. Der Container wählt die Erscheinung über `ButtonDefaults`: AppBar und Toolbar sagen `ghost`, Fensterfuß und Panel-Buttonleiste sagen `secondary`; die Toolbar setzt `ghost` nur, wenn kein Container etwas anderes vorgibt.

Der Kollaps zum Icon ist keine Sache des Buttons mehr: Mit #29626 (master, gemerged 22.09.) misst die kollabierende Toolbar ihre Einheiten und schaltet per Klasse `tlToolbar--compact` um; der Kontext `collapseToIcon` und `AppShellContext` sind gestrichen. Die AppBar rendert ihre Kommandos seit #29626 durch diese Toolbar.

Drei Übergangsregeln im alten Stylesheet lesen den neuen Button von außen (Dropdown-Eintrag füllt die Zeile und ist linksbündig, kompakte Toolbar blendet `tl-button__label` aus, AppBar-Flächen); Welle 3 (Toolbar, Menu) und Welle 4 (Shell) lösen sie ab. Die Ratsche wurde mit den Merges von master (22./23.09.) auf 7390 Zeilen gehoben (Fremdzuwachs #29626, #29523, #29596, #29497, #29500, #29503, #29505, TLImage, TLValueList, TLHtml); `--tl-toolbar-trigger-size` und `--tl-toolbar-shrink-priority` stehen in `foreignTl` für Welle 3, `--tlText-tone` (#29596) für die Typo.

Mit #29497 tragen die Buttons ihre Tooltips über die Bridge (`TOOLTIP_ATTR`, `WHEN_TRUNCATED`: der Label-Tooltip erscheint nur, wenn die Beschriftung abgeschnitten oder von der kompakten Toolbar ausgeblendet ist); mit #29596 setzt `rootClassName(state, …)` die vom View konfigurierte `css-class` an die Wurzel — beides umschließt `buttonClassName`, ändert die Klassen des Buttons aber nicht.

### Pill (Welle 1, PR !1694 auf `CWS/CWS_29617_design_system_welle_1_pill`) — gemerged 28.09. (!1694, Merge-Commit `c38ad05ddd`; Migration der gespeicherten Annotationen mit !1720, Merge-Commit `806cf22543`, 30.09.)

Die Pill ist Teil von `TLText` (#29596) und wird von `withPill` in Select, Dropdown, Chips und Tabellenzelle gezeichnet. Umstellung: die Farbe wird eine Rolle (`neutral`, `brand`, `error`, `warning`, `success`, `info`, `category-1` … `category-8`); `ReactValueColor.COLOR` trägt den Rollennamen statt CSS, `TLPill` rendert `tl-pill tl-pill--<rolle>`. Es fallen: `--tlPill-color` (aus `foreignTl`), die `color-mix`-Regeln im Block „The shape the text takes“, `ColorSpec.getValue()` (Literal), `ColorTokenOptions`/`ColorTokenConstraint` samt Resource-Keys, das Token `support-info`. Modelle: `demo.tickets.model.xml` nennt drei Rollen statt Tokens. Entscheidung: `docs/skalen.md` „Pill: Rolle statt Farbe“.

Sichtprüfung 24.09. in der PR-Instanz (`http://docker:8007/CWS_29617_design_system_welle_1_pill/`, hell und dunkel): drei Rollen in Tabelle, Gruppenkopf, Dropdown-Liste und Chip zeichnen `tl-pill tl-pill--warning|info|success` aus `status-*-subtle`/`-border`, Text `text-primary`, kein Inline-Style, kein `.tlPill`. Zwei Befunde gehören der Select-Welle (Tabelle oben): Einzelwert ohne Pill, Abschneiden in schmaler Zelle.

### Avatar (Welle 1, PR !1695 auf `CWS/CWS_29617_design_system_welle_1_avatar`, gestapelt auf !1694) — gemerged 30.09. (!1695, Merge-Commit `95146ca38c`)

`TLAvatar` (`ReactAvatarControl`, `AvatarElement`, `<avatar>`), alter Block „TLAvatar“ (37 Zeilen). Umstellung: die Farbe wird eine Kategorie aus dem Namen (`tl-avatar--category-<n>`, Tokens der Kategorie), ohne Namen und mit Bild die neutrale Rolle; kein `hsl()`-Inline-Style, kein `#fff`. Größen `sm`/`md`/`lg`/`xl` aus `size-avatar-*` (neu `size-9`); `AvatarSize` und `<avatar size>` heißen so, die alten Namen fallen. Initialen tragen die Typo-Klasse ihrer Größe (`label-strong`, `body-strong`, `heading-md`, `heading-lg`). Es fallen: der Block `TLAvatar`, `hue()` im TSX, die Literale 0.5625/0.75/1.125/1.5 rem. Entscheidung: `docs/skalen.md` „Avatar: die Farbe ist eine Kategorie“, Folie 34.

### Progress (Welle 1, PR !1695 mit dem Avatar) — gemerged 30.09. (!1695, Merge-Commit `95146ca38c`)

`TLProgress` (`ReactProgressControl`, `ProgressElement`, `<progress>`, `ProgressBar` in `TLJobStatus`); die alten Regeln standen ohne eigenen Block im Block `TLHtml` (Zeilen 3847–3908). Umstellung: `tl-progress` mit `__track`, `__fill`, `__label`; Spur `surface-interactive-selected`, Füllung `surface-brand`; unbestimmt über `[aria-busy="true"]`, die Klasse `tlProgress--indeterminate` fällt; Schwung aus `duration-loop` (neu, `dur-4` = 1200 ms), kein eigener Reduced-Motion-Block; Beschriftung trägt `.tl-type-label .tl-nums`. Es fallen sieben Literale und der Block-Anteil im `TLHtml`. Entscheidung: `docs/skalen.md` „Progress: ein Anteil, kein Urteil“; Motion-Skala um `duration-loop` ergänzt.

### Icon (Welle 1, PR !1695 mit Avatar und Progress) — gemerged 30.09. (!1695, Merge-Commit `95146ca38c`)

`TLIcon` (`ReactIconControl`, `IconElement`, `<theme-icon>`), `ThemeIcon`, `FontIcon`. Umstellung: `<theme-icon size="sm|md|lg|glyph">` (Default `sm`), das Control rendert `tl-icon-<stufe>` aus `base.css` und hat kein eigenes CSS; die Regel `.tlIcon` (Block „The shape the text takes“) fällt; `ThemeIcon` ohne Inline-Maß am Bild und mit `aria-hidden` am Glyph; `FontIcon.tsx` fällt, vier Leser nehmen `ThemeIcon`. Offen für Welle 2–4: Menü, Toolbar, Sidebar, Reiter, Select geben `ThemeIcon` noch eigene Klassen statt einer Stufe. Entscheidung: `docs/skalen.md` „Icon: die Stufe ist die Rolle“.

## Welle 2 · Formulare — gebaut 30.09., PR folgt

Branch `CWS/CWS_29617_design_system_welle_2` (`3a8bf043af..bf970e6f54`, master gemergt, Suiten grün, `messages_en` ohne Diff) und Paket `e8f1221..0c10c7d`. Noch **nicht gepusht**; die Sichtprüfung steht aus und läuft mit dem PR. Spec: `docs/superpowers/specs/2026-09-30-welle-2-formulare-design.md`; Entscheidungen: `docs/skalen.md` „Formulare: ein Feldrahmen, Zustände als Attribute“ samt „Entschieden beim Bauen (30.09.)“.

### Gestrichene Blöcke

Zwölf Blöcke der Spec-Tabelle (Summe laut Spec §1: 1.341 Zeilen), dazu zwei, die beim Bauen mitfielen:

| Block (`tlReactControls.css`) | Zeilen alt | Nachfolger |
|---|---|---|
| Simple input controls | 176 | `tl-field` |
| Error / Warning states for simple inputs | 43 | `aria-invalid`, `data-tl-state~="warning"` |
| Checkbox | 72 | `tl-checkbox`, `tl-radio` |
| TLBooleanChoice | 46 | `tl-choice-group`, `tl-radio` |
| TLSegmentedChoice | 100 | `tl-segmented` |
| TLOptionChips | 70 | `tl-chip-group`, `tl-chip` |
| TLDropdownSelect | 303 | `tl-field tl-select` |
| TLFormField | 305 | `tl-form-field` |
| TLFormGroup | 112 | `tl-form-group` |
| TLFormLayout | 35 | `tl-form-layout` |
| TLFieldList | 22 | `tl-field-list` |
| TLFileUpload | 57 | `tl-file-upload`, `tl-upload` |
| TLResourceCell (mitgefallen) | 23 | `tl-field-value` |
| Visually hidden text (mitgefallen) | 17 | `tl-visually-hidden` |

**Ratsche: 7252 → 5994** (`test/ratchet.json`, `lines`; Stand bei Start der Welle, Paket `e8f1221`). Drei Posten laufen dagegen: Fremdzuwachs aus master, eingefangen mit Ticketvermerk im Kommentar der Ratsche — TLTabBar 123→125 (#29663), TLCard 47→52 und TLTableView 513→517 (#29677) mit dem Merge `3a8bf043af`, TLJobStatus 372→400 (#29671, Drop-Verweigerung der Tabelle) mit dem Merge `bf970e6f54`. Dazu **TLTreeView (121 Zeilen)**: er stand unter einer Überschrift mit zwei Strichen und zählte bisher zu TLFormField; die Überschrift hat jetzt drei, der Block steht für sich — die 305 Zeilen von TLFormField enthielten also 121 fremde. Gesenkt außerdem TLTableView 517→497 (Zellregeln auf `tl-field` umbenannt, Kommentare gekürzt) und TLToolbar 143→137 (verirrte Checkbox-Regel). `foreignTl` unverändert; Literale `zIndex` 30→22, `outlineNone` 23→21.

### Neu im Paket

`field` (`tl-field`, `tl-field-group`, `tl-field-value`), `choice` (Checkbox, Radio, Schalter, Segmente, Chips), `select`, `form` (Feld, Gruppe, Layout, Liste), `upload`, dazu ohne Control in der Engine: `alert`, `badge`, `divider`, `skeleton`; in `base.css` `tl-visually-hidden`. Je `*.css`, `*.contract.md`, Specimen. Neue Maße: `size-hidden`, `size-choice`, `size-switch`, `size-switch-knob`, `size-indicator`, `size-field-label-min/-max`; die Rand- und Statusrollen wurden nachgezogen (Kontrast gegen `surface-field`, Dialog), `text-helper` dunkel `gray-33`.

### Alt → neu für Anwendungs-Stylesheets

Kunden- und Anwendungs-CSS, das die alten Klassen anspricht, liest künftig diese (Liste = Grep-Gate der Spec §8):

| Alt | Neu |
|---|---|
| `tlReactTextInput`, `tlReactNumberInput`, `tlReactDatePicker`, `tlReactSelect` | `tl-field` |
| `tlReactTextInput--multiline` | `tl-field--multiline` |
| `tlReactTextInput--withIcon`, `--clearable`, `__icon` | `tl-field-group`, `tl-field-group__icon`, `tl-field-group__action` |
| `--immutable` (an allen Feldern) | `tl-field-value` |
| `tlOptionValue`, `tlResourceCell` | `tl-field-value` |
| `--error`, `--warning`, `--disabled`, `--selected` (Zustandsklassen) | `aria-invalid="true"`, `data-tl-state~="warning"`, `disabled`, `aria-checked` / `aria-pressed` |
| `tlReactCheckbox` | `tl-checkbox` (Schalter: `tl-checkbox--switch`) |
| `tlBooleanChoice` | `tl-choice-group` mit `tl-radio` |
| `tlSegmentedChoice` | `tl-segmented`, `tl-segmented__segment` |
| `tlOptionChips` | `tl-chip-group`, `tl-chip` |
| `tlDropdownSelect` | `tl-field tl-select` |
| `tlFormField` | `tl-form-field` (Lage: `--side`, `--top`, `--after`, `--hidden`, `--full`) |
| `tlFormGroup` | `tl-form-group` |
| `tlFormLayout` | `tl-form-layout` |
| `tlFieldList` | `tl-field-list` |
| `tlFileUpload` | `tl-file-upload` |
| `tlVisuallyHidden` | `tl-visually-hidden` |

Es fallen ohne Ersatz: der gleitende Marker der SegmentedChoice (das gewählte Segment trägt die Fläche), die toten Klassen `tlFormField--error`/`--warning` und `tlFormLayout--readonly`, `__chevron--collapsed` (der Chevron ist ein `ThemeIcon`), das Inline-SVG des Hilfeknopfs.

### Offen für spätere Wellen und Pakete

| Gruppe | Stand |
|---|---|
| **Welle 3: gehobene Flächen** | `surface-interactive-hover`/`-selected` auf `surface-overlay` messen dunkel 1,13 / 1,01. Im Select-Popup trägt die Akzentlinie (`border-interactive`) die Hervorhebung; der Skeleton liest dieselbe Rolle und ist dunkel auf dem Overlay kaum sichtbar. Entscheidung mit dem Menü. **Erledigt mit Welle 3a** (Spec §8.1, „Zeigen auf allen Gründen“): dunkel `-hover` `gray-67`, `-selected` `gray-64`, `-active` `gray-60`. |
| **Java / i18n** | Der Retry-Knopf des Select trägt den ganzen Satz als Namen; ein eigener Key `js.dropdownSelect.retry` (`I18NConstants`, per JavaDoc erzeugt, nie von Hand) gehört in ein späteres Java-Paket. |
| **`withPill`** | gehört nach `pill/`, nicht in die Select-Dateien. |
| **Drei Renderer von `tl-field-value`** | `ReadonlyValue`, `TLResourceCell` und der Helfer `FieldValue` zeichnen dasselbe Element; zusammenführen, sobald die Tabellenzelle (Welle 3) angefasst wird. |
| **Toggle-`aria-label`** | `TLFormGroup` wechselt `aria-label` des Einklappknopfs zusätzlich zu `aria-expanded` — Doppelansage, vorbestehend. |
| **`tlBinaryField`** | tote Klasse im Altbestand, Welle 5. |
| **Sichtprüfung (mit dem PR)** | Ellipsen: mehrzeiliger Lesewert außerhalb der Zelle, Segment- und Chip-Beschriftung bei sehr langem Text. Badge-Position am Icon. Select im Dialog (Popup über dem Backdrop) und Menü über dem Dialog; Dialog aus dem Drawer (gleiche Ebene, DOM-Reihenfolge); Icon-Zentrierung im Select; Link-Zellen jetzt unterstrichen; Hilfeknopf mit `tl-icon-sm` statt `md`. |
| **Gebündeltes aus dem Review** | `describedBy` an `bridge/field-label.ts` (Editoren `codeedit`, `wysiwyg`, `model.search.react` hängen daran; `codeedit` und `model.search.react` liefen offline nicht, der PR-Build ist das Gate). Der Punkt „Geändert“ ist `aria-hidden` und wird nicht vorgelesen (Text oder `aria-description` am Feld). Live-Region-Timing der Warnungen (mit `aria-live` eingehängt). `hidden.test.mjs` deckt nur Blockklassen. Kontrast-Gate: Marke auf Gründen im `derive`-Bericht. |
| **Paket** | `farbkreis-13.svg` (Übersicht, Wiki) zeigt noch alte Randwerte. Specimen `button`/`pill` laden mit `ri-*` keine Icon-Schrift und zeigen leere Icons; die Specimen der Welle 2 nutzen Bootstrap Icons. |

## Welle 3a · Navigation und Popups — gebaut 01.10.2026

Branch `CWS/CWS_29617_design_system_welle_3a` (`60a36b308e..21a8aa52c3`, gestapelt auf `welle_2`, Suiten grün, `messages_en` ohne Diff) und Paket `3b47ac5..` (Ratsche je Task). Noch **nicht gepusht**; die Sichtprüfung steht aus und läuft mit dem PR. Spec: `docs/superpowers/specs/2026-10-01-welle-3a-navigation-popups-design.md`; Konsolidierung W1–W5, W9, W12, N8 (unten).

### Gestrichene Blöcke

Die sechs Blöcke der Spec-Tabelle (§1), dazu der Dropdown-Teil der Toolbar, der unter der Dashboard-Überschrift stand:

| Block (`tlReactControls.css`) | Zeilen alt | Nachfolger |
|---|---|---|
| TLMenu | 117 | `tl-popover tl-menu`, `tl-menu__item` |
| TLMenuRegion | 29 | `tl-menu-region` (Klick: `tl-button`) |
| User menu | 17 | `tl-button--ghost`, Name als `tl-button__label` |
| TLToolbar | 137 | `tl-toolbar`, `tl-toolbar__group`, `tl-divider--vertical` |
| Dashboard, Dropdown-Teil der Toolbar | 56 (140→84) | `tl-popover tl-menu` |
| TLTabBar | 125 | `tl-tabs` |
| TLBreadcrumb | 50 | `tl-breadcrumb` |

**Ratsche: 5994 → 5537** (`test/ratchet.json`, `lines`). Zwei Überschriften neu, kein Zuwachs: **TLViewError (29)** stand ohne eigene Überschrift im TLMenu-Block; **TLInset (58)** trägt, was im TLTabBar-Block nicht zum Reiter gehörte (Abstandsmodell, `:root { --page-inset }`, `.tlInset`). Gesenkt: TLPanel 153→152, TLAppBar 90→89 (Host-Regeln der Toolbar), „Controls placed on the primary (accent) app bar“ 25→14 (der Klick-Auslöser ist ein `tl-button`). Kein Block gewachsen. `foreignTl` 6→4: `--tl-toolbar-trigger-size` und `--tl-toolbar-shrink-priority` fallen mit der Toolbar. Literale `fontSize` 48→47, `outlineNone` 21→20, `zIndex` 22→21 — der Tooltip (`.tl-tooltip-popover`) liest `--tl-layer-popover` statt `9999999999999999`; sein Block bleibt bis Welle 4.

### Neu im Paket

`popover` (`tl-popover`: Fläche jedes Popups, `layer-popover`, `shadow-popover`), `menu` (`tl-menu`, `__item`, `__icon`, `__label`, `__header`; `tl-menu-region` mit `data-tl-trigger`; in Kraft `aria-current`), `toolbar` (`tl-toolbar`, `__group`; `data-tl-compact`, `data-tl-overflow`), `tabs` (`tl-tabs`, `__list`, `__tab`, `__panel`; aktiv `aria-selected`), `breadcrumb` (`tl-breadcrumb`, `__list`, `__entry`, `__current`, `__separator`), `toggle` (`tl-toggle`, Chevron dreht mit `aria-expanded`); in `button` der Modifier `tl-button--icon` (quadratisch, mit `--sm` 24 px). Je `*.css`, `*.contract.md`, Specimen; Die Specimen teilen `specimen/specimen.css` (N8); `button` und `pill` zeigen weiter `ri-*`-Icons ohne Schrift (altlast „Paket“ der Welle 2). Neue Maße `size-popover-min` (`size-11`) und `size-popover-max` (`view-1` = `70vh`); dunkel `surface-interactive-hover`/`-selected`/`-active` auf `gray-67`/`gray-64`/`gray-60` (neue Primitive `gray-64`, `gray-60`; `gray-73` fällt). Schrift-Resets stehen in `:where(…)`; Knopf, Eintrag, Reiter und Breadcrumb lesen `tl-type-body`. Es fallen im Paket `tl-select__chip-remove`, `tl-select__clear`, `tl-field-group__action` und `tl-form-group__toggle` (Nachzug Welle 2).

### Alt → neu für Anwendungs-Stylesheets

Kunden- und Anwendungs-CSS, das die alten Klassen anspricht, liest künftig diese. Die camelCase-Namen links hält das Grep-Gate `test/engine-classes.test.mjs` aus der Engine fern; die Paketklassen der letzten Zeilen (`tl-select__…`, `tl-field-group__action`, `tl-form-group__toggle`, `tl-select__popup`) deckt dessen Regex nicht ab — für sie gilt, was `dist` erzeugt (die gefallenen erzeugt es nicht mehr):

| Alt | Neu |
|---|---|
| `tlMenu` | `tl-popover tl-menu` |
| `tlMenu__item`, `__icon`, `__label`, `__header` | `tl-menu__item`, `__icon`, `__label`, `__header` |
| `tlMenu__item--focused` | DOM-Fokus (Roving), Ring aus `base.css` |
| `tlMenu__item--active`, `--disabled` | `aria-current="true"` (`tl-type-body-strong`), `disabled` |
| `tlMenu__separator`, `tlToolbar__dropdownSeparator` | `tl-divider` |
| Spaltenmenü der Tabelle (`tlMenu` von Hand) | `Menu`-Instanz: `tl-popover tl-menu` |
| `tlMenuRegion`, `tlMenuRegion--click` | `tl-menu-region` mit `data-tl-trigger="click"` (Knopf: `tl-button`, `aria-expanded`) oder `"contextmenu"` |
| `tlUserMenu__name` | `tl-button__label` im Auslöser `tl-button--ghost` |
| `tlToolbar`, `tlToolbar--compact`, `--collapsible` | `tl-toolbar`, `data-tl-compact` |
| `tlToolbar__group`, `__group--inline`, `__group--menu`, `__item` | `tl-toolbar__group` |
| `tlToolbar__separator` | `tl-divider tl-divider--vertical` |
| `tlToolbar__menuTrigger`, `__menuTrigger--icon`, `__menuIcon`, `__chevron` | `tl-button` der Toolbar-Erscheinung, kompakt `tl-button--icon` |
| `tlToolbar__dropdown`, `__dropdownItem` | `tl-popover tl-menu` mit `data-tl-overflow`, Einträge `tl-menu__item` (`ButtonDefaults appearance="menu-item"`) |
| `tlReactTabBar`, `__tabs`, `__tab`, `__tabIcon`, `__content` | `tl-tabs`, `__list`, `__tab` (Icon `tl-icon-sm`), `__panel` |
| `tlReactTabBar__tab--active` | `aria-selected="true"` |
| `tlBreadcrumb`, `__list`, `__entry`, `__current` | `tl-breadcrumb`, `__list`, `__entry`, `__current` (`aria-current="page"`) |
| `tlBreadcrumb__item` | `tl-button tl-button--link` |
| `tlBreadcrumb__separator` (Inline-SVG) | `tl-breadcrumb__separator tl-icon-sm` (`ThemeIcon`, `aria-hidden`) |
| `tl-select__chip-remove`, `tl-select__clear`, `tl-field-group__action` | `tl-button--ghost tl-button--sm tl-button--icon` |
| `tl-form-group__toggle` | `tl-toggle` |
| Select-Popup `tl-select__popup` | `tl-popover tl-select__popup` |

Es fallen ohne Ersatz: die Fremddefinitionen `--tl-toolbar-trigger-size` (der TSX misst) und `--tl-toolbar-shrink-priority`, die Regel `.tlMenuRegion--click[aria-expanded="true"]` (griff nie), die Breitengrenze `max-width: 12rem` des Benutzernamens samt `@media (max-width: 640px)`.

### Ton folgt der Aktion — gebaut 02.10.

Spec `docs/superpowers/specs/2026-10-02-ton-folgt-der-aktion-design.md`, Branch `CWS/CWS_29617_design_system_ton`.

| Vorher | Jetzt |
|---|---|
| Gefahrton im Toolbar-Überlauf ging verloren (`buttonClassName` verwarf `danger` im `menu-item`-Zweig) | `tl-menu__item--danger`; `menuItemClassName(current, extra, danger)` ist die eine Stelle für Kontextmenü und Überlauf |
| `ReactButtonControl.setTone` ohne Aufrufer; das React-`CommandModel` kannte keinen Ton | `CommandModel.getTone()`; der Knopf übernimmt ihn bei der Konstruktion |
| Löschen sah aus wie Speichern | `DeleteObjectAction` sagt `DANGER`, `ViewActions.tone` aggregiert, Transaktion und Zweige reichen weiter; Clique `delete` ist die zweite Quelle |
| Rückfrage „Wirklich löschen?“ immer nur `primary` | `primary` + `danger`, wenn der Kettenrest zerstört (`Continuation.tone()`, auch aus einem Zweig heraus) |
| Verwerfen im Dirty-Dialog ohne Ton | `MessageButtons.discard` ist `danger` |

Nicht in dieser Welle: Attribut `tone`/`appearance` am Kommando (bewusst nicht), weitere Töne, das Dialog-Gerüst der sechs Zwei-Knopf-Dialoge (Welle 4, Prognose #4).

**Offen aus den Task-Reviews:**

| Gruppe | Stand |
|---|---|
| **`UploadCommand`** | Reicht weder `getTone()` noch `appliesFormState()` seiner Aktionen je Datei weiter: eine Upload-Kette mit `<delete-object/>` bleibt `DEFAULT`. Heute ohne Anwendungsfall; Fix später eine Zeile (`ViewActions.tone` über die Aktionen je Datei). |
| **`<confirm>` in `<with-transaction>`** | Öffnet den Dialog (Ton `DEFAULT`, weil `RequireSyncContinuation` keinen Ton kennt), bevor die Kette scheitert — eine Rückfrage darf in der Transaktion nicht aussetzen. Fehlgebrauch aus dem Bestand; sollte abgewiesen werden, bevor der Dialog aufgeht. |
| **Tests** | `TestDialogButtonTone` prüft „kein Ton“ mit `assertNull` statt strenger mit `containsKey`; die zusammengesetzten Aktionen stehen in einer Testmethode; kein Test für den `Switch`-Zweig von `nest`. |

### Offen für spätere Wellen und Pakete

| Gruppe | Stand |
|---|---|
| **AppBar-Breakpoint** | AppBar-Breakpoint für den Benutzernamen (war 640 px; Welle 4). Das Benutzermenü liegt im `trailing` der AppBar, nicht in einer Toolbar; „bei Platzmangel nur der Avatar“ (Spec §7) ist eine AppBar-Regel. Dazu die **Namensbreite** (war `max-width: 12rem`): `tl-button__label` schneidet erst ab, wenn etwas die Breite begrenzt — ohne Grenze greift die Ellipse nicht, ein langer Name verbreitert den Auslöser bis Welle 4. |
| **Reiter-Überlauf** | `tl-tabs__list` hat keinen Überlauf: viele Reiter laufen über den Rand hinaus. Nicht in Welle 3 (Spec §11), ebenso Untermenüs und Typeahead im Menü. |
| ~~**Gefahrton im Toolbar-Überlauf**~~ | **Erledigt mit „Ton folgt der Aktion“ (02.10.):** `tl-menu__item--danger` — siehe den Abschnitt darüber. |
| **Menü-Auslöser im Toolbar-Überlauf** | Unter `ButtonDefaults appearance="menu-item"` wird der Klick-Auslöser `button.tl-menu-region.tl-menu__item` ohne `role="menuitem"` und `tabindex=-1`; die Pfeiltasten des Überlaufs überspringen ihn. Heute unerreichbar (Toolbars tragen nur Kommando-Knöpfe). Fix: `menuItemProps(defaults)` wie `TLButton`, oder fest `ghost`; dazu entscheiden, ob `?? 'ghost'` (Panel-Leisten: `secondary`) oder der Vertrag „immer ghost“ gilt. |
| **Gebündeltes aus dem Review** | Tab schließt das Menü nicht (WAI-ARIA); Menü ohne `aria-labelledby`; Einträge, die bei offenem Menü dazukommen, bleiben `tabindex=-1` bis zur ersten Pfeiltaste. Kontextmenü am Punkt um `space-xs` versetzt (Offset auch am Punkt-Anker); Kontexttaste sendet einen Punkt statt des Elements. Fehlt das Anker-Element (`TLMenu.tsx`: `getElementById` liefert `null`), öffnet das Menü am Viewport-Ursprung (0,0); Fix: auf den letzten Punkt zurückfallen oder nicht öffnen. Popup-Breite nur beim Rendern gemessen; die Kaskade `.tl-select__popup` über `.tl-popover` hängt an der Dateireihenfolge in `generate.mjs` (popover vor select); Fix: ein Reihenfolge-Test in `popover.test.mjs`. Kein Offen-Stil für `aria-expanded` am `tl-button`. Tablist ohne `aria-label`; die Toolbar heißt generisch (`js.toolbar.label`), ein Name aus dem Kontext ist ein eigener Punkt. |
| **Kleines aus dem Schluss-Review** | `TLTabBar.tsx`: `aria-labelledby` des Panels zeigt ins Leere, wenn `activeTabId` keinen Reiter trifft; Fix: nur setzen, wenn der Reiter existiert. `TLMenuRegion.tsx`: `buttonRef` und `regionRef` werden gesetzt, aber nie gelesen; Fix: entfernen. |
| **Sichtprüfung (mit dem PR)** | Popup-Mindestbreite `size-popover-min` schlägt Felder unter 10rem; `max-height` des Select-Popups lässt weniger als acht Zeilen sichtbar — die Formel `8·row + control + 2·xs` übersieht Popover-Innenabstand (2·xs) und Rand (2·`border-width-sm`) unter `border-box` sowie den `margin-bottom: xs` der Suchgruppe, es fehlen rund 0,3 Zeilen; Fix nach der Sichtprüfung: `+ var(--tl-space-xs) + 2 * var(--tl-border-width-sm)`; `Shift+F10` kann ein zweites natives Kontextmenü auslösen; Panelkopf `+2·space-2xs` höher, Trigger in der primären App-Bar; Toggle-Drehung; Specimen `progress`/`icon` im Browser. |

## Welle 3b · Daten — gebaut 08.10.2026

Spec `docs/superpowers/specs/2026-10-02-welle-3b-daten-design.md`, Branch `CWS/CWS_29617_design_system_welle_3b` von
master `eef176e2ad` (Engine `394d1154d9..7b491f5f66`, Suiten grün bis auf den fremden Accordion-Test unten, `messages_en`
ohne Diff) und Paket `80749da..` (Ratsche je Task). Noch **nicht gepusht** (Push-Sperre bis 09.10.); die Sichtprüfung
steht aus und läuft mit dem PR. Konsolidierung W3 (Tabelle/Baum), W6, W7, W8, W10, W11, N1 (unten). Nach dem Plan-Review
(07.10.): Fehler- und Warnlinie getauscht, neue Stufe `red-34` (dunkel `status-error-border`) — Anwendungs-Stylesheets,
die `--tl-status-error-border` lesen, sehen hell `red-41` statt `red-35`, die Warnlinie hell `amber-43` statt `amber-36`.

### Gestrichene Blöcke

| Block (`tlReactControls.css`) | Zeilen alt | Nachfolger |
|---|---|---|
| TLTableView | 511 | `tl-table` (`table.css`), Filterleiste mit `tl-chip`, `tl-field-group`, `tl-table__save` |
| TLTableView, zweiter Teil unter der TLJobStatus-Überschrift | 283 (TLJobStatus 400→117) | `tl-table` (Kopf, Griffe, Vorschau, Marke), Ziehen über `drag.css`, Hinweis `tl-popover tl-table__hint` |
| TLTreeView | 121 | `tl-tree` (`tree.css`), `tl-toggle`, Ladezeile `tl-status` |
| TLColumnSelect | 113 | `tl-reorder-list` (`reorder-list.css`) |
| TLColumns | 27 | `tl-columns` (`columns.css`) |
| What the text is for | 41 | `tl-text` mit `tl-type-*` (`text.css`) |
| What the color of the text means | 34 | `data-tl-tone` |
| The shape the text takes | 19 | `tl-text--truncate`, `tl-pill` als Wurzel |
| Controls placed on the primary (accent) app bar | 14 | — (Text ohne Ton erbt die Farbe der App-Bar) |
| TLRelativeTime | 10 | `tl-text tl-type-label` mit `data-tl-tone="secondary"` |
| TLAlert (unlisted, #29652) | 32 | `alert.css` |

**Ratsche: 5636 → 4490** (`test/ratchet.json`, `lines` = Summe der Budgets = gemessen). Gesenkt: TLValueList 117→101
(Zieh- und Ablagezustände zeichnet `drag.css`), TLHtml 164→162 (gemessen, gesunken mit #29752). Neu ein Übergangsblock
**„Table cells holding legacy controls (until waves 4 and 5)“ (43)**: Zellregeln, die Klassen noch nicht migrierter
Controls lesen (`tlStack`, `tlValueList`, `tlRowCommandCell`) an `tl-table__cell`; sie gehen mit ihren Controls. Kein
Block gewachsen. `foreignTl` 10→9: `--tlText-tone` fällt, der Ton ist `data-tl-tone`. Literale `fontSize` 47→40,
`duration` 33→32, `zIndex` 22→15 (darunter die `13000` des Ablehnungshinweises), `outlineNone` 20→16.

### Neu im Paket

`status` (`tl-status`: lädt, leer, Fehler — herausgelöst aus `tl-select__status`; Leser Select, Baum-Ladezeile, leere
Tabelle), `drag` (eine Ziehen-Optik für alle Leser über `data-tl-state~="dragging|drop-before|drop-after|drop-onto|drop-refused"`,
waagerecht mit `data-tl-axis="horizontal"`), `reorder-list` (`tl-reorder-list`, `__item`, `__handle`, `__label`,
`__search`), `text` (`tl-text`, `tl-text--truncate`, `data-tl-tone`), `columns` (`tl-columns`, `__column`,
`--gap-compact|default|loose`), `table` (`tl-table`, `__frame`, `__grid`, `__header`, `__header-row`, `__header-cell`,
`__body`, `__row`, `__cell`, `__label`, `__select`, `__sort`, `__filter`, `__columns`, `__resize`, `__freeze`, `__freeze-preview`,
`__mark`, `__tree`, `__spacer`, `__value`, `__count`, `__placeholder`, `__filter-bar`, `__search`, `__save`, `__hint`;
Lage über `data-tl-state~="frozen|frozen-last|pinned|pinned-first|filtered|cursor"`), `tree` (`tl-tree`, `__node`,
`__content`, `__spacer`). Je `*.css`, `*.contract.md`, Specimen; nachgezogen die Verträge `pill`, `avatar`, `alert`,
`choice`, `select`, `field`, `skeleton` (erster Aufrufer: Platzhalterzeilen der Tabelle).

- **Kapsel:** `span.tl-chip` mit `tl-chip__toggle` (`aria-pressed`) und `tl-chip__remove`
  (`tl-button--icon --sm --ghost`); keine Pill mehr in Chip, Segment und Select-Chip (`withPill` fällt).
- **Rolle als Attribut:** `data-tl-role="error|warning|success|info|brand|category-1…8"` an Pill, Chip, Segment,
  Select-Chip, Avatar und Alert; `generate.mjs` erzeugt die Regeln je Block über `@tl-roles`. `pillClassName` fällt.
- **Cursor-Ring:** `base.css` zeichnet den Ring innen auf dem `::after` des Elements mit `data-tl-state~="cursor"`,
  solange sein Behälter (`aria-activedescendant`) den Tastaturfokus hat (Ebene `layer-sticky`, der Behälter isoliert
  den Stapel); ohne Cursor trägt der Behälter selbst den Ring. Tabelle und Baum; Auswahl ist eine Fläche, kein Balken.
- **Maße:** keine neuen Tokens — Zeile `size-row`, Kopf `size-bar`, Einzug und Toggle `size-control-sm`, Griffe
  `space-xs`, Ebenen `layer-raised`/`-sticky`/`-popover`. Neue Primitive `red-34`.
- **Engine-Helfer** (kein Paket): `tokenPx`/`useTokenPx` (Zeilenhöhe und Einzug aus den Tokens), `filterOptions`,
  `useListReorder` (Alt + Pfeil mit Live-Bereich, Zeiger mit Hälften-Regel), `FieldValue` (Lesewert mit zwei
  Link-Arten), `isEditorTarget` (Tasten aus Editoren im Raster und Baum), `useFocusAfterRemove` (Fokus nach dem
  Entfernen einer Kapsel: Select-Chip und Filterkapsel), `SearchField` (eine Suche mit Löschknopf für Tabelle und
  Spaltenwahl), `bridge/icons.ts` (die Glyphnamen als Konstanten, kein roher Glyph-String in den Controls der Welle).

### Alt → neu für Anwendungs-Stylesheets

Kunden- und Anwendungs-CSS, das die alten Klassen anspricht, liest künftig diese. Die camelCase-Namen links hält das
Grep-Gate `test/engine-classes.test.mjs` aus der Engine fern; für die Paketklassen (`tl-pill--…`, `tl-avatar--…`,
`tl-alert--…`, `tl-select__status`) gilt, was `dist` erzeugt — die gefallenen erzeugt es nicht mehr.

**Tabelle**

| Alt | Neu |
|---|---|
| `tlTableView` | `tl-table` (Wurzel), darin `tl-table__frame` und das Raster `tl-table__grid` (`role="grid"`, im Baum und gruppiert `"treegrid"`) |
| `tlTableView__headerArea`, `__header`, `__headerRow`, `__headerCell`, `__headerLabel` | `tl-table__frame` (Rahmen um Raster, Spaltenwahl und Fixiergrenze), `tl-table__header`, `__header-row`, `__header-cell`, `__label` |
| `tlTableView__headerCell--sortable`, `__sortIndicator` | Sortierknopf `tl-table__sort`; Richtung `aria-sort` an der ersten Stufe |
| `tlTableView__sortPriority` | `tl-badge` (ab zwei Stufen) |
| `tlTableView__filterButton` | `tl-table__filter`; aktiv `[data-tl-state~="filtered"]` an der Kopfzelle |
| `tlTableView__columnsButton`, `--inCell` | `tl-table__columns` (`tl-button--icon`) |
| `tlTableView__resizeHandle` | `tl-table__resize` (`role="separator"`) |
| `tlTableView__frozenSplitter`, `--active`, `__frozenPreview` | `tl-table__freeze`, `tl-table__freeze-preview` |
| `tlTableView__groupMark` | `tl-table__mark` |
| `tlTableView__body`, `__row`, `__cell` | `tl-table__body`, `__row`, `__cell` |
| `tlTableView__row--selected` | `.tl-table__row[aria-selected="true"]` |
| `tlTableView__row--cursor` | `.tl-table__row[data-tl-state~="cursor"]` (Ring aus `base.css`) |
| `tlTableView__cell--frozen`, `--frozenLast`, `__headerCell--frozen`, `--frozenLast` | `[data-tl-state~="frozen"]`, `[data-tl-state~="frozen-last"]` |
| `tlTableView__cell--pinnedEnd`, `--pinnedEndFirst`, `__headerCell--pinnedEnd`, `--pinnedEndFirst` | `[data-tl-state~="pinned"]`, `[data-tl-state~="pinned-first"]` |
| `tlTableView__checkboxCell`, `__checkbox` | `tl-table__select` mit `tl-checkbox` |
| `tlTableView__treeCell`, `__treeToggle`, `__treeToggleSpacer`, `__treeValue` | `tl-table__tree`, `tl-toggle`, `tl-table__spacer`, `tl-table__value` |
| `tlTableView__row--group`, `__groupCount` | Gruppenzeile `tl-table__row`, stark über den Text jeder Zelle (`css-class` `tl-type-body-strong` vom Server), Anzahl `tl-table__count` |
| `tlTableView__filterBar`, `__filterChips` | `tl-table__filter-bar` |
| `tlTableView__chip`, `--active`, `__chipLabel`, `__chipRemove` | `tl-chip` mit `tl-chip__toggle` (`aria-pressed="true"`) und `tl-chip__remove` |
| `tlTableView__search`, `__searchInput` | `tl-table__search` (`tl-field-group` mit Löschknopf) |
| `tlTableView__saveForm`, `__saveInput`, `__barButton` | `tl-table__save` mit `tl-field` und `tl-button` |
| `tlTableView__row--dragOver-before`, `-after`, `-onto` | `[data-tl-state~="drop-before"]`, `"drop-after"`, `"drop-onto"` (`drag.css`) |
| `tlTableView__headerCell--dragOver-left`, `-right` | `[data-tl-state~="drop-before"]`, `"drop-after"` in der Kopfzeile mit `data-tl-axis="horizontal"` |
| `tlTableView--dragover`, `--dropRefused`, `__row--dropRefused` | `.tl-table[data-tl-state~="drop-onto"]`, `[data-tl-state~="drop-refused"]` |
| `tlTableView__dropHint` | `tl-popover tl-table__hint` |
| Zustand `rowHeight` | `--tl-size-row` (das TSX misst das Token; das Dashboard behält seinen eigenen Schlüssel für die Kachelhöhe) |

**Baum, Spaltenwahl, Spalten**

| Alt | Neu |
|---|---|
| `tlTreeView`, `__node`, `__content` | `tl-tree`, `__node`, `__content` |
| `tlTreeView__node--selected` | `.tl-tree__node[aria-selected="true"]` |
| `tlTreeView__node--focused` | `.tl-tree__node[data-tl-state~="cursor"]` (Ring aus `base.css`) |
| `tlTreeView__toggle`, `__chevron--down`, `--right` | `tl-toggle` (Chevron dreht mit `aria-expanded`) |
| `tlTreeView__toggleSpacer` | `tl-tree__spacer` |
| `tlTreeView__spinner` | Ladezeile `li.tl-status` (`role="treeitem"`) mit `tl-progress` |
| `tlTreeView__node--drop-above`, `-below`, `-within` | `[data-tl-state~="drop-before"]`, `"drop-after"`, `"drop-onto"` |
| `tlTreeView__node--no-drop` | fällt (das TSX setzte die Klasse nie) |
| `tlColumnSelect`, `__list`, `__row`, `__handle`, `__label` | `tl-reorder-list`, `__item`, `__handle`, `__label` |
| `tlColumnSelect__search`, `__searchInput` | `tl-reorder-list__search` (`tl-field-group`) |
| `tlColumnSelect__list--fixed` | feste Höhe `size-popover-max`, sobald ein Suchfeld vor der Liste steht |
| `tlColumnSelect__groupBy`, `--active` | `tl-button--icon --sm --ghost` mit `aria-pressed` |
| `tlColumnSelect__row--dragOver-before`, `-after` | `[data-tl-state~="drop-before"]`, `"drop-after"` |
| `tlColumns`, `__column`, `--gap-compact`, `--gap-default`, `--gap-loose` | `tl-columns`, `__column`, `--gap-compact`, `--gap-default`, `--gap-loose` |

**Text, Kapseln, Status**

| Alt | Neu | Bruch |
|---|---|---|
| `tlText` | `tl-text` | still |
| `tlText--<variante>` (`display`, `headline`, `title`, `body`, `label`, `caption`) | `tl-type-display`, `-heading-lg`, `-heading-sm`, `-body`, `-label`, `-label` | still |
| `tlText--tone-<t>` | `[data-tl-tone="<t>"]`; `primary` ohne Attribut, `on-color` → `on-brand` | still |
| `tone="accent"` | `css-class="tl-type-body-strong"` | **Ladefehler** ab `TL_8.0.0-alpha9`: `ConfigurationException` mit der Liste der erlaubten Werte |
| `css-class="tlText--strong"` | `tl-type-body-strong` (Variante `label`: `tl-type-label-strong`) | still wirkungslos |
| `tlText--placeholder` | `tone="placeholder"` (ohne Kursiv) | still |
| `tlText--ellipsis` | `overflow="ellipsis"` → `tl-text--truncate` | still |
| `tlText--pill` | `appearance="pill"` → `span.tl-pill` als Wurzel mit `data-tl-role` | still |
| `.tlRelativeTime` | `tl-text tl-type-label` mit `data-tl-tone="secondary"` | still |
| `tl-pill--<rolle>` (auch `--brand`) | `.tl-pill[data-tl-role="<rolle>"]` | still |
| `tl-avatar--category-<n>` | `.tl-avatar[data-tl-role="category-<n>"]` | still |
| `tl-alert--<status>` | `.tl-alert[data-tl-role="<status>"]` | still |
| `tl-alert--closable` | fällt — die Spalte folgt dem Inhalt | still |
| `tl-select__status` | `tl-status` | still |

### Offen nach 3b

| Gruppe | Stand |
|---|---|
| **Fixiergrenze per Tastatur** | Breite erledigt in Welle 4c (#29870): Pfeile, Home, End am fokussierten Griff, `aria-valuenow`. Offen die Fixiergrenze: `role=separator` ohne Tastatur; Pfeile am fokussierten Griff wären der Weg (WAI-ARIA Window Splitter). Spec §16. |
| **Senkrechtes Auto-Scrollen beim Zeilenziehen** | fehlt heute; waagerecht gibt es zwei Fassungen (Spaltenzug, Breite ziehen) — beim Nachholen zusammenlegen. Spec §16. |
| **Ziehen-Optik Dashboard, Kalender, Farbpalette** | eigene Markierungen (leuchtender Balken, Deckkraft 0,7, keine); Welle 4/5 auf `data-tl-state`. Spec §16. |
| **Spaltenzug ohne Sonderzonen** | Mit `useListReorder` fallen die Ablagezonen „vor der ersten Spalte“ (Kopfzelle der Auswahl) und „hinter der letzten“; die Hälften der ersten und letzten Spalte leisten dasselbe. In der Sichtprüfung ansehen, ob die Ränder vermisst werden. |
| **Übergangsblock „Table cells holding legacy controls“** | 43 Zeilen im alten Stylesheet, lesen `tl-table__cell` und die Altklassen `tlStack`, `tlValueList`, `tlRowCommandCell`; jede Regel fällt mit ihrem Control (Welle 4/5). |
| **`TLValueList`-Block** | bekommt in 3b Tastatur und Optik über den Hook, der Block selbst bleibt bis Welle 5. Griff und Ansage nennen den Eintrag nicht (kein Name des Eintrags). |
| **Icon-Select** | Status, Spinner und Filter (W10, W8) in Welle 5. |
| **Nebentext auf ausgewählter Zeile** | Hell erledigt 09.10.: `text-helper` `gray-49`, 4,63 (vorher 4,42). Dunkel offen: `text-secondary` 4,27 und `text-helper` 3,64 auf `surface-interactive-selected` (Plan-Review 3b, A1); die Anzahl der Gruppenzeile ist `text-secondary`. Paar und Stufe dunkel entscheiden, wenn ein Nebentext in einer ausgewählten Zeile gebraucht wird. |
| **Schrift und Name, nach den Entscheidungen vom 09.10.** | Der Lesewert erbt die Schrift vom Ort: steht ein `tl-field-value` außerhalb von `tl-form-field__input`, Tabellenkörper und Baum, fällt er auf die Größe des Browsers zurück — in der Sichtprüfung suchen, der Ort bekommt dann `tl-type-body`. `TLProgress` (`ReactProgressControl`) ohne `label` vom Server steht ohne Namen; `ProgressState.label` sagt noch „Absent: the bar stands alone“ — der Ort braucht `labelledBy` oder der Server eine Beschriftung. **Nachgeprüft 12.10. (Review):** der Dialog der Kompaktzelle (`ReactCompactFieldControl`, Lesewert in `ReactInsetControl` im Fenster) gibt seiner Inset `tl-type-body` — erledigt; weitere Orte ohne Typo-Klasse fand das Review nicht. Ohne Namen bleiben der Fortschritt des Wizards (`ReactWizardControl` erzeugt ihn mit `label = null`) und ein `ProgressElement` mit reinem Anteil — offen, braucht eine sichtbare Beschriftung (Entscheidung) oder einen Namen im `ProgressState`. |
| **MUI-Adapter: nur der Vertrag (Hendrik 12.10.)** | Bernhards Adapter (`com.top_logic.layout.react.mui`, #29661) folgen dem Zustandsvertrag (`state.proto`), nicht unseren Konventionen: Typo-Klassen, Benennung über `aria-labelledby` und Klassen gelten nur für die eigene Darstellung, ein MUI- oder MBUI-Adapter zeichnet auf seine Art. Mit 3b nachgezogen nur, was der Vertrag erzwingt: `MuiTextAdapter` kennt `placeholder` (→ `textDisabled`) statt `accent`. Nicht angefasst, als Hinweis an Bernhard: `MuiProgressAdapter` setzt `aria-valuetext`, `MuiFormFieldAdapter` gibt `tl-form-field__input` keine Typo-Klasse (Engine-Lesewerte darin fallen auf die Browsergröße). Vorbestehend auf master: 18 rote Tests in `install.test.tsx`, zwei `tsc`-Fehler (`insideForm`, #29760). |
| **Spaltenwahl als Ebenen-Panel (#29825) — gebaut 12.10.** | `TLColumnSelect` liest kein `tl-checkbox`/`tl-choice` mehr, kein Gruppier-Icon, kein `groupBy` (Gate in `engine-classes.test.mjs`). Offen: (a) ausgeblendete Spalten stehen nach „Ok“ und erneutem Öffnen hinten, eine ausgeblendete fixierte ist gelöst — der Tabellenzustand merkt nur gezeigte Spalten, Trac #29828 (Kern, CC Bernhard); (b) Tooltip am gesperrten Auge in Firefox nicht geprüft (falls er fehlt: `aria-disabled` statt `disabled`); (c) `li role="presentation"` für „Fixiert“ in der `ul` mit axe prüfen; (d) `format()` mit `replace('{0}', …)` steht dreimal (TLColumnSelect, TLTableView, TLFileChips, dazu `list-reorder.ts`) — Konsolidierung prognostizieren. |
| **Trenner der Lesewerte** | Beim master-Merge vom 09.10. ging die Regel für `tl-select__separator` (#29693) verloren („Alpha , Beta“); seit 12.10. im Paket (`select.css`, Vertrag, Specimen, Test). |
| **Sichtprüfung lokal (12.10., `tl-demo-react` aus dem Worktree)** | Geprüft und wie entschieden: 1 Ring nur mit Tastatur, 2 Sortieren mit Enter/Umschalt+Enter (`aria-sort` an Stufe 1, Badges `aria-hidden`), 3 Dichte 36→32 px und Baumeinzug 24 px, 4 Trichter aktiv `icon-primary` mit „Filter (aktiv)“, 5 fixierte und angeheftete Spalten beim Scrollen, 8 Spaltenwahl mit Suche, Alt + Pfeil mit Ansage, 9 gedrückte Kapsel auf der Marke, 11 Textvarianten und Töne, 14 Editor in der angeklickten Spalte, 15 Fokus bleibt am Griff, 16 Pfeile im Zelleditor, 22 Tooltip am abgeschnittenen Spaltentitel, 23 Auswahlgruppen, 24 und 28 Hinweisboxen, 26 halo der Kästchen in Zeilen; dazu Lesewerte 14 px überall (auch Kompaktdialog), Job-Status „Läuft“ mit „80 %“ `aria-hidden`, Gruppenzeile 600, ausgeliefertes Paket mit `gray-49` und Trennerregel. **Behoben:** die Leerzeile „Keine Einträge“ lag bei waagerecht gescrolltem Körper außerhalb des Bildes — klebt jetzt am linken Rand. **Behoben nach Hendriks Test (12.10.):** (a) Kapsel und Segment zeigen auf der Feldfläche `-selected`, drücken `-active` (vorher hell 1,01); (b) Spaltenwahl: ein Scrollbereich statt zwei, Suche eingerückt, Fenster 70 % hoch; dazu das Kästchen, das beim Ankreuzen 2,6 px sprang (`vertical-align: middle`). Die Neuordnung der Spaltenwahl (Ebenen-Panel: Griff vorn, Auge und Schloss rechts; Spec 2026-10-12) ist entschieden (skalen.md) und kommt mit eigenem Ticket (#29825). **Offen:** (c) „Titel der letzten Spalte ohne Ellipse“ ist kein Fehler: die Tabelle scrollt waagerecht, die Spalte liegt halb unter dem angehefteten Spaltenknopf; gescrollt endet der Titel mit Ellipse; (d) Kopf und Körper liefen auseinander, wenn der Browser den Kopf beim Tab auf einen Knopf außerhalb des Bildes scrollte (auch master) — **behoben 12.10.**, der Körper folgt dem Kopf (Engine `d28bed5cf0`), von Hendrik getestet; (f) die Rückfrage „Ungespeicherte Änderungen“ listet ein Formular ohne Namen (nur „•“), und ein URL-Sprung weg von ungespeicherten Änderungen endet in „Internal error“ (`ChannelVetoException` aus `ReactSidebarControl.revealChild`) statt in der Rückfrage — beides Router/Shell (Welle 4), an Bernhard im PR; (g) Ziehen: Zeilenzug zwischen Tabellen und auf Personen funktioniert (per Drag-Events geprüft: Ziel `drop-onto`, Ablehnung mit Hinweis); Umsortieren und Baum-Ziehen gibt es in der Demo erst mit !1825; ohne Hinweis findet man den Griff nicht — entschieden „Ziehen sichtbar machen“ (#29826, nach !1825); der Kopf scrollt jetzt selbst (Hendrik); (e) `tlDownload` zeichnet „Keine Datei“ kursiv (Welle 5). Automatisiert nicht prüfbar (synthetisches Ziehen greift nicht): 7, 13, 17, 18; nicht gesehen: 6, 12 (lokal zu schnell), 19, 20, 21, 25, 27 — Hendrik von Hand. |
| **Hilfstechnik am Tabellenkopf** | Die Gruppierungsmarke hat keinen Namen; Sortierstufen ab 2 sind nur sichtbar (Badge `aria-hidden`). |
| **Messen** | `windowRange` der Tabelle ohne `ResizeObserver` (nach Größenänderung kann der Ring am Raster statt an der Zeile stehen); `useTokenPx` misst nur neu, wenn sich `data-tl-density`, `-theme` oder `-mode` an `<html>` ändert — ein Schalter tiefer im Baum bleibt ungesehen. |
| **Ziehen** | Ein bei `dragstart` von außen abgebrochener Zug lässt `dragging` stehen (vorbestehend); die Spaltenmarke bleibt bis `dragend`, wenn ein Zug die Tabelle ohne Ablage verlässt; der Spaltenzug legt den Index statt des Namens als `text/plain` ab. |
| **Kleines aus den Reviews** | `isEditorTarget` sucht mit `closest()` über den Behälter hinaus; kein Test für den Helfer und keiner für „Spalte über dem Körper losgelassen“; Platzhalter-Ton in `ConfigListEditorControl` ungetestet; Shift-Klick aufs Kästchen ohne Bereichsauswahl (vorbestehend). |
| **Sichtprüfung (mit dem PR)** | Spaltenwahl: Liste ohne Wurzel-Innenabstand, Specimen mit Suche und fünf Einträgen zeigt Leerraum; Breite der Tabellensuche (alt 16rem, min. 8rem, neu auto) und Höchstbreite des Ablehnungshinweises (alt `min(400px, …)`); `TLRelativeTime` außerhalb von Zellen ohne `nowrap`. |
| **Befund an master, #29651** (Bernhard) | `TestAccordionElement.testSectionsReachTheClient` hängt an der JVM-Locale: erwartet „General“, die deutsche Locale liefert „Allgemein“ — einziger roter Test in `layout.view` (1217 Tests). |
| **Befund an master, #29743** | Tooltip-Ebene `calc(var(--tl-layer-popover) + 1)` — eine Ebene, die die Skala nicht kennt. |
| **Befund an master, #29730 (Kanban), 09.10.** | Kandidat für die Konsolidierung, Prognose vor der Spec der Welle, die das Board holt: `controls/drop-hint.ts` `placeDropHint` ist die neunte handgeschriebene Positionsrechnung (W1 löste acht durch `usePopover`); der Ablehnungshinweis `.tlKanbanBoard__dropHint` (z-index 13000, `--support-error`) ist die alte Fassung, die die Tabelle seit E9 als `tl-popover tl-table__hint` zeichnet; die Einfügelinie zwischen Karten (`--dropBefore/--dropAfter`) ist eine eigene Ablage-Optik neben `drag.css`. Dazu Touch-Ziehen (`startPointerDrag`, eigener Block „Touch drag“). |

## Welle 4a · Overlays — gebaut 14.10.2026

Spec `docs/superpowers/specs/2026-10-13-welle-4a-overlays-design.md`, Branch `CWS/CWS_29836_design_system_welle_4a` (Engine,
Suiten grün bis auf den fremden Accordion-Test #29651, `messages_en` ohne Diff) und Paket (`main`, Ratsche je Task).
Gepusht 14.10., PR [!1882](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1882) gegen die Spaltenwahl. Ratsche: `lines` 4505 → 4010.

Sichtprüfung lokal 14.10. (`tl-demo-react`, dunkel/hell/kompakt): Dialoge (Spaltenwahl, Neu, Hinweis, Rückfrage), Escape
in Schichten, Fokus zurück, Ziehen/Größe/Maximieren, Drawer, Snackbar mit Fehlerliste. Der Tooltip am Snackbar-Schließen
liegt über der Snackbar (Spec §12 erledigt, keine Regel). Nicht live geprüft: NoticeBar, Fotoaufnahme, reduzierte
Bewegung.

### Gestrichene Blöcke

| Block (`tlReactControls.css`) | Zeilen alt | Nachfolger |
|---|---|---|
| TLOverlay | 34 | `tl-overlay` (`overlay.css`) |
| TLDialog (overlay-only) | 26 | `tl-dialog` (`dialog.css`), Scrim |
| TLDialogManager | 6 | `tl-dialog` |
| TLWindow | 183 | `tl-dialog__surface`, `tl-titlebar` (`titlebar.css`), acht Griffe `tl-dialog__resize` |
| TLDrawer | 98 | `tl-drawer` (`drawer.css`), `tl-titlebar` |
| TLSnackbar | 101 | `tl-alert tl-snackbar` (`snackbar.css`) |
| TLNoticeBar (system-wide notice) | 33 | `tl-alert tl-notice-bar` (`notice-bar.css`) |

Dazu: TLPhotoCapture 242→224 (`.tlPhotoCapture__overlay` und `__overlayBackdrop` gestrichen; Scrim und Hülle sind `tl-dialog`,
die Kamera-Knöpfe bleiben bis Welle 5) und TLAppShell 33→37 (die Übergangsregel `.tlAppShell .tl-breadcrumb` stand im Block
TLNoticeBar und zieht hierher; sie fällt in 4b). Literale: color 74→68, duration 32→29, zIndex 15→14, outlineNone 16→13.
`foreignTl` ohne `--tlSnackbar-bg`, `--tlSnackbar-fg`.

### Neu im Paket

Sechs Bausteine: `overlay.css`, `titlebar.css`, `dialog.css`, `drawer.css`, `snackbar.css`, `notice-bar.css`. Zwei Maß-Gruppen
in `tokens.json`: `size-drawer-narrow|medium|wide` und `size-toast-max`.

### Alt → neu für Anwendungs-Stylesheets

| Alt | Neu |
|---|---|
| `.tlDialog__backdrop` | `.tl-dialog` |
| `.tlDialog__backdrop--entering` / `--exiting` | `.tl-dialog[data-tl-state~="entering"]` / `~="exiting"` |
| `.tlWindow` | `.tl-dialog__surface` |
| `.tlWindow__header`, `__title`, `__toolbar` | `.tl-titlebar`, `.tl-titlebar__title`, `.tl-titlebar__actions` |
| `.tlWindow__maximizeBtn`, `__closeBtn` | `.tl-titlebar .tl-button--icon` |
| `.tlWindow__body`, `__footer` | `.tl-dialog__body`, `.tl-dialog__footer` |
| `.tlWindow__resizeHandle--<r>` | `.tl-dialog__resize[data-tl-edge="<r>"]` |
| `.tlDrawer--left` / `--right` / `--bottom` | `.tl-drawer--start` / `--end` / `--bottom` |
| `.tlDrawer--open` | `.tl-drawer[data-tl-state~="open"]` |
| `.tlDrawer--container`, `--narrow|--medium|--wide` | `.tl-drawer--container`, `.tl-drawer--narrow|--medium|--wide` |
| `.tlDrawer__header`, `__title`, `__closeBtn`, `__body` | `.tl-titlebar`, `.tl-titlebar__title`, `.tl-titlebar .tl-button--icon`, `.tl-drawer__body` |
| `.tlSnackbar.tlSnackbar--<v>` | `.tl-alert.tl-snackbar[data-tl-role="<v>"]` |
| `.tlSnackbar--exiting` | `.tl-snackbar[data-tl-state~="exiting"]` |
| `.tlSnackbar__message`, `__title`, `__close` | `.tl-alert__message`, `.tl-alert__title`, `.tl-alert__close` |
| `--tlSnackbar-bg`, `--tlSnackbar-fg` | entfällt (Rolle über `data-tl-role`) |
| `.tlNoticeBar.tlNoticeBar--<s>` | `.tl-alert.tl-notice-bar[data-tl-role="<s>"]` |
| `.tlNoticeBar--clickable` | `.tl-notice-bar[role="button"]` |
| `.tlNoticeBar__text`, `__countdown` | `.tl-alert__message`, `.tl-notice-bar__countdown` |
| `.tlOverlay`, `__base`, `__layer`, `__layer--<a>` | `.tl-overlay`, `__base`, `__layer`, `__layer--<a>` |
| `.tlPhotoCapture__overlay`, `__overlayBackdrop` | `.tl-dialog` (Scrim; Kamera-Knöpfe bleiben bis Welle 5) |

### Nachgetragen beim Bau (14.10.)

* **Titelleiste:** der Titel kürzt zuerst (`flex: 1 1 0`), Kopfknöpfe schrumpfen nicht (`flex: none`) — sonst liefen bei
  langem Titel die Fensteraktionen über die Kopfknöpfe, und die Knöpfe fielen unter 24 px.
* **Dialog:** der Scrim hat keinen Innenabstand; die Fläche begrenzt sich selbst auf
  `calc(var(--tl-size-viewport-width) - 2 * var(--tl-space-lg))` (und Höhe; Primitive `view-2`/`view-3`), maximiert ohne
  Grenze — Prozent scheiden aus: sie wuchsen beim ersten Ziehen um den Rand (andere Box), und zwischen Scrim und Fläche
  kann ein Behälter der Anwendung liegen (Demo „Neu“: 3,6-fache Viewporthöhe); `vw`/`vh` sind im Lint Literale, daher Tokens.
* **Drawer:** das Hinausschieben folgt der Schreibrichtung (`:dir(rtl)`), der Schatten erscheint nur offen — sonst schien
  der Schatten eines geschlossenen Drawers vom Rand herein.
* **NoticeBar:** der Countdown trägt `aria-live="off"` — die Rolle sagt den Hinweis einmal an, das Ticken nicht; ein
  Fehler (`role="alert"`) unterbräche sonst jede Sekunde. Die Rolle sitzt auf einer bleibenden Hülle
  (`div[role=status|alert]`, leer ohne Balken): ein klickbarer Balken ist ein Knopf, und eine Region, die schon gefüllt
  eingefügt wird, wird oft nicht angesagt.

* **Dialogbehälter (#29757, master-Merge 14.10.):** master gibt `.tlDialogManager` `display: contents`, damit der
  Behälter der Dialoge in der Fensterwurzel keinen Platz (und keinen Spalt des Stapels) beansprucht. In 4a trägt das
  Element keine Klasse mehr; `TLDialogManager` setzt `display: contents` am Element selbst.

### Offen

* ~~Ring um die ganze Dialogfläche bei Tastaturöffnung~~ — entschieden 14.10. (Hendrik: Fokus verlegen), gebaut
  (Engine `e29345b7a8`): erstes Feld, primärer Fußknopf, erstes Bedienelement im Körper, erster nicht destruktiver
  Fußknopf, erst dann die Fläche; live geprüft an „Ungespeicherte Änderungen“ (Fokus auf Abbrechen, Enter bricht ab).
* Snackbar: Rollenwechsel `status` → `alert` am lebenden Element wird nicht zuverlässig angesagt — Folgeticket **#29851**.

### Offen für 4b

**Seit #29787 (15.10.):** Panel, Sidebar, BottomBar, Toolbar und Menü zeichnen Knöpfe, Trenner und Badges über Parts
(`usePart`); 4b migriert die Hüllen um die Parts, nicht die Knöpfe selbst. Neue Atome kommen als Part mit Paketklasse.
`useKeyedTransition` ohne Klassenart (Wizard, TileStack) — deren Standard-Slides stehen seit #29792 (master-Merge in die
Spaltenwahl, 15.10.) in `tlReactControls.css` auf den Bewegungstokens und ziehen dann als `data-tl-state`-Regeln ins Paket; mobile Sidebar auf den modalen Drawer; `tlViewError` auf
`tl-alert`; `.tlAppShell .tl-breadcrumb` fällt.

### Sichtbar

Das Glass-Theme zeigt keinen Blur mehr hinter Dialogen; die Snackbar hat kein Icon (der State liefert keins).

## Welle 4b · Navigation — gebaut 16.10.2026

Spec `docs/superpowers/specs/2026-10-16-welle-4b-navigation-design.md`, Plan `docs/superpowers/plans/2026-10-16-welle-4b-navigation.md`,
Branch `CWS/CWS_29866_design_system_welle_4b` (Engine, lokal, nicht gepusht) und Paket (`main`, Ratsche je Task). Ratsche:
`lines` 3698 → 3145 (Summe der Budgets = gemessen; vier Budgets stehen zugleich auf ihrem Messwert, nicht aus 4b:
TLValueList 101→91, TLJobStatus 117→107, TLSlider 211→204, TLCalendar 255→254).

### Gestrichene Blöcke

| Block (`tlReactControls.css`) | Zeilen alt | Nachfolger |
|---|---|---|
| TLSidebar | 211 | `tl-sidebar` (`sidebar.css`) |
| Collapsed mode: center icon-only items | 110 | `tl-sidebar[data-tl-state~="collapsed"]` |
| Drawer backdrop | 6 | `tl-dialog` (4a) |
| Drawer toggle | 25 | entfällt (nur kompakt im DOM) |
| Responsive: sidebar becomes an off-canvas drawer | 61 | `tl-app-shell[data-tl-display~="compact"]`, `tl-drawer` (4a) |
| TLAppBar | 83 | `tl-app-bar` (`app-bar.css`) |
| TLBottomBar | 77 | `tl-bottom-bar` (`bottom-bar.css`) |
| TLAppShell | 37 | `tl-app-shell` (`app-shell.css`); die Übergangsregel `.tlAppShell .tl-breadcrumb` fällt |

Zusammen 553 Zeilen aus der Datei (`lines` 3698 → 3145). Literale: fontSize 31→28, duration 23→20,
zIndex 14→11; color und outlineNone unverändert.

### Neu im Paket

Vier Blöcke (`app-shell.css`, `app-bar.css`, `sidebar.css`, `bottom-bar.css`), der Behälter `tl-icon-badge` mit
`tl-icon-badge__count` (`badge.css`) und zwei Maße in `tokens.json`: `size-shell-bar` (48/40 px) und `size-sidebar`.

### Alt → neu für Anwendungs-Stylesheets

| Alt | Neu |
|---|---|
| `.tlAppShell`, `__header`, `__notices`, `__content`, `__footer` | `.tl-app-shell`, `__header`, `__notices`, `__content` (`<main>`), `__footer` |
| `@media (max-width: 768px)` für Sidebar und Hamburger | `.tl-app-shell[data-tl-display~="compact"] …` |
| `.tlAppBar`, `--primary` | `.tl-app-bar` |
| `.tlAppBar--elevated` (Schatten) | `.tl-app-bar--elevated` (Linie unten) |
| `.tlAppBar__leading`, `__title`, `__children`, `__actions`, `__trailing` | `.tl-app-bar__leading`, `__title`, `__children`, `__actions`, `__trailing` |
| `.tlSidebar`, `__nav`, `__content` | `.tl-sidebar`, `__nav`, `__content` |
| `.tlSidebar--collapsed` | `.tl-sidebar[data-tl-state~="collapsed"]` |
| `.tlSidebar--drawerOpen`, `__backdrop` | `.tl-dialog > .tl-drawer.tl-drawer--start > .tl-sidebar__nav` |
| `.tlSidebar__headerSlot`, `__footerSlot` (`--collapsed`) | `.tl-sidebar__header`, `__footer` |
| `.tlSidebar__item`, `__navItem`, `__commandItem` | `.tl-menu__item.tl-sidebar__item` |
| `.tlSidebar__navItem--active` | `.tl-sidebar__item[aria-current="page"]` |
| `.tlSidebar__item--disabled` | `.tl-sidebar__item:disabled` |
| `.tlSidebar__headerItem` | `.tl-menu__header` |
| `.tlSidebar__separator` | `.tl-menu__separator` |
| `.tlSidebar__group`, `__groupChildren`, `__chevron` (`--open`) | `.tl-sidebar__group`, `__children`, `__chevron` (`[aria-expanded="true"] >`) |
| `.tlSidebar__icon`, `__label`, `__badge` | `.tl-menu__icon`, `.tl-menu__label`, Part `Badge` |
| `.tlSidebar__iconWrap`, `__cornerBadge` | `.tl-icon-badge`, `.tl-icon-badge__count` |
| `.tlSidebar__collapseBar` | `.tl-sidebar__collapse` |
| `.tlSidebar__flyout`, `__flyoutHeader`, `__flyoutItem` (`--active`), `__flyoutSectionHeader` | `.tl-popover.tl-menu`, `.tl-menu__header`, `.tl-menu__item[aria-current="page"]`, `.tl-menu__header` |
| `.tlDrawerToggle` | entfällt (nur kompakt im DOM; `aria-expanded`) |
| `.tlBottomBar`, `__item` (`--active`) | `.tl-bottom-bar`, `__item` (`[aria-current="page"]`) |
| `.tlBottomBar__iconWrap`, `__icon`, `__badge`, `__label` | `.tl-bottom-bar__icon`, `.tl-icon-md`, `.tl-icon-badge__count`, `.tl-bottom-bar__label` |

### Sichtbar

AppBar 48/40 statt 56 px; `--elevated` eine Linie statt eines Schattens; die aktuelle Seite als Fläche statt Balken;
Einträge in `text-primary`; Kopfzeilen ohne Großbuchstaben und Sperrung; die mobile Sidebar modal über der AppBar,
gleitet herein, schließt ohne Bewegung; BottomBar-Label 12 px.

### Sichtprüfung 16.10. (lokale Demo, Chrome)

Kompakt im 700-px-iframe geprüft (das Chrome-Fenster ließ sich nicht verkleinern; `matchMedia` misst den Viewport des
iframes). Bestanden: breit 48 px, `<main>`, aktuelle Seite mit Fläche und 600, Befehl „Info“ deaktiviert mit Tooltip,
kein Hamburger, keine alte Klasse im DOM; Rail 44 px, Einträge 36 px mit Tooltip; Flyout rechts, Fokus auf dem ersten
Eintrag, Pfeile bewegen nur das Menü (Rail-Tabstopp bleibt „Demos“), Escape gibt den Fokus an den Gruppenknopf, zweiter
Klick schließt nur; kompakt Hamburger mit `aria-expanded`, Nav nicht im DOM, offen `tl-dialog > tl-drawer--start`
über der AppBar, `aria-controls` zeigt auf die Nav, Fokus auf dem ersten Eintrag, Tab bleibt drin; Escape, Scrim und
Auswahl schließen und geben den Fokus an den Hamburger, die Auswahl navigiert; offen auf breit gezogen schließt der
Drawer, wieder schmal bleibt er zu; eingeklappte Rail überdauert den Wechsel; kompakte Dichte 40 px; hell und dunkel.

Befunde, nicht behoben:

| # | Befund | Urteil |
|---|---|---|
| S1 | Die Demo-AppBar hat keine Toolbar: die Reihenfolge des Nachgebens (erst Toolbar, dann Titel) ist nur im Paket gemessen (`app-bar-shrink.test.mjs`). | hinnehmen |
| S2 | Kompakt gibt `tl-app-bar__trailing` nicht nach: bei 300 px ist der Titel weg, „Entwicklung“ behält sein Label (231 px Ende). | bleibt (Hendrik 16.10.: unter 300 px ist ein Randfall) |
| S3 | Nach dem Login trägt der aktuelle Eintrag der Sidebar den Fokus mit sichtbarem Ring (Enter im Login-Formular macht `:focus-visible`). Ob das alt so war, ist nicht geprüft. | beobachten |
| S4 | Der Drawer erschien ohne Gleiten (Abweichung 3). | behoben: gleitet herein per `@starting-style` (Hendrik: rudimentär jetzt, Bewegung im Ganzen nach Welle 5) |
| S5 | BottomBar nutzt keine Demo-Ansicht; nur im Specimen geprüft. | hinnehmen |

### Offen für 4c

Der 768-Test (`engine-classes.test.mjs`) fand keinen weiteren Breakpoint in `react-src`: `768` steht nur in
`TLAppShell.tsx`.

## Welle 4c · Behälter — gebaut 17.10.2026

Branch `CWS/CWS_29870_design_system_welle_4c` (Engine, lokal, nicht gepusht) und Paket (`main`, Ratsche je Task). Ratsche:
`lines` 3185 → 2405 (Summe der Budgets = gemessen); Literale duration 21 → 19, fontSize 28 → 27.

### Gestrichene Blöcke

| Block (`tlReactControls.css`) | Zeilen alt | Nachfolger |
|---|---|---|
| TLPanel | 130 | `tl-panel` (`panel.css`), Titelleiste `tl-titlebar` |
| TLPanel button bar | 12 | `tl-button-bar` (`button-bar.css`) |
| TLCard | 52 | `tl-card` (`card.css`) |
| TLAccordion (unlisted, #29651) | — | `tl-card.tl-accordion` (`accordion.css`), ins Paket |
| TLSplitPanel | 26 | `tl-split` (`split.css`) |
| Collapsed panel in horizontal split | 28 | `tl-split__pane[data-tl-state~="collapsed"]` |
| TLStack | 33 | `tl-stack` (`layout.css`) |
| TLGrid | 14 | `tl-grid` (`layout.css`) |
| TLInset | 61 | `tl-inset` (`layout.css`) |
| Bounded width | 14 | `tl-bounded` (`layout.css`) |
| TLDeckPane | 13 | `tl-deck` (`layout.css`) |
| Repeated items | 48 → 8 | `tl-item` (`layout.css`); bleibt die Füll-Regel der Hülle |
| TLTileStack | 76 | `tl-tile-stack` (`tile-stack.css`, `slide.css`) |
| TLWizard | 185 | `tl-wizard` (`wizard.css`, `slide.css`) |
| TLAdaptiveDetail | — | `tl-adaptive-detail` (`adaptive-detail.css`) |
| TLViewError | 29 | `tl-alert[data-tl-role="error"]` |
| TLHtml (Fehlerbox) | 184 → 174 | `.tlHtml__error` fällt, der Fehler ist `tl-alert` |
| Element picker | 47 → 41 | Regel der Panel-Knopfleiste fällt |

`--page-inset`, `--tl-item-index` und `--tlGrid-gap` fallen (TLHtml und Dashboard lesen `--tl-space-lg`).

### Neu im Paket

Dateien `panel.css`, `card.css`, `accordion.css`, `layout.css`, `split.css`, `slide.css`, `tile-stack.css`, `wizard.css`,
`adaptive-detail.css`, `button-bar.css`; Maß `size-wizard-progress`; die Titelleiste `tl-titlebar` mit `__content` und
`__buttons`.

### Alt → neu für Anwendungs-Stylesheets

| Alt | Neu |
|---|---|
| `.tlPanel`, `--normalized` | `.tl-panel` |
| `.tlPanel--minimized`, `--maximized`, `--hidden` | `.tl-panel[data-tl-state~="minimized"]`, `~="maximized"`; versteckt rendert nichts |
| `.tlPanel--card` | `.tl-panel.tl-card` |
| `.tlPanel--hoverActions`, `--fullLine` | `.tl-panel--hover-actions`, `--full-line` |
| `.tlPanel__header`, `__title`, `__titleContent`, `__toolbar`, `__actions`, `__actionButton` | `.tl-titlebar`, `__title` (`h2`), `__content`, `__actions`, `__buttons` |
| `.tlPanel__content` | `.tl-panel__body` |
| `.tlPanel__buttonBar`, `.tl-dialog__footer` | `.tl-button-bar` |
| `.tlCard`, `--outlined`, `--elevated` | `.tl-card` (Fläche nach Lage: `--nested`, `--overlay`), kein Schatten |
| `.tlCard__header`, `__title`, `__headerActions` | `.tl-titlebar`, `__title`, `__actions` |
| `.tlCard__body--pad-*` | `.tl-card__body--pad-*` |
| `.tl-accordion` (Fläche), `.tl-accordion__section--expanded` | `.tl-card.tl-accordion`; offen: `[aria-expanded="true"]` am Auslöser |
| `.tlStack`, `--*` | `.tl-stack`, `--*` (Abstände `space-sm/md/lg`) |
| `.tlGrid`, `--gap-*`, `--tlGrid-gap` | `.tl-grid`, `--gap-*` |
| `.tlInset`, `--page-inset` | `.tl-inset`, `--panel`, `--card` |
| `.tlBounded`, `.tlItem`, `--tl-item-index` | `.tl-bounded`, `.tl-item`, `--item-index` |
| `.tlDeckPane` | `.tl-deck` |
| `.tlSplitPanel`, `--horizontal`, `--vertical`, `--allCollapsed` | `.tl-split`, `--horizontal`, `--vertical`, `[data-tl-state~="all-collapsed"]` |
| `.tlSplitPanel__child`, `--collapsedHorizontal` | `.tl-split__pane`, `[data-tl-state~="collapsed"]` |
| `.tlSplitPanel__splitter`, `--horizontal`, `--vertical` | `.tl-split__handle` (`role="separator"`) |
| `.tlTileStack`, `--forward`, `--backward` | `.tl-tile-stack`, `[data-tl-state~="backward"]` |
| `.tlTileStack__frame`, `--covered`, `--entering`, `--exiting` | `.tl-tile-stack__frame`, `[data-tl-state~="covered"]`, `~="entering"`, `~="exiting"` |
| `.tlWizard`, `--forward`, `--backward` | `.tl-wizard`, `[data-tl-state~="backward"]` |
| `.tlWizard__header`, `__counter`, `__progress`, `__steps` | `.tl-wizard__header`, `__counter`, `__progress`, `__steps` |
| `.tlWizard__stepItem--done`, `--current`, `--upcoming` | `.tl-wizard__step-item[data-tl-state~="done"]`, `[aria-current="step"]`, ohne Marke |
| `.tlWizard__stepItem::before` (Zähler) | `.tl-wizard__disc` |
| `.tlWizard__stepButton`, `__stepName`, `__stepIcon` | `.tl-button--link`, `.tl-wizard__step-name`, `.tl-icon-sm` |
| `.tlWizard__step--entering`, `--exiting` | `.tl-wizard__step[data-tl-state~="entering"]`, `~="exiting"` |
| `.tlAdaptiveDetail`, `__content` | `.tl-adaptive-detail`, `__content` |
| `.tlAdaptiveDetail__breadcrumb`, `__crumb`, `--current`, `__sep` | `.tl-adaptive-detail__bar > .tl-breadcrumb` |
| `.tlViewError`, `__title`, `__view`, `__detail`; `.tlHtml__error` | `.tl-alert[data-tl-role="error"]` |

### Sichtprüfung (17.10., lokale Demo, dunkel/hell, normal/kompakt)

Bestanden: Panelköpfe 40/36 px auf einer Linie; Panel als Karte im schlichten Panel ohne eigene Stufe, Inset Karte
`space-xs`, Panel `space-md`; Split mit Pfeilen, Home, End, Loslassen speichert, Doppelklick stellt die Ausgangsaufteilung
her, beides übersteht ein Neuladen; Spaltengriff per Tastatur mit Ring innen; auswählbare Karten (halo beim Zeigen, Ring
bei Auswahl, Fokus und Auswahl zusammen doppelt); Html-Fehler als Fehlermeldung; Accordion; Wizard (Scheiben in drei
Stufen, erledigter Schritt als Link); Kachelstapel (`covered`/`entering`); AdaptiveDetail schmal mit Breadcrumb.

| # | Befund | Stand |
|---|---|---|
| S1 | End am Split setzt die zweite Fläche auf 0, wenn sie kein Mindestmaß hat | WAI-gemäß (End = Maximum); keine Änderung |
| S2 | Fokusring und Auswahlring einer Karte kaum zu unterscheiden — beide `border-interactive`, nur der Abstand trennt | offen, Hendrik |
| S3 | Halo beim Zeigen sehr schwach (dunkel `surface-state-hover`, 4 px) | offen, Hendrik |
| S4 | Wizard-Demo: Knöpfe im Slot bündig am Panelrand | Demo-View (Panel ohne `with-inset`), nicht 4c |
| S5 | Minimieren und Maximieren erreicht keine View (`PanelElement` übergibt `false`) — U1/U3 nur per Vitest geprüft | Hinweis an Bernhard |
| — | nicht geprüft: Karte im Dialog, Anzeige des ViewError (Java-Test), VoiceOver | — |

## Konsolidierung (01.10.) — Gleiches wird zusammengelegt

Regel (CLAUDE.md „Arbeitsweise“, skalen.md „Gleiches wird zusammengelegt“): findet eine Erkundung zwei Stellen, die
dasselbe zeichnen oder tun, gibt es vor der Spec eine Prognose; Hendrik entscheidet. Drei Erkundungen vom 01.10.
(Welle-3-Bestand, Wellen 0–2, Überschneidungen). **Entschieden 01.10.: alle Zeilen unten werden gemacht**, in der
genannten Welle. Welle 3 läuft als zwei gestapelte PRs: **3a Navigation und Popups**, **3b Daten**.

Urteile: **lohnt** = eigener Grund; **lohnt mit der Welle** = die Stelle wird ohnehin angefasst.

### Welle 3 (und Nachzüge aus Welle 1–2 im selben PR)

| # | Befund | Sichtbar heute | Zusammenlegen zu | UX-Gewinn | Berührt | Urteil · PR |
|---|---|---|---|---|---|---|
| W1 | **Popups:** 8 handgeschriebene Positionsrechnungen (`TLMenu` 2 Modi, Toolbar-Dropdown, Select, `dropHint`, Tabellenmenü *ohne* Rechnung, Color/Icon zeilengleich, Sidebar); nur der Tooltip nutzt `@floating-ui/react` (schon Abhängigkeit). Escape/Außenklick/Fokusfalle je anders; 4 Flächen-Stile | ja: Tabellenmenü ragt aus dem Viewport, Menü und Select folgen Scroll nicht, verschiedene Flächen/Radien | `bridge/popover.ts` auf floating-ui (offset, flip, shift, autoUpdate) + Fläche `tl-popover` (overlay, separator, radius-md, shadow-popover, layer-popover) + ein Schließ-/Fokus-Verhalten | kein Popup ragt heraus, alle folgen Scroll/Resize, gleiche Fläche | Menü, Tabellenmenü, Toolbar, **Select (Nachzug W2)**; Color/Icon W5, Sidebar W4 | lohnt · 3a |
| W2 | **Einträge:** 7 Anatomien „Icon + Label + Ellipse“ (Menüeintrag, Tabellenmenü von Hand, Toolbar-Dropdown als Ghost-Button, Baumknoten, ColumnSelect-Zeile, Tab, Breadcrumb; Select-Option ohne Ellipse); Zustand doppelt als Klasse und Attribut | ja: Menüeintrag ~2× so hoch wie Dropdown-Eintrag, Select-Label bricht um | `tl-menu__item` für alle Menüs (Tabellenmenü = `TLMenu`-Instanz; Toolbar-Overflow über `ButtonDefaults appearance="menu-item"`); `size-row` für Option, Knoten, ColumnSelect-Zeile; Ellipse einmal (`tl-truncate`); Zustand nur Attribut | gleiche Höhe in allen Listen, Fokus liest den Eintrag vor | 7 TSX, 7 CSS | lohnt · 3a |
| W3 | **Fokus/Cursor:** 4 Formen (Inset-Schatten um Zeile, Outline am Knoten, Hintergrund am Menüeintrag, Akzentlinie im Select); Tabelle und Baum zeigen den Cursor ohne Tastaturfokus; Tab `:focus`; `outline:none` an Baum, Menü, 3 Suchfeldern | ja: zwei Blautöne, Ring ohne Tastatur, Offsets −2/−1/1/2 | Cursor = `focus-ring` innen, nur bei `:focus-within` des Containers; Menü bewegt echten DOM-Fokus (Roving); Hervorhebung bleibt Akzentlinie | Ring nur bei Tastatur, eine Farbe | 7 CSS-Gruppen, 4 TSX | lohnt · 3a (Tabelle/Baum 3b) |
| W4 | **Toggles/Chevrons/Sort:** 7 Zeichnungen in 4 Zeichensätzen (▾▸, `::before` ▶▼, Inline-SVG, Font-Icon), Knöpfe 20/24/32 px; `fa-chevron-down` heißt im Select „zu“, in der FormGroup „offen“; Sortindikator ▲▼ ohne `aria-sort` | ja | `tl-toggle` (quadratisch `size-control-sm` = 24 px, `aria-expanded`, rechts = zu, unten = offen) für Baum, Baum-Tabelle, **FormGroup (Nachzug W2)**; Breadcrumb-Trenner und Sortpfeil als `tl-icon-sm` | eine Form, 24-px-Trefferfläche (WCAG 2.5.8) | 7 TSX, 7 CSS | lohnt · 3a |
| W5 | **Icon-Knöpfe:** Welle 3 fünf Arten (`barButton`, `columnsButton`, `filterButton` mit `#1565c0` inline, `groupBy`, `menuTrigger--icon`); Welle 1–2 drei eigene Blöcke (`tl-select__chip-remove/clear`, `tl-field-group__action`, `tl-form-group__toggle`) | ja: Trefferflächen 22–32 px, 4 Hover-Optiken, Filterblau in allen Themes gleich | `tl-button--icon` (quadratisch `size-control`, `--sm` 1.5rem) mit `aria-pressed`-Optik aus `button.css`; Toolbar-Trigger = `tl-button` der Toolbar-Erscheinung | gleiche Trefferfläche, gleiches Hover/Pressed/Disabled | 8 TSX + 3 Welle-2-Blöcke | lohnt · 3a |
| W6 | **Checkbox:** Tabelle nativ (`accent-color`), ColumnSelect `tl-checkbox` ohne `tl-choice`; 3 Label-Varianten mit 2 Farben; Tri-State zweimal | ja: native neben Token-Box, Label nicht ausgegraut | `tl-checkbox` + `tl-choice` überall; Klassen-Helfer wie `buttonClassName`; Kopf = `aria-checked="mixed"` | eine Box, Deaktiviert sichtbar | 3 TSX, 3 CSS | lohnt · 3b |
| W7 | **Kapseln:** Filterchip der Tabelle (Span + 2 Knöpfe, 1.75rem, `×` ~18 px), `tl-chip` (1 Knopf), `tl-select__chip` (Pill + Entfernen); Pill **in** Chip/Segment verschachtelt; Icon-Label-Lücke 0/2xs/xs; `tl-type-label` doppelt; `TLText`-Pill ohne Typo; Rollenfarben 3× | ja: Doppelkapsel, drei Höhen | `tl-pill` (passiv), `tl-chip` (Knopf, optional `__remove` 24 px), Tönung über `data-tl-role` ohne Verschachtelung; Rollenfarben einmal erzeugt | keine Doppelkapsel, eine Höhe, Entfernen 24 px | Tabelle + **Nachzug W2** (OptionChips, Segment, Select-Chip, TLText) | lohnt · 3b |
| W8 | **Suchfelder:** 3 eigene (Tabelle Suche/Speichern, ColumnSelect) ohne Fokusring, `outline:none`, `bi-search`; Select nutzt `tl-field-group`; Filterlogik doppelt | ja: kein Fokus, zwei Lupen | `tl-field-group` + `tl-field` + `__action` überall; `filterOptions`-Helfer | Fokusring, Löschknopf, eine Lupe | 3 TSX, 3 CSS | lohnt · 3b |
| W9 | **Trenner:** 3 zeilengleiche `<hr>`-Blöcke (Menü, Toolbar-Dropdown, Sidebar), senkrechter Toolbar-Trenner; `tl-divider` ohne Aufrufer; 4 Separator-Deklarationen im Paket | nein | `tl-divider` überall | — | 3 TSX, 4 CSS | lohnt mit der Welle · 3a |
| W10 | **Laden/Leer:** Baum-Spinner + 3 Fremdspinner; kein Spinner im Paket; Select-Status als Muster, IconSelect dupliziert es; Tabelle ohne Lade- und Leerzustand; Skeleton ohne Aufrufer | ja: Ring vs. Balken; leere Tabelle = leere Fläche | `tl-progress` unbestimmt als einziges „lädt“; `tl-status` (Laden/Fehler/Leer) aus `tl-select__status`; Tabelle und Baum bekommen beides | „Keine Einträge“ statt Leere | Baum/Tabelle; IconSelect/Audio/Download W5 | lohnt · 3b |
| W11 | **Drag & Drop:** 5 Implementierungen (Tabellenzeilen, Spalten, Baum, ColumnSelect per `useListReorder`, Select-Chips) + Dashboard; 5 Indikator-Optiken; Einfügeposition 4×, Halbierer 3×, Drittel 2×, Auto-Scroll 2× | ja: Spaltenkopf springt 2 px, zwei Tönungen für „auf die Zeile“ | `useListReorder` für Spaltenzug und Select-Chips, `dropPositionAt` für Baum; eine Optik: `data-tl-state=drop-before/after` Linie `border-interactive`, `drop-onto` Tönung + Ring, `dragging` Deckkraft | gleiche Linie überall | 4 handgebaute + 1 W2 | lohnt · 3b (Select-Chips Nachzug) |
| W12 | **Toolbar:** Trigger als Eigenbau-Secondary mit Rahmen auch in Ghost-Toolbars; `--tl-toolbar-trigger-size`/`-shrink-priority` nur im Altbestand definiert, von Panel-Header und AppBar gelesen; Übergangsregel „compact blendet Label aus“ | ja | Trigger = `tl-button` der Toolbar-Erscheinung; `trigger-size` entfällt (TSX misst), `shrink-priority` wird Regel ohne `--tl`; compact = Attribut am Toolbar, der Button liest es | Trigger wie die Knöpfe daneben | 1 TSX, 3 CSS-Leser | lohnt · 3a |
| N1 | **Lesewert:** 3 Renderer von `tl-field-value` (`FieldValue`, `ReadonlyValue`, `TLResourceCell`), 3 Icon-Renderer, `withPill` in `selectOptions.tsx`; Links: Formular neuer Tab, Select/Zelle `goto` | ja: Link je Ort anders | ein `FieldValue` (Link-Modus, Tooltip, mehrzeilig), `withPill` → `pill/`, Icon über `ThemeIcon` | Link überall gleich | 6 Renderer, 10 Aufrufer | lohnt mit der Welle · 3b |
| N8 | **Verträge:** disabled (Vertrag „kein Zustand“, Code liest `state.disabled`), `hidden` (rendert nichts vs. bleibt im DOM), „Chip“ zweimal anders, `aria-selected` Vertrag ≠ Code; Specimen `bi-*`, Engine `fa-solid`; 13 identische `<style>`-Blöcke | nein | Doku-Pass mit den Welle-3-Verträgen; `specimen/specimen.css` | — | 6 Verträge, 13 Specimen | lohnt mit der Welle · 3a |

### Wellen 0–2, unabhängig von Welle 3

| # | Befund | Sichtbar heute | Zusammenlegen zu | UX-Gewinn | Berührt | Urteil · wann |
|---|---|---|---|---|---|---|
| N7 | **Paket-CSS:** Ellipse 5× (Feldlabel ohne `nowrap` bricht um), Deaktiviert-Cursor `not-allowed` (Feld, Auswahl) vs `default` (Button), Warnung/Fehler-Muster 4×, `[hidden]` 25×, Rollenfarben 3×, `surface-interactive-selected` 5× | ja: Cursor, Label-Umbruch | `tl-truncate` und `[hidden]` in `base.css`; Rollenfarben aus `generate.mjs`; **`default` überall** (entschieden 01.10., skalen.md „Disabled“); Fehler/Warnung als Generator-Mixin | gleicher Cursor, kein Umbruch | nur Paket + `dist` | lohnt · **umgesetzt 01.10., `6bb0862`** (245 Tests): `default` überall und Lint meldet `not-allowed`; Ellipse je Block vollständig, Formularlabel bricht um (tote Deklaration gestrichen); Rollenfarben (Kategorien und Status) erzeugt `generate.mjs` aus `tokens.json` über Marker `/* @tl-roles: … */`, Quellen schreiben sie nicht mehr. **Lohnt nicht:** `[hidden]` je Block bleibt (Welle-2-Entscheidung mit Gate; `!important` ist im Lint verboten); Warnung/Fehler-Blöcke sind absichtlich verschieden (Checkbox meidet `:disabled`, Chip meidet `aria-pressed`) |
| N2 | **Fehlermeldung doppelt:** Meldung im Feldrahmen **und** Tooltip (Text, Passwort, Zahl; nicht Datum, Select); `tl-form-field__message` als Kopie in `TLPanel`; 3 `[role=alert]`-Farbregeln; Löschknopf mit nativem `title` | ja | ein `FieldMessage`-Renderer, Tooltip-Doppel weg, eine `[role=alert]`-Regel, `title` weg | Fehler einmal, ein Tooltip-System | 4 TSX, 3 CSS | lohnt · **eigenes Paket nach Merge von !1740** |
| N9 | **Select:** `aria-disabled` ohne Optik; native `<select>`/`<input type=date>` mit Browser-Pfeil neben Icon-Pfeil | ja | `tl-field[aria-disabled]`-Regel; native Auswahl in `tl-field-group` mit `appearance:none` und Chevron | deaktiviert sichtbar, ein Pfeil | 3 TSX, 1 CSS | lohnt · mit N2 |
| N3 | **Upload:** `TLFileUpload` und `TLBinaryField` zeilengleich, `TLUploadButton` dritte Fassung, `TLFileChips` vierte; `disabled` blockiert DnD nur in einer | ja | `useUpload`-Hook + eine Dropzone | DnD überall gleich | 4 TSX | lohnt · **Welle 5** |
| N4 | **Popups außerhalb Welle 3:** Color/Icon-Popup zeilengleich, Sidebar-Flyout ohne Flip | ja | W1-Helfer | wie W1 | 3 TSX | lohnt · **Welle 4/5** |

Querbefund ohne Konsolidierung: der Altbestand liest `--focus` = `#2968C8`, das Paket `focus-ring` = `#0B5ED7` —
zwei Blautöne nebeneinander, bis die Welle-3-Blöcke leer sind.

### Welle 4 (13.10.) — entschieden: alle Zeilen wie vorgeschlagen

Drei Erkundungen (Overlays, Gerüst und Layout, Nachprüfung der Wellen 0–3b gegen Welle 4) und ein Graphify-Lauf über
`react-src/`, die Java-Controls und `tlReactControls.css` (AST, 3252 Knoten; brachte keine neue Gruppe, bestätigte
`EscapeToClose` doppelt und zählte 15 handgezeichnete SVG-Icons in sieben Welle-4-Dateien; danach gelöscht).
**Entschieden 13.10. (Hendrik): alle Zeilen wie vorgeschlagen, Schnitt in zwei gestapelte PRs** — **4a Overlays**
(Dialog, DialogManager, Window, Drawer, Snackbar, NoticeBar, Overlay; Trac #29836), **4b Gerüst** (AppShell, AppBar,
Sidebar, BottomBar, Panel, SplitPanel, Card, Stack, Grid, DeckPane, TileStack, Inset, AdaptiveDetail, Accordion,
Wizard, ViewError, Kopfblöcke; eigenes Ticket beim Start).
**Nachgeschnitten 16.10. (Hendrik):** 4b ist nur die **Navigation** (AppShell, AppBar, Sidebar mit mobilem Drawer
und Flyout, BottomBar; Q10–Q13, die Leiste aus Q14; Trac #29866), die Behälter werden **4c** (Q14–Q18, eigenes Ticket
beim Start) — zusammen ~1.330 Zeilen Altbestand, das Dreifache von 4a.

| # | Befund | Sichtbar heute | Zusammenlegen zu | Urteil · PR |
|---|---|---|---|---|
| Q1 | **Dialog:** zwei Schichten — `TLDialog` (Backdrop, Außenklick, Escape, kein `role`), `TLWindow` (`role=dialog`, `aria-modal`, Falle, Rahmen); `TLPhotoCapture` baut einen dritten Vollbild-Dialog ohne Falle und Fokusrückgabe | ja (Photo) | ein Dialog im Paket (Scrim, Fläche, Kopf, Fuß); die fünf Java-Aufrufer über `ReactWindowControl` bleiben unverändert; Photo darauf | lohnt · 4a |
| Q2 | **Scrim:** 3 Fassungen — Dialog mit Blur, Sidebar-Drawer ohne, Photo `rgba(0,0,0,.85)` | ja | eine Fläche auf `--tl-surface-scrim` und `layer-overlay` | lohnt · 4a |
| Q3 | **Kopfzeile Titel + Aktionen:** 6 Fassungen (Panel, Card, AppBar, Window, Drawer; Accordion schon `tl-*`), Titel `bold`/`600`, vier Abstände, vier Höhen | ja | ein Kopf-Muster: Titel mit Typo-Klasse, Aktionen als `tl-toolbar`, Schließen nach Q4 | lohnt · 4a (Panel/Card/AppBar 4b) |
| Q4 | **Kopfknöpfe:** 7 Eigenbauten (Window ×2, Drawer, Panel ×3, Sidebar-Einklappen, Hamburger) in 28/32/40 px; 15 Inline-SVGs in Welle 4, das X dreimal | ja | `tl-button--icon --sm` mit `ThemeIcon` (W5 ausgedehnt) | lohnt · 4a/4b |
| Q5 | **Fokus:** `useFocusTrap` zentral, der Drawer kopiert die Hälfte ohne Falle; Photo, Color, Icon und Sidebar-Flyout geben den Fokus nicht zurück | ja | `useFocusTrap` mit Modus „ohne Falle“, alle Overlays darauf | lohnt · 4a |
| Q6 | **Escape:** 3 Wege; `EscapeToClose` zweimal kopiert; Sidebar fängt Escape doppelt | nein | ein `useDismiss` (Escape + Außenklick) | mit der Welle · 4a |
| Q7 | **Meldungen:** Snackbar und NoticeBar färben mit `#fff`/`#000` und `--tlSnackbar-*`; Fehler dort `status`, im Alert `alert`; `tlViewError` und `tlHtml__error` dieselbe Box | ja | Rollenfarben und Ansage-Regel von `tl-alert`; Lage, Timer, Countdown bleiben eigene Hülle; ViewError und Html-Fehler werden `tl-alert` | lohnt · 4a (ViewError 4b) |
| Q8 | **Ebenen:** Literale — Flyout 1000 (Ebene der Dialoge), Sidebar-Drawer 50/49, Drawer-Container und maximiertes Panel 10 | nein | Flyout `popover`, Sidebar-Drawer `overlay`, die 10er `raised` | mit der Welle · 4a/4b |
| Q9 | **Dauern:** 0,15–0,25 s als Literale; Snackbar `200` im TSX ungekoppelt ans CSS | kaum | `--tl-duration-*`, `--tl-easing-*` | mit der Welle · 4a/4b |
| Q10 | **Off-Canvas-Sidebar gegen `TLDrawer`:** zwei Schubladen; die der Sidebar ohne Escape, Fokuswechsel, `aria-hidden`, `top: 3.5rem` an die AppBar gekoppelt | ja | ein Drawer-Muster mit optionalem Scrim; die Sidebar wird mobil dieser Drawer | lohnt · 4b |
| Q11 | **Sidebar-Flyout:** eigene Positionsrechnung ohne Flip und ohne Nachführen, `role=menu` von Hand | ja: läuft aus dem Fenster | `Menu.tsx` mit `usePopover`; der Hook bekommt `right-start` (N4, Sidebar-Teil) | lohnt · 4b |
| Q12 | **Navigationseinträge:** Sidebar-, Flyout-, BottomBar-Eintrag drei Anatomien; aktiv nur Klasse, kein `aria-current`; Badge doppelt; `<hr>` dreimal (Rest W9) | ja | Anatomie wie `tl-menu__item` mit `aria-current`; `tl-badge`; `tl-divider` | lohnt · 4b |
| Q13 | **Ein-/Ausklappen:** Sidebar-Gruppe dreht 180° (unten = zu), Accordion und `tl-toggle` rechts = zu; Sidebar-Einklappen und Panel-Minimieren ohne `aria-expanded` | ja | eine Chevron-Regel, `aria-expanded` an jedem Auslöser | lohnt · 4b |
| Q14 | **Leisten:** AppBar, BottomBar, Panel-Knopfleiste, Window-Fuß; Höhe `3.5rem` dreimal literal | ja | eine Leistenfläche auf einem Größen-Token, Befehle als `tl-toolbar` | mit der Welle · 4b |
| Q15 | **Flächen:** `TLCard`, `.tlPanel--card`, Accordion — drei Kartenflächen | ja: klein | eine Kartenfläche nach `tl-accordion` | mit der Welle · 4b |
| Q16 | **Abstände:** Stack und Grid führen die 3-Stufen-Skala von `tl-columns` auf Alt-Tokens; `--tlGrid-gap` (Fremdgut), `--page-inset` | nein | eine Gap-Skala aus `space-*` | mit der Welle · 4b |
| Q17 | **Teiler:** SplitPanel-Teiler ohne `role` und Tastatur, Spaltengriff der Tabelle mit `role=separator` | ja | ein Griff mit `role=separator`, `aria-valuenow`, Pfeiltasten; erledigt „Spaltenbreite per Tastatur“ aus „Offen nach 3b“ | lohnt · 4b |
| Q18 | **Breadcrumb:** `TLAdaptiveDetail` eigene Fassung mit `›`, ohne `aria-current`, festes englisches `aria-label` | ja | `TLBreadcrumb` | mit der Welle · 4b |
| Q19 | **Wizard-Schritte** gegen Tabs und Breadcrumb | ja | eigenes Muster bleibt, nur die Disc auf Tokens | lohnt nicht |

Mitfallend in 4b ohne Zusammenlegen: kein `<main>`-Landmark; `aria-label="Bottom navigation"` fest englisch;
Breakpoint `768` in `TLAppShell.tsx` und im CSS getrennt. Nicht Welle 4: Color- und Icon-Popup (N4), Kanban
`drop-hint` und `DropState` (Welle 5), `LocalStatus` viermal in den Upload-Controls (N3, Welle 5); Drag-Schild,
Touch-Bild, Element-Picker und Kanban-Hinweis bleiben bei Literalen 10000–13000 (Token `layer-drag` in Welle 5
entscheiden). Kleinkram: `getContextPath()` steht gleichlautend in `route-sync.ts` und `window-manager.ts`.

**Nachgetragen beim Planen von 4a (13.10.)** — Spec 4a §13, Plan „Abweichungen“: Q3 wird der Block `tl-titlebar`
(statt je ein `__header`); Q6 wird eine gemeinsame Komponente `EscapeToClose` in `bridge/` statt eines Hooks
`useDismiss` (ein Hook bindet nicht in den Scope, den dieselbe Komponente öffnet); Q1 nimmt bei der Fotoaufnahme nur
Scrim, Fokus und Escape — die Kamera-Knöpfe bleiben bis Welle 5; Q7 ohne Icon in der Snackbar (der Zustand liefert
keins). 4a setzt auf die Spaltenwahl (!1852) auf.

### Welle 4c (16.10.) — Nachprüfung vor der Spec; entschieden: alle Zeilen wie vorgeschlagen

Zwei Erkundungen: Bestand der zwölf Behälter und Nachprüfung der Wellen 0–4b gegen sie. Q3, Q7, Q8 und Q13–Q19 aus der
Tabelle oben gelten weiter und sind mit Zahlen nachgeschärft; neu sind Q20–Q23. **Entschieden 16.10. (Hendrik): alle
wie vorgeschlagen.** Spec `docs/superpowers/specs/2026-10-16-welle-4c-behaelter-design.md`, Trac #29870.

| # | Befund | Sichtbar heute | Zusammenlegen zu | Urteil |
|---|---|---|---|---|
| Q3 | Panel-Kopf mit Fläche `layer-02`, Titel fett, 0,5/1 rem; Card-Kopf 1/1,5 rem, Gewicht 600; beide Titel `span` | ja | `tl-titlebar` (4a), Titel `h2` | lohnt |
| Q13 | Panel-Minimieren ohne `aria-expanded` | nein | `aria-expanded`, `aria-controls` | lohnt |
| Q14 | Panel-Knopfleiste (Abstand 1 rem, 1/1,5 rem, `:has(button)`) gegen Dialog-Fuß (0,5 rem, 0,75/1 rem, `:empty`) | ja | ein Block für die untere Befehlsleiste | mit der Welle |
| Q15 | Drei Kartenflächen: TLCard (`shadow-raised`), `.tlPanel--card`, Accordion | ja: klein | `tl-card` nach der Fläche des Accordions | lohnt |
| Q16 | Stack/Grid 0,5/1,5/3 rem gegen `tl-columns` 0,75/1/1,5 rem, gleiche Stufennamen | ja, in jeder Ansicht | eine Gap-Skala | mit der Welle |
| Q16b | `--tlGrid-gap` Fremdgut; `--page-inset` dreifach definiert (Wurzel, Panel, Karte) | nein | Abstand aus der Stufe; Inset von der Fläche | mit der Welle |
| Q17 | SplitPanel-Teiler: 4-px-Balken, ohne `role`, ohne Tastatur; Tabellengriff `role=separator`, ohne Tastatur | ja | ein Griff mit Tastatur und `aria-valuenow` | lohnt |
| Q18 | AdaptiveDetail-Breadcrumb mit `›`, 600, `aria-label="Breadcrumb"`, ohne `aria-current` | ja | `TLBreadcrumb` | mit der Welle |
| Q7 | ViewError und `tlHtml__error`: Linie links 1 rem, neutrale Fläche, ohne Rolle | ja | `tl-alert` `error` | lohnt |
| Q8 | Maximiertes Panel `zIndex: 10` inline | nein | `layer-raised` | mit der Welle |
| Q19 | Wizard-Scheibe auf Alt-Tokens; Zähler fest, Liste ohne Namen | ja | eigenes Muster, nur Tokens | lohnt nicht (Zusammenlegen) |
| Q20 | `tl-accordion` steht im alten Stylesheet (Bernhard, #29651, 02.10.), ohne Vertrag und Specimen | nein | ins Paket | mit der Welle |
| Q21 | Slide-Versatz TileStack 24 px, Wizard 12 px, Literale | kaum | ein Versatz auf einem Token | mit der Welle |
| Q22 | `tlBounded`, `tlItem` (nur Stack/Grid); `tlFill`, Viewport, Mount (rund 20 Controls) | nein | 4c: `tl-bounded`, `tl-item`; Welle 5: Fill, Viewport, Mount | mit der Welle, zum Teil |
| Q23 | Pfeiltasten-Fokus sechsmal eigen (Accordion, Tree, Table, Sidebar, Dropdown, Segmented) | nein | ein Hook | lohnt nicht in 4c, eigener Strang |

Schon erledigt: den Breakpoint von AdaptiveDetail entscheidet der Server über die `DisplayClass`, die die AppShell seit
4b meldet.

**Nachgetragen 16.10. (nach dem Merge von !1906, master `2bf2151a2e`) — entschieden (Hendrik: „ja passt“):**

| # | Befund | Sichtbar heute | Zusammenlegen zu | Urteil |
|---|---|---|---|---|
| Q24 | Auswählbare Einträge aus #29755 (!1905, Bernhard): `.tlItem--selectable` hebt sich beim Zeigen mit `--shadow-raised`, `.tlItem--selected` als Klasse (`aria-selected` steht schon am Eintrag), eigener Fokusring 2 px `--focus`, `120ms ease` | ja | `tl-item[aria-selected]`: beim Zeigen ein halo (`surface-state-hover`) statt Schatten, ausgewählt der Ring `border-width-md` `border-interactive` (eine Fläche sähe man hinter einer Karte nicht), Fokus aus `base.css` | mit der Welle |
