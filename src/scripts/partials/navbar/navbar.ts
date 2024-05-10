import { closeAllSecondLevel, isAnySecondLevelOpen } from './navbar-first-level';
import {
  disableBodyScrollLock,
  enableBodyScrollLock,
  getScrollbarWidth,
  getScrollTop, setClassOutlineOnBody
} from '@craft-components/helper/general';
import { componentLoader } from '../../helper/component-loader';

const ROOT_CLASS = 'navbar';
const ROOT_CLASS_OPEN = `${ROOT_CLASS}--open`;
const ROOT_CLASS_NO_SCROLL = `${ROOT_CLASS}--no-scroll`;
const rootLi: HTMLElement[] = [];

export const init = (rootEl: HTMLElement) => {
  rootLi.push(rootEl);
  if (getScrollbarWidth() > 0) {
    document.body.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
    document.body.classList.add('has-scrollbar');
  }
  setShrinkIfNeeded();
  updateNavbarHeight(rootEl);
  componentLoader('navbar-burger', 'partials/navbar');
  componentLoader('navbar-first-level', 'partials/navbar');

  document.body.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'escape') {
      if (isAnySecondLevelOpen()) {
        closeAllSecondLevel(() => {
          rootEl.classList.remove(ROOT_CLASS_OPEN);
        });
      }
      rootEl.classList.remove(ROOT_CLASS_OPEN);
      disableBodyScrollLock();
    }
  });

  window.addEventListener('resize', () => {
    updateNavbarHeight(rootEl);
  }, {passive: true});

  document.addEventListener('scroll', () => {
    setShrinkIfNeeded();
  });
}

const updateNavbarHeight = (rootEl: HTMLElement) => {
  const isMobileNavbar = !(document.documentElement.clientWidth > getMobileBreakpoint());
  let currentHeight = isMobileNavbar ? rootEl.querySelector('.navbar__mobile-header')?.clientHeight : rootEl.clientHeight;
  document.documentElement.style.setProperty('--navbar-height', `${currentHeight}px`);
}

export const disableScroll = () => rootLi.forEach(rootEl => rootEl.classList.add(ROOT_CLASS_NO_SCROLL));

export const enableScroll = () => rootLi.forEach(rootEl => rootEl.classList.remove(ROOT_CLASS_NO_SCROLL));

export const isNavbarOpen = () => rootLi.some(rootEl => rootEl.classList.contains(ROOT_CLASS_OPEN));

export const toggleNavbarOpen = () => setNavbarOpenState();

export const setNavbarOpenState = () => {
  const classContext = ROOT_CLASS_OPEN;
  const classOppositeContext = ROOT_CLASS_OPEN;
  rootLi.forEach(rootEl => {
    if (rootEl.classList.contains(classContext)) {
      rootEl.classList.remove(classContext);
      closeAllSecondLevel();
    } else {
      rootEl.classList.remove(classOppositeContext);
      rootEl.classList.add(classContext);
    }

    rootEl.addEventListener('click', (e) => {
      setClassOutlineOnBody();
      e.stopPropagation();
    });

    if (
      rootEl.classList.contains(classContext)
      || rootEl.classList.contains(classOppositeContext)
    ) {
      enableBodyScrollLock();
    } else {
      disableBodyScrollLock();
    }
  });
};

export const openNavbar = () => {
  rootLi.forEach((rootEl) => {
    rootEl.classList.add(ROOT_CLASS_OPEN);
  });
  enableBodyScrollLock();
};

export const closeNavbar = () => {
  rootLi.forEach((rootEl) => {
    rootEl.classList.remove(ROOT_CLASS_OPEN);
  });
  disableBodyScrollLock();
};


const setShrink = () => {
  rootLi.forEach(rootEl => {
    rootEl.classList.add(`${ROOT_CLASS}--shrink`);
  });
};

const removeShrink = () => {
  rootLi.forEach(rootEl => {
    rootEl.classList.remove(`${ROOT_CLASS}--shrink`);
  });
};

const setShrinkIfNeeded = () => {
  const scrollTop = getScrollTop();
  if (scrollTop > 110) {
    setShrink();
  } else {
    removeShrink();
  }
};

export const getTransitionDuration = () => parseInt(getComputedStyle(rootLi[0]).getPropertyValue('--transition-duration'), 10);
export const getMobileBreakpoint = () => parseInt(getComputedStyle(rootLi[0]).getPropertyValue('--mobile-breakpoint'), 10);
