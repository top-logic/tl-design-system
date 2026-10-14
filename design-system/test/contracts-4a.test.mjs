// Die Verträge der Welle 4a nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'dialog/dialog.contract.md': ['tl-dialog', 'tl-dialog__surface', 'role="dialog"', 'aria-modal="true"', 'aria-labelledby',
    'tl-titlebar__title', 'data-tl-state~="entering"', 'data-tl-state~="maximized"', 'tl-dialog__resize', 'data-tl-edge',
    '--tl-surface-scrim', '--tl-layer-overlay', '--tl-shadow-dialog', 'close', 'resize', 'resetSize'],
  'drawer/drawer.contract.md': ['tl-drawer', 'tl-drawer--start', 'tl-drawer--container', 'data-tl-state~="open"', 'inert',
    'role="dialog"', 'aria-modal="true"', '--tl-size-drawer-medium', '--tl-layer-raised', 'close'],
  'snackbar/snackbar.contract.md': ['tl-snackbar', 'tl-alert', 'data-tl-role', 'role="alert"', 'role="status"',
    'data-tl-state~="exiting"', '--tl-layer-toast', '--tl-shadow-drag', 'dismiss', 'generation'],
  'notice-bar/notice-bar.contract.md': ['tl-notice-bar', 'tl-alert', 'data-tl-role', 'role="button"', 'role="alert"',
    'tl-notice-bar__countdown', 'aria-live="off"', 'tl-nums', 'action', 'deadlinePassed'],
  'overlay/overlay.contract.md': ['tl-overlay', 'tl-overlay__base', 'tl-overlay__layer'],
  'titlebar/titlebar.contract.md': ['tl-titlebar', 'tl-titlebar__title', 'tl-titlebar__actions', '--tl-size-bar'],
  'alert/alert.contract.md': ['tl-snackbar', 'tl-notice-bar'],
  'button/button.contract.md': ['tl-titlebar', '--tl-size-control-sm'],
};
for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of ['dialog', 'drawer', 'snackbar', 'notice-bar', 'overlay'])
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));
