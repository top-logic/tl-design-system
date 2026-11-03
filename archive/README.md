# Archiv

`plan-v1-veraltet.md` wurde gegen `CWS/CWS_29108_ui_flexibility` geschrieben — 399 Commits hinter
`master`. Seine Token-Architektur, Dark-Mode-Strategie und CSS-Enforcement-Planung sind hinfällig,
weil `master` das bereits anders löst. Siehe `findings/AP-korrektur-master.md`.

Was daraus gültig bleibt, ist in `plan.md` übernommen.

`plan-v2-vor-overhaul.md` reparierte die vorhandene Palette. Abgelöst durch den Style Overhaul,
siehe `docs/superpowers/specs/2026-09-15-style-overhaul-design.md`.

## `design-system/` (bis 03.11.2026)

Das Paket lag bis zum Umzug in tl-engine-7 (#30098, !2101, gemergt 02.11.2026) unter `design-system/` in diesem
Repo. Es ist hier gelöscht, nicht archiviert, damit niemand den alten Stand ändert. Der letzte Stand ist Commit
`c22bcf6` (Branch `CWS/CWS_30102_ui_durchgang_2`); `main` trug bis dahin `e4fe7d7`. Ansehen mit
`git show c22bcf6:design-system/<pfad>`. Weitergeführt wird das Paket im Engine-Modul `tl-design-system/`.
