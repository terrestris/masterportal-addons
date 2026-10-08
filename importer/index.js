import ImporterAddonComponent from "./components/ImporterAddon.vue";
import ImporterAddonStore from "./store/ImporterAddon.js";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: ImporterAddonComponent,
    store: ImporterAddonStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
