#!/bin/sh
# Gate vor jedem Push im tl-engine-7-Worktree: messages_en.properties wird vom Build aus dem
# JavaDoc erzeugt. Weicht die eingecheckte Datei ab, scheitert Jenkins mit
# "Files have been changed during build". Dieses Skript erzeugt sie fuer jedes Modul mit
# geaenderten Java-Dateien neu und schlaegt fehl, wenn danach ein Diff bleibt.
#
# Aufruf: design-system/tools/check-messages-en.sh [basis-ref]   (Standard: origin/master)
set -eu
WT="${TL_WORKTREE:-$HOME/git/tl8-wt-29584}"
BASE="${1:-origin/master}"
JH="${JAVA_HOME_21:-$(ls -d /opt/homebrew/Cellar/openjdk@21/*/libexec/openjdk.jdk/Contents/Home 2>/dev/null | tail -1)}"
[ -n "$JH" ] || { echo "JDK 21 nicht gefunden (JAVA_HOME_21 setzen)"; exit 2; }
cd "$WT"
if ! git diff --quiet -- '*/META-INF/messages_en.properties'; then
  echo "messages_en.properties hat ungespeicherte Aenderungen; erst committen oder verwerfen."; exit 2
fi
MODULES=$(git diff --name-only "$(git merge-base HEAD "$BASE")" HEAD -- '*.java' | cut -d/ -f1 | sort -u)
[ -n "$MODULES" ] || { echo "Keine Java-Aenderungen gegen $BASE."; exit 0; }
for M in $MODULES; do
  [ -f "$M/pom.xml" ] || continue
  echo "erzeuge messages_en fuer $M"
  JAVA_HOME="$JH" mvn -o -q prepare-package -Dmaven.test.skip=true -Dtl.javadoc.skipTranslate=true -pl "$M" >/dev/null 2>&1 \
    || { echo "mvn in $M fehlgeschlagen; ohne -q wiederholen."; exit 2; }
done
if git diff --quiet -- '*/META-INF/messages_en.properties'; then
  echo "messages_en.properties stimmt mit dem JavaDoc ueberein."
else
  echo "messages_en.properties weicht vom JavaDoc ab -- Jenkins wuerde scheitern. Diff committen:"
  git diff --stat -- '*/META-INF/messages_en.properties'
  exit 1
fi
