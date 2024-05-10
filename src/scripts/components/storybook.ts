import { selectTextFromHtmlNode } from '@craft-components/helper/general';

export const init = (rootEl: HTMLElement) => {
  rootEl.addEventListener('click', (e) => {
    if (e.target) {
      const button = e.target as HTMLElement;
      if (button.dataset.selector) {
        selectTextFromHtmlNode(button.dataset.selector);
      }
    }
  });
};
