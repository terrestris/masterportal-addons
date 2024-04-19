import {generateSimpleGetters} from "../../../../src_3_0_0/shared/js/utils/generators";
import initAddonState from "./state";

export default {
    ...generateSimpleGetters(initAddonState)
};
