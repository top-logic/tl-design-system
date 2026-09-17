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

Diese 31 Tokens las das alte CSS ohne Ziel in der Skala. Sie fallen mit ihrer Komponente:

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
