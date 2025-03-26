import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";
import TourGuideStore from "./store/index.js";

export default {
    store: TourGuideStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
