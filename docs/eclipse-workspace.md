# Eclipse-Workspace für einen Worktree anlegen

Zweck: die React-Demo aus einem Worktree starten, **ohne** vorher einen Maven-Vollbuild zu fahren.
Eclipse löst die Abhängigkeiten der 125 Module gegeneinander im Workspace auf (m2e-Workspace-
Resolution); das lokale Maven-Repository braucht dann nur noch die externen Bibliotheken, und die
liegen im globalen `~/.m2/repository` bereits vollständig.

Eclipse: `/Applications/java-2024-06/Eclipse.app`, Version 4.40 (2026-06).

---

## 1. Laufende Maven-App stoppen

Sonst kollidieren Port 8080 und der H2-Dateilock:

```bash
curl -s http://localhost:8080/admin/stop
```

## 2. Workspace-Ordner anlegen — **außerhalb** des Worktrees

`.metadata` steht nicht in der `.gitignore` von `tl-engine-7`. Ein Workspace im Worktree
verschmutzt also `git status`. Sonst ist der Ort frei — hier liegt er im Design-System-Repo,
wo `eclipse-ws/` in der `.gitignore` steht:

```bash
mkdir -p ~/Claude/TopLogic-v8-DesignSystem/eclipse-ws/tl8-wt-29579
```

Ein Workspace pro Worktree. Die Eclipse-Einstellungen (u. a. Maven) sind workspace-lokal — genau
deshalb bleiben parallele Worktrees sauber getrennt.

## 3. Eclipse mit diesem Workspace starten

```bash
/Applications/java-2024-06/Eclipse.app/Contents/MacOS/eclipse \
  -data ~/Claude/TopLogic-v8-DesignSystem/eclipse-ws/tl8-wt-29579
```

Alternativ über den Workspace-Dialog beim normalen Start.

## 4. Projekte importieren

`File ▸ Import… ▸ Maven ▸ Existing Maven Projects`

* **Root Directory:** `/Users/hendrik/git/tl8-wt-29579`
* Alle Module auswählen (125 Stück), `Finish`.

`.project` und `.classpath` sind für jedes Modul in git eingecheckt — Eclipse übernimmt sie
unverändert, es wird nichts kopiert.

## 5. Workspace-Build abwarten

Der erste Durchlauf dauert. Danach gilt: **„Resolve dependencies from Workspace projects"** muss
aktiv sein (m2e-Standard). Ist es das, wird kein einziges Modul aus dem Maven-Repository geholt.

## 6. Starten

Die Startkonfiguration liegt im Repo:

```
com.top_logic.demo.react/bin/launch/Start React Demo.launch
```

Sie erscheint nach dem Import unter `Run ▸ Run Configurations… ▸ Java Application`. Inhalt:

| | |
|---|---|
| Main-Klasse | `com.top_logic.ide.jetty.Bootstrap` |
| Programmargumente | `-port 8080 -contextPath /react-demo` |
| VM-Argumente | `-Declipse.workspace="${workspace_loc}"`, `-Dtl_initial_password=root1234`, `-Xmx512M`, `-ea` |

`-Declipse.workspace` ist der Grund, warum der Workspace alle Module enthalten muss: die Anwendung
liest die Webapp-Ressourcen der Module direkt von dort.

## 7. Aufrufen

**http://localhost:8080/react-demo/** — Login `root` / `root1234`.

Achtung: über Maven gestartet lautet der Kontextpfad `/tl-demo-react` (der Artifact-Name), über
die Eclipse-Startkonfiguration `/react-demo`.

---

## Zur Datenbank

`com.top_logic.demo.react/tmp/h2.mv.db`, pro Worktree eigen, wird beim ersten Start selbst
angelegt und steht in der `.gitignore` (`/tmp`). Ein Demosystem, keine echte Anwendung — die
Datei darf jederzeit gelöscht werden, der nächste Start baut sie neu.

## Wenn die Oberfläche ohne Stile oder ohne Funktion lädt

Die JS-Bundles (`tl-react-bridge.js`, `tl-react-controls.js`) entstehen über
`frontend-maven-plugin` während `mvn compile` und sind Build-Produkte, die nicht in git stehen.
Ob m2e den Plugin-Lauf ausführt, ist **nicht verifiziert**. Falls die Bundles fehlen, einmalig:

```bash
cd /Users/hendrik/git/tl8-wt-29579 && mvn compile -pl com.top_logic.layout.react
```

## Parallelbetrieb

Zwei Worktrees gleichzeitig: in der kopierten Startkonfiguration `-port` ändern (8081, 8082 …).
Die H2-Dateien liegen ohnehin je Worktree getrennt.
