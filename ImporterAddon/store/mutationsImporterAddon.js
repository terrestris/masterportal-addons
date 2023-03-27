import {generateSimpleMutations} from "../../../src/app-store/utils/generators";
import stateImporterAddon from "./stateImporterAddon";
import {getBasicResetValues, getStepResetValues} from "../utils/resetStep";
import {generateId} from "../utils/layer";
import STEPS from "../constants/steps";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateImporterAddon),

    /**
     * If name from config.json starts with "translate#", the corrected key is set to name here.
     * @param {object} state of this component
     * @param {string} payload name of this component
     * @returns {void}
     */
    applyTranslationKey: (state, payload) => {
        if (payload && payload.indexOf("translate#") > -1) {
            state.name = payload.substr("translate#".length);
        }
    },

    /**
     * Reset the state variables of the importerAddon to their initial values.
     *
     * @param {Object} state of this component
     * @returns {void}
     */
    resetImporterAddon: (state) => {
        const basicResetValues = getBasicResetValues(),
            provideOgcServiceResetValues = getStepResetValues(STEPS.provideOgcService),
            selectLayersResetValues = getStepResetValues(STEPS.selectLayers),
            uploadFileResetValues = getStepResetValues(STEPS.uploadFile),
            styleLayersResetValues = getStepResetValues(STEPS.styleLayers),
            resetValues = {
                ...basicResetValues,
                ...provideOgcServiceResetValues,
                ...selectLayersResetValues,
                ...uploadFileResetValues,
                ...styleLayersResetValues
            };

        for (const key in resetValues) {
            state[key] = resetValues[key];
        }
    },

    /**
     * Reset the state of the given step.
     *
     * @param {Object} state of this component
     * @param {Object} payload payload for this mutation.
     * @param {String} payload.stepName The name of the step to reset.
     * @returns {void}
     */
    resetStep: (state, payload) => {
        const stepResetValues = getStepResetValues(payload.stepName);

        for (const key in stepResetValues) {
            state[key] = stepResetValues[key];
        }
    },

    /**
     * Increments the counter used for layer ids by 1.
     *
     * @param {Object} state of this component
     * @returns {void}
     */
    incrementIdCounter: (state) => {
        state.idCounter += 1;
    },

    /**
     * Generates the id for the layer tree folder and sets it to global state.
     *
     * @param {Object} state of this component
     * @returns {void}
     */
    generateLayerTreeFolderId: (state) => {
        state.idCounter += 1;
        const generatedId = generateId(state.idCounter);

        state.layerTreeFolderId = generatedId;
    }
};

export default mutations;
