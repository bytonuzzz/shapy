import { useInsertionEffect } from 'react';

const ID = 'shapy-picker';

const CSS = `
.shapy-hive {
  position: relative; overflow: hidden; touch-action: none; cursor: grab; outline: none;
  user-select: none; -webkit-user-select: none;
}
.shapy-hive.is-dragging { cursor: grabbing; }
.shapy-hive:not(.is-dragging) .shapy-cell { cursor: pointer; }
.shapy-cell { position: absolute; left: 0; top: 0; border-radius: 50%; line-height: 0; will-change: translate, transform, opacity; }
.shapy-cell svg { width: 100%; height: 100%; display: block; pointer-events: none; transition: transform 0.18s cubic-bezier(0.3, 1.4, 0.5, 1); }
.shapy-cell.is-focus::after {
  content: ''; position: absolute; inset: calc(-3px - var(--shapy-ring-width, 2.5px)); border-radius: 50%;
  border: var(--shapy-ring-width, 2.5px) solid var(--shapy-ring, var(--shapy-ink, currentColor)); pointer-events: none;
  animation: shapy-ring 0.24s ease-out; transition: opacity 0.24s ease-out, scale 0.24s ease-out;
}
.shapy-hive:focus-visible .shapy-cell.is-focus::after { box-shadow: 0 0 0 4px color-mix(in oklab, var(--shapy-ring, var(--shapy-ink, currentColor)) 28%, transparent); }
.shapy-hive.is-free .shapy-cell.is-focus::after { opacity: 0; scale: 1.1; transition-duration: 0.1s; }
.shapy-hive:not(.is-free):not(.is-moving) .shapy-cell:not(.is-focus):hover svg { transform: scale(1.07); }
.shapy-hive.is-shuffling .shapy-cell { animation: shapy-pop 0.45s cubic-bezier(0.3, 1.4, 0.5, 1) both; animation-delay: var(--shapy-delay, 0ms); }

.shapy-picker {
  --shapy-panel: #1e1d25;
  --shapy-ink: #f2f0f7;
  --shapy-muted: #9c99ab;
  --shapy-tint: var(--shapy-panel);
  --shapy-bg: color-mix(in oklab, var(--shapy-tint) var(--shapy-tint-mix, 12%), var(--shapy-panel));
  --shapy-soft: color-mix(in oklab, var(--shapy-ink) 12%, transparent);
  background: var(--shapy-bg);
  color: var(--shapy-ink);
  border-radius: var(--shapy-radius, 20px);
  padding: var(--shapy-padding, 20px 20px 14px);
  display: grid;
  gap: var(--shapy-gap, 12px);
  min-width: 0;
  font-size: 14px;
  line-height: 1.5;
  transition: background-color 0.5s ease;
  container-type: inline-size;
}
.shapy-picker * { box-sizing: border-box; }
.shapy-picker button { font: inherit; cursor: pointer; }
.shapy-picker h3 { margin: 0; font-size: var(--shapy-title-size, 17px); font-weight: 600; letter-spacing: -0.01em; }
.shapy-picker p { margin: 0; }
.shapy-picker .shapy-head p { color: var(--shapy-muted); margin-top: 2px; }
.shapy-picker .shapy-hive { margin-inline: -8px; }

.shapy-picker .shapy-foot { display: flex; align-items: center; gap: 4px; border-top: 1px solid var(--shapy-soft); padding-top: 12px; }
.shapy-picker .shapy-grow { flex: 1; }
.shapy-picker .shapy-sep { width: 1px; height: 18px; margin: 0 6px; background: var(--shapy-soft); }
.shapy-picker .shapy-ghost { display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 8px; border: 0; border-radius: var(--shapy-button-radius, 8px); background: none; color: var(--shapy-ink); font-weight: 600; }
.shapy-picker .shapy-icon { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: var(--shapy-button-radius, 8px); background: none; color: var(--shapy-muted); transition: color 0.15s, background-color 0.15s, transform 0.1s; }
.shapy-picker .shapy-ghost:hover, .shapy-picker .shapy-icon:hover { background: var(--shapy-soft); color: var(--shapy-ink); }
.shapy-picker .shapy-icon:active, .shapy-picker .shapy-ghost:active { transform: scale(0.94); }
.shapy-picker .shapy-btn { height: 34px; padding: 0 14px; border: 1px solid color-mix(in oklab, var(--shapy-ink) 16%, transparent); border-radius: var(--shapy-button-radius, 10px); background: none; color: var(--shapy-ink); font-weight: 600; }
.shapy-picker .shapy-btn.shapy-reset { border: 0; padding: 0 8px; color: var(--shapy-muted); font-weight: 500; }
.shapy-picker .shapy-btn.shapy-reset:hover { color: var(--shapy-ink); }
.shapy-picker .shapy-foot [data-part='reset']:disabled { display: none; }
.shapy-picker .shapy-primary { border: 0; background: var(--shapy-accent, var(--shapy-ink)); color: var(--shapy-accent-ink, var(--shapy-panel)); margin-left: 4px; }
.shapy-picker button:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--shapy-muted); }

@container (max-width: 420px) {
  .shapy-picker .shapy-ghost { width: 32px; padding: 0; justify-content: center; }
  .shapy-picker .shapy-ghost .shapy-label { display: none; }
  .shapy-picker .shapy-sep { margin: 0 2px; }
}

@keyframes shapy-pop { from { opacity: 0; scale: 0.3; } }
@keyframes shapy-ring { from { opacity: 0; scale: 1.14; } }

@media (prefers-reduced-motion: reduce) {
  .shapy-picker { transition: none; }
  .shapy-cell, .shapy-cell svg, .shapy-cell::after { animation: none !important; transition: none !important; }
}
`;

export function usePickerStyles() {
  useInsertionEffect(() => {
    if (document.getElementById(ID)) {
      return;
    }
    const style = document.createElement('style');
    style.id = ID;
    style.textContent = CSS;
    document.head.prepend(style);
  }, []);
}
