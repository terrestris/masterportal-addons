import getters from "./gettersImporterAddon.js";
import mutations from "./mutationsImporterAddon.js";
import actions from "./actionsImporterAddon.js";
import state from "./stateImporterAddon.js";

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
