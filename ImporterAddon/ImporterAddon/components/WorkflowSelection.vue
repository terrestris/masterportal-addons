<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "WorkflowSelection",
    props: {
        workflows: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters("Tools/ImporterAddon", ["selectedWorkflow"]),
        workflowRadioValue: {
            get () {
                return this.selectedWorkflow;
            },
            set (value) {
                this.setSelectedWorkflow(value);
            }
        }
    },
    created () {
        const isValid = this.isFormValid();

        this.setCurrentFormValid(isValid);
    },
    methods: {
        ...mapMutations("Tools/ImporterAddon", [
            "setSelectedWorkflow",
            "setCurrentFormValid"
        ]),

        /**
         * Check if the form is valid.
         *
         * @returns {Boolean} True, if form is valid. False otherwise.
         */
        isFormValid () {
            const workflowSelected = this.selectedWorkflow !== undefined && this.selectedWorkflow.length > 0;

            return workflowSelected;
        }
    }
};
</script>

<template lang="html">
    <div class="importer-addon-workflow-selection">
        <form>
            <div class="form-group">
                <div
                    v-for="workflow in workflows"
                    :key="workflow"
                >
                    <input
                        :id="'importer-addon-workflow-radio-' + workflow"
                        v-model="workflowRadioValue"
                        type="radio"
                        name="workflow_selection"
                        :value="workflow"
                    >
                    <label :for="'importer-addon-workflow-radio-' + workflow">
                        {{ $t("additional:modules.tools.importerAddon.workflows." + workflow) }}
                    </label>
                </div>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>

</style>
