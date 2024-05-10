export const init = (rootEl: HTMLElement) => {
  const randomHexColor = Math.floor(Math.random() * 16777215).toString(16);
  rootEl.style.backgroundColor = `rgba(${hexToRgb(randomHexColor)}, 0.2)`;
  rootEl.addEventListener('change', (e) => {
    e.stopPropagation();
    setDimensions(rootEl);
  });
  setDimensions(rootEl);
  window.addEventListener('resize', () => {
    setDimensions(rootEl);
  }, {passive: true});
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

const setDimensions = (rootEl: HTMLElement) => {
  const width = Math.floor(rootEl.getClientRects()[0].width);
  const height = Math.floor(rootEl.getClientRects()[0].height);

  const dimensionsEl = rootEl.querySelector<HTMLDivElement>('.grid-example__dimensions');
  if (dimensionsEl)
    dimensionsEl.innerHTML = `<strong>${width}</strong><small>px</small> <strong>|</strong> <strong>${height}</strong><small>px</small>`;
}
