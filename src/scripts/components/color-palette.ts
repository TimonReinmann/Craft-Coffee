export const init = (rootEl: HTMLElement) => {
  rootEl.querySelectorAll('.color-palette__elem ').forEach((elem) => {
    const after = window.getComputedStyle(elem as Element, '::after').content;

    (elem as HTMLElement).style.setProperty('--color-value', after);

    elem.addEventListener('click', (e) => {
      if (e.target) {
        navigator.clipboard.writeText(after.replaceAll('"', ''));
      }
    });
  });

  rootEl.querySelectorAll('h2').forEach((header) => {
    header.addEventListener('click', (e) => {
      if (e.target) {
        const allColorElements = (header.parentElement as HTMLElement).querySelectorAll('.color-palette__elem ');
        let stringCopyToClipboard = '{ \n';
        allColorElements.forEach((elem) => {
          const after = window.getComputedStyle(elem as Element, '::after').content;
          if (elem.textContent) {
            stringCopyToClipboard += ` ${parseInt(elem.textContent, 10)}: '${after.replaceAll('"', '')}', \n`;
          }
        });
        stringCopyToClipboard += '}';
        navigator.clipboard.writeText(stringCopyToClipboard);
      }
    });
  });
};
