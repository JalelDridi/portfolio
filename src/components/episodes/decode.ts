const NOISE = "█▓▒░/\\_#01";

/**
 * Writes scrambled characters into `el` that settle, left to right, into
 * `text` within `ms`. Returns a cancel function, which leaves `text` in place.
 */
export function decode(el: HTMLElement, text: string, ms = 300): () => void {
  const start = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const settled = Math.min(1, (now - start) / ms) * text.length;
    if (settled >= text.length) {
      el.textContent = text;
      return;
    }
    el.textContent = Array.from(text, (char, index) =>
      index < settled || char === " "
        ? char
        : NOISE[Math.floor(Math.random() * NOISE.length)],
    ).join("");
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    el.textContent = text;
  };
}
