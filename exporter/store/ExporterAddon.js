import getters from "./gettersExporterAddon.js";
import mutations from "./mutationsExporterAddon.js";
import actions from "./actionsExporterAddon.js";
import state from "./stateExporterAddon.js";

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
