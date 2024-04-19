import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import state from "./state";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    actions,
    getters
};
