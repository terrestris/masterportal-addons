import introJs from 'intro.js';
import 'intro.js/introjs.css';

import store from "../../../src/app-store";
import isMobile from "../../../src/shared/js/utils/isMobile";

import '../css/introjs.overrides.css';

/**
 * Start a tour by highlighting elements and adding explanations.
 */
export const startTour = () => {
  // ensure that both menus are expanded
  store.commit("Menu/setExpandedBySide", { expanded: true, side: "secondaryMenu" });
  store.commit("Menu/setExpandedBySide", { expanded: true, side: "mainMenu" });

  // read steps from config.js
  let steps = Config?.tourGuide?.steps;
  if (!steps) {
    console.warn("TourGuide: Please add steps to your configuration.");
    return;
  }

  // get current language
  let currentLanguage = i18next.language;

  // set button labels
  const buttonLabels = {
    next: i18next.t("additional:modules.tools.tourGuide.button.next"),
    prev: i18next.t("additional:modules.tools.tourGuide.button.prev"),
    done: i18next.t("additional:modules.tools.tourGuide.button.done"),
  };

  const intro = introJs()
    .setOptions({
      showStepNumbers: true,
      nextLabel: `<button class="btn flat-button btn-secondary">${buttonLabels.next}</button>`,
      prevLabel: `<button class="btn flat-button btn-secondary">${buttonLabels.prev}</button>`,
      doneLabel: `<button class="btn flat-button btn-secondary">${buttonLabels.done}</button>`,
    });

  // parse and add steps
  steps = parseSteps(steps, currentLanguage);
  steps.forEach(step => {
    intro.addStep(step);
  });

  intro.onafterchange(async (targetElement) => {
    if (!targetElement.id) {
      document.querySelector('.introjs-tooltipReferenceLayer')?.classList.add('fix-top');
    } else {
      document.querySelector('.introjs-tooltipReferenceLayer')?.classList.remove('fix-top');
    }
  })

  intro.start();
};

/**
 * Parse steps and add buttons.
 * 
 * @param {Array} steps - The steps to parse.
 * @param {string} language - The current language.
 * @returns {Array} The parsed steps.
 */
const parseSteps = (steps, language) =>
  steps.map((step) => ({
    ...step,
    intro: step.intro[language],
    // do not highlight elements in mobile view
    element: isMobile() ? undefined : step.element,
  }));
