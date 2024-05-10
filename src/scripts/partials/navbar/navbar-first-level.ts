import {
  closeNavbar,
  disableScroll,
  enableScroll,
  isNavbarOpen,
  openNavbar,
} from './navbar';
import { freeFocus, getFirstFocusableElement, trapFocus } from '@craft-components/helper/focus-trap';
import { enableBodyScrollLock, setClassOutlineOnBody } from '@craft-components/helper/general';

let lockOpenNavbar = false;
const ROOT_CLASS = 'navbar-first-level';
const firstLevelLi: HTMLElement[] = [];
const firstLevelBackButtonLi: HTMLElement[] = [];

export const init = (rootEl: HTMLElement) => {
  rootEl.querySelectorAll(`.${ROOT_CLASS}__button`)
    .forEach(button => firstLevelLi.push(button as HTMLElement));

  rootEl.querySelectorAll(`.${ROOT_CLASS}__button-back`)
    .forEach(buttonBack => firstLevelBackButtonLi.push(buttonBack as HTMLElement));

  rootEl.querySelectorAll(`.${ROOT_CLASS}__item`)
    .forEach(item => item.addEventListener('click', (e) => {
      setClassOutlineOnBody();
      e.stopPropagation();
    }));
  firstLevelBackButtonLi.forEach(backButton => {
    backButton.addEventListener('click', () => {
      const area = backButton.closest(`.${ROOT_CLASS}__second-level-area`)
      if (area) {
        area.classList.remove(`${ROOT_CLASS}__second-level-area--open`);
        enableScroll();
      }
    });
  });

  firstLevelLi.forEach(button => {
    button.addEventListener('click', () => {
      if (!isNavbarOpen()) {
        openNavbar();
      }
      openSecondLevel(button);
    });
  });

  document.body.addEventListener('click', () => {
    closeAllSecondLevel();
  });

  document.body.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'escape') {
      closeAllSecondLevel();
    }
  });
}

export const isAnySecondLevelOpen = (): boolean => {
  return firstLevelLi.some(button =>
    button && button.parentElement ?
      button.parentElement.querySelector(`.${ROOT_CLASS}__second-level-area`)
        ?.classList.contains(`${ROOT_CLASS}__second-level-area--open`)
      : false);
};

const getTransitionDuration = (secondLevelContainer: HTMLElement) => {
  return parseInt(getComputedStyle(secondLevelContainer).getPropertyValue('--transition-duration'), 10);
}

const openSecondLevel = (button: HTMLElement) => {
  if (button.parentElement != null) {
    const secondLevelContainer = button.parentElement.querySelector(`.${ROOT_CLASS}__second-level-area`);
    const afterOpenClass = `${ROOT_CLASS}__second-level-area--after-open`;
    const openClass = `${ROOT_CLASS}__second-level-area--open`;
    if (secondLevelContainer && !lockOpenNavbar) {
      const transitionDuration = getTransitionDuration(secondLevelContainer as HTMLElement);
      disableScroll();
      if (secondLevelContainer.classList.contains(openClass)) {
        secondLevelContainer.classList.add(afterOpenClass);
        setTimeout(() => {
          secondLevelContainer.classList.remove(openClass);
        }, 100);
        setTimeout(() => {
          secondLevelContainer.classList.remove(afterOpenClass);
          button.focus();
          freeFocus(secondLevelContainer as HTMLElement);
          enableScroll();
          closeNavbar();
        }, transitionDuration);
      } else {
        if (isAnySecondLevelOpen()) {
          closeAllSecondLevel(() => {
            setTimeout(() => {
              animateOpenSecondLevelArea(secondLevelContainer);
              openNavbar();
            }, transitionDuration);
          });
        } else {
          animateOpenSecondLevelArea(secondLevelContainer);
          openNavbar();
        }
      }
    }
  }
};

const animateOpenSecondLevelArea = (secondLevelContainer: Element) => {
  enableBodyScrollLock();
  const beforeOpenClass = `${ROOT_CLASS}__second-level-area--before-open`;
  const openClass = `${ROOT_CLASS}__second-level-area--open`;
  const transitionDuration = getTransitionDuration(secondLevelContainer as HTMLElement);
  lockOpenNavbar = true;
  secondLevelContainer.classList.add(beforeOpenClass);
  setTimeout(() => {
    secondLevelContainer.classList.add(openClass);
  }, 10);
  setTimeout(() => {
    secondLevelContainer.classList.remove(beforeOpenClass);
    getFirstFocusableElement(secondLevelContainer as HTMLElement).focus();
    trapFocus(secondLevelContainer as HTMLElement);
    lockOpenNavbar = false;
  }, transitionDuration);
};

export const closeAllSecondLevel = (callBack?: () => void) => {
  let wasCalled = false;
  const openClass = `${ROOT_CLASS}__second-level-area--open`;
  const afterOpenClass = `${ROOT_CLASS}__second-level-area--after-open`;
  firstLevelLi.forEach((button: HTMLElement) => {
    if (button.parentElement) {
      const secondLevelContainer = button.parentElement.querySelector(`.${ROOT_CLASS}__second-level-area`) as HTMLElement;
      if (secondLevelContainer) {
        const transitionDuration = getTransitionDuration(secondLevelContainer as HTMLElement);
        if (secondLevelContainer.classList.contains(openClass)) {
          secondLevelContainer.classList.add(afterOpenClass);
          setTimeout(() => {
            secondLevelContainer.classList.remove(openClass);
          }, 50);
          setTimeout(() => {
            secondLevelContainer.classList.remove(afterOpenClass);
            button.focus();
            freeFocus(secondLevelContainer as HTMLElement);
            closeNavbar();
          }, transitionDuration);
          if (callBack) {
            callBack();
            wasCalled = true;
          }
        } else {
          closeNavbar();
          if (callBack) {
            callBack();
            wasCalled = true;
          }
        }
      }
      enableScroll();
    }
  });

  if (callBack && !wasCalled) {
    closeNavbar();
    callBack();
  }
};
