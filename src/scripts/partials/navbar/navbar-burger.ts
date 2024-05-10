import { toggleNavbarOpen } from './navbar';

export const init = (rootEl: HTMLElement) => {
  rootEl.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNavbarOpen();
  });
};
