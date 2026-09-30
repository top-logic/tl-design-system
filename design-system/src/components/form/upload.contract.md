# Vertrag: Upload

Eine Kundenkomponente, die unter einem der TopLogic-Namen `TLFileUpload`, `TLBinaryField` oder
`TLUploadButton` registriert ist (Stufe C der Spec), bekommt vom Server den Zustand unten, löst die
genannten Aktionen aus und trägt die genannten Attribute. TopLogic garantiert dann Funktion, Tastatur und
Fokus — nicht das Aussehen. Der Knopf ist immer ein `tl-button` (`button.contract.md`); hier liegen nur die
Hülle `tl-upload` um den Knopf und die Drop-Zone `tl-file-upload` des Datei-Feldes.

## Zustand

Vom Server über `useTLState()`.

| Control | Schlüssel | Typ | Bedeutung |
|---|---|---|---|
| `TLFileUpload` (`ReactFileUploadControl`), `TLBinaryField` | `status` | string | `idle` oder `received`: die Datei ist eingegangen. Den Zustand „lädt hoch“ hält der Client selbst. |
| `TLFileUpload`, `TLBinaryField` | `error` | string, optional | Text des Fehlers beim letzten Hochladen: `tl-file-upload__status` mit `role="alert"`. |
| `TLFileUpload`, `TLBinaryField` | `accept` | string, optional | Filter der erlaubten MIME-Typen, am verborgenen `input type="file"`. |
| `TLFileUpload` | `maxSize` | number, optional | Höchstgröße des Hochladens in Byte, vom Server geprüft. |
| `TLBinaryField` | `hasData`, `fileName`, `editable` | boolean, string, boolean | Ob eine Datei da ist, ihr Name, ob das Feld bearbeitbar ist; sonst nur der Verweis zum Herunterladen. |
| `TLUploadButton` (`ReactUploadButtonControl`) | `accept` | string, optional | Filter am verborgenen `input type="file"`; `*` heißt kein Filter. |
| `TLUploadButton` | `multiple` | boolean, optional | Mehrere Dateien auf einmal. |
| `TLUploadButton` | `label`, `image`, `disabled`, `displayMode`, `appearance`, `tone`, `size` | wie `TLButton` | Geerbt von `ReactButtonControl`; der Knopf sieht aus wie jeder `tl-button`. |

Die Basisschlüssel des Feldes (`value`, `editable`, `label` und die übrigen) stehen in `field.contract.md`.

## Aktionen

| Auslöser | Aktion |
|---|---|
| Klick auf den Knopf | öffnet den verborgenen Dateidialog; ist der Knopf deaktiviert oder lädt er hoch, geschieht nichts. |
| Datei gewählt oder auf die Drop-Zone gelegt | Upload über den Upload-Kanal (`/react-api/upload`, `multipart`, Teil `file`); der Server liefert die Datei an `handleUpload`. Keine Server-Aktion per `sendCommand`. |
| Datei entfernen | Es gibt keinen `clear` und keine andere Entfernen-Aktion: das Control kennt nur Hochladen (und bei `TLBinaryField` Herunterladen). |
| Datei über die Drop-Zone | `data-tl-state="dragover"` bis sie verlassen oder abgelegt wird. |

## Tokens

| Teil | Token |
|---|---|
| Hülle `tl-upload` | Abstand `--tl-space-control-gap` |
| Drop-Zone `tl-file-upload` | Abstand `--tl-space-xs`, Ecke `--tl-radius-sm` |
| `dragover` | Linie `--tl-border-width-md`, gestrichelt, Farbe `--tl-border-interactive`, Abstand `--tl-focus-offset`; kein Fokusring |
| Status | Text `--tl-text-secondary`; als `role="alert"` `--tl-status-error-text` |

## Attribute

| Attribut | Wann |
|---|---|
| `aria-busy="true"` | am `tl-button`, solange hochgeladen wird; der Knopf ist dabei `disabled`. |
| `data-tl-state="dragover"` | an `tl-file-upload`, solange eine Datei darüber gezogen wird. |
| `disabled` | am `tl-button`: `TLUploadButton` mit `disabled` oder während des Hochladens. |
| `role="alert"` | an `tl-file-upload__status`, wenn `error` gesetzt ist. |
| `:focus-visible` | den Ring liefert `base.css`; `dragover` ist kein Fokusring. |

Klassen:

| Klasse | Element |
|---|---|
| `tl-upload` | Hülle um den Knopf von `TLUploadButton` und das verborgene `input` |
| `tl-file-upload` | Wurzel und Drop-Zone von `TLFileUpload` und `TLBinaryField` |
| `tl-file-upload__status` | Status- oder Fehlertext neben dem Knopf |

## Konformität

Eine Komponente besteht den Vertrag, wenn sie im Specimen-Harness des Pakets `aria-busy="true"` am Knopf
während des Hochladens, `data-tl-state="dragover"` an der Drop-Zone beim Darüberziehen und `role="alert"`
am Fehlertext trägt und im Klassen-Gate keine Klasse ohne `tl-`-Präfix hinterlässt. Der Test dazu folgt
mit der ersten Kundenkomponente; bis dahin gilt dieser Text.
