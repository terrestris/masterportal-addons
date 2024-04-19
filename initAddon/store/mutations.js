import {generateSimpleMutations} from "../../../../src_3_0_0/shared/js/utils/generators";
import initAddonState from "./state";
const mutations = {
    ...generateSimpleMutations(initAddonState)
};

export default mutations;
