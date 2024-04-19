import InitAddon from "./components/InitAddon.vue";
import store from "./store/index";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: InitAddon,
    store,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
