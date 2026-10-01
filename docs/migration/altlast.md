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

Kunden- und Anwendungs-CSS, das die alten Klassen anspricht, liest künftig diese (Liste = Grep-Gate `test/engine-classes.test.mjs`):

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

### Offen für spätere Wellen und Pakete

| Gruppe | Stand |
|---|---|
| **AppBar-Breakpoint** | AppBar-Breakpoint für den Benutzernamen (war 640 px; Welle 4). Das Benutzermenü liegt im `trailing` der AppBar, nicht in einer Toolbar; „bei Platzmangel nur der Avatar“ (Spec §7) ist eine AppBar-Regel. Dazu die **Namensbreite** (war `max-width: 12rem`): `tl-button__label` schneidet erst ab, wenn etwas die Breite begrenzt — ohne Grenze greift die Ellipse nicht, ein langer Name verbreitert den Auslöser bis Welle 4. |
| **Reiter-Überlauf** | `tl-tabs__list` hat keinen Überlauf: viele Reiter laufen über den Rand hinaus. Nicht in Welle 3 (Spec §11), ebenso Untermenüs und Typeahead im Menü. |
| **Gefahrton im Toolbar-Überlauf** | Ein `danger`-Knopf verliert im Überlauf seinen Ton: der Menüvertrag kennt keinen Gefahr-Eintrag („ein Eintrag ist Struktur“). Entscheidung mit Hendrik offen; Option `data-tl-tone="danger"` am `tl-menu__item` im Paket. |
| **Menü-Auslöser im Toolbar-Überlauf** | Unter `ButtonDefaults appearance="menu-item"` wird der Klick-Auslöser `button.tl-menu-region.tl-menu__item` ohne `role="menuitem"` und `tabindex=-1`; die Pfeiltasten des Überlaufs überspringen ihn. Heute unerreichbar (Toolbars tragen nur Kommando-Knöpfe). Fix: `menuItemProps(defaults)` wie `TLButton`, oder fest `ghost`; dazu entscheiden, ob `?? 'ghost'` (Panel-Leisten: `secondary`) oder der Vertrag „immer ghost“ gilt. |
| **Gebündeltes aus dem Review** | Versteckter Upload im Überlauf fängt die Pfeiltasten (`<span hidden>` mit innerem `menuitem`; Roving filtert `getClientRects()` oder Upload rendert nichts). Tab schließt das Menü nicht (WAI-ARIA); Menü ohne `aria-labelledby`; Einträge, die bei offenem Menü dazukommen, bleiben `tabindex=-1` bis zur ersten Pfeiltaste. Kontextmenü am Punkt um `space-xs` versetzt (Offset auch am Punkt-Anker); Kontexttaste sendet einen Punkt statt des Elements. Fehlt das Anker-Element, öffnet das Menü ohne Anker. Popup-Breite nur beim Rendern gemessen; die Kaskade `select` nach `popover` hängt an der Dateireihenfolge in `generate.mjs`. Kein Offen-Stil für `aria-expanded` am `tl-button`. Tablist ohne `aria-label`; die Toolbar heißt generisch (`js.toolbar.label`), ein Name aus dem Kontext ist ein eigener Punkt. |
| **Sichtprüfung (mit dem PR)** | Popup-Mindestbreite `size-popover-min` schlägt Felder unter 10rem; `max-height` des Select-Popups lässt weniger als acht Zeilen sichtbar; `Shift+F10` kann ein zweites natives Kontextmenü auslösen; Panelkopf `+2·space-2xs` höher, Trigger in der primären App-Bar; Toggle-Drehung; Specimen `progress`/`icon` im Browser. |

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
