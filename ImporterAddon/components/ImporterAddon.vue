<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

import FileUpload from "./FileUpload.vue";
import LayerSelection from "./LayerSelection.vue";
import ProvideOgcService from "./ProvideOgcService.vue";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import WorkflowSelection from "./WorkflowSelection.vue";
import StyleLayers from "./StyleLayers.vue";

import getters from "../store/gettersImporterAddon";
import mutations from "../store/mutationsImporterAddon";

import {setLayerTreeFolderTitle} from "../utils/layerTreeFolder";

import STEPS from "../constants/steps";
import {addLayersToMap, applyStyles} from "../utils/layer";
import {layerTreeFolderExists, addLayerTreeFolder} from "../utils/layerTreeFolder";

export default {
    name: "ImporterAddon",
    components: {
        FileUpload,
        LayerSelection,
        ProvideOgcService,
        ToolTemplate,
        WorkflowSelection,
        StyleLayers
    },
    computed: {
        ...mapGetters("Tools/ImporterAddon", Object.keys(getters)),

        steps () {
            return STEPS;
        },

        layerTreeFolderTitle () {
            return this.$t("additional:modules.tools.importerAddon.layerTreeFolderTitle");
        }
    },
    watch: {
        layerTreeFolderTitle: function () {
            setLayerTreeFolderTitle(this.layerTreeFolderTitle, this.layerTreeFolderId);
        }
    },
    created () {
        // only generate layerTreeFolderId once
        if (!this.layerTreeFolderId) {
            this.generateLayerTreeFolderId();
        }
        this.$on("close", this.close);
    },
    mounted () {
        this.applyTranslationKey(this.name);
    },
    methods: {
        ...mapActions("Tools/ImporterAddon", [
        ]),
        ...mapMutations("Tools/ImporterAddon", Object.keys(mutations)),

        /**
         * Handler for closing the tool.
         *
         * @returns {void}
         */
        close () {
            this.resetImporterAddon();
            this.setActive(false);

            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.$store.state.Tools.ImporterAddon.id});

            if (model) {
                model.set("isActive", false);
            }
        },

        /**
         * Handler for clicking on the previous button.
         *
         * @returns {void}
         */
        onPrevClick () {
            if (!this.prevWorkflowStep) {
                this.setCurrentWorkflow(undefined);
            }
            this.resetStep({stepName: this.currentStep});
            this.setCurrentStep(this.prevWorkflowStep);
        },

        /**
         * Handler for clicking on the next button.
         *
         * @returns {void}
         */
        onNextClick () {
            if (this.isCurrentWorkflowUndefined) {
                this.setCurrentWorkflow(this.selectedWorkflow);
            }
            this.setCurrentStep(this.nextWorkflowStep);
        },

        /**
         * Handler for clicking on the finish button.
         *
         * @returns {void}
         */
        onFinishClick () {
            if (!layerTreeFolderExists(this.layerTreeFolderId)) {
                addLayerTreeFolder(this.layerTreeFolderTitle, this.layerTreeFolderId);
            }
            addLayersToMap(this.selectedLayers);
            applyStyles(this.selectedLayers);
            if (this.onImportFinished) {
                this.onImportFinished();
                this.setOnImportFinished(undefined);
            }
            this.close();
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active && !withoutGUI"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :initial-width="initialWidth"
        :initial-width-mobile="initialWidthMobile"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="importer-addon"
            >
                <div class="importer-addon-wizard-content">
                    <div
                        v-if="isCurrentWorkflowUndefined"
                    >
                        {{ $t("additional:modules.tools.importerAddon.selectWorkflowText") }}
                        <WorkflowSelection :workflows="supportedImportWorkflows" />
                    </div>
                    <div
                        v-if="!isCurrentWorkflowUndefined"
                    >
                        <ProvideOgcService
                            v-if="currentStep === steps.provideOgcService"
                            :service-type="currentWorkflow"
                        />
                        <LayerSelection
                            v-if="currentStep === steps.selectLayers"
                            :service-type="currentWorkflow"
                            :capabilities-url="capabilitiesUrl"
                        />
                        <FileUpload
                            v-if="currentStep === steps.uploadFile"
                            :service-type="currentWorkflow"
                        />
                        <StyleLayers
                            v-if="currentStep === steps.styleLayers"
                            :layers="selectedLayers"
                        />
                    </div>
                </div>
                <div class="importer-addon-wizard-navigation">
                    <button
                        v-if="!isCurrentWorkflowUndefined"
                        type="button"
                        class="btn btn-default"
                        @click="onPrevClick"
                    >
                        {{ $t("additional:modules.tools.importerAddon.prev") }}
                    </button>
                    <button
                        v-if="!isLastStep"
                        type="button"
                        class="btn btn-default"
                        :disabled="!currentFormValid"
                        @click="onNextClick"
                    >
                        {{ $t("additional:modules.tools.importerAddon.next") }}
                    </button>
                    <button
                        v-if="isLastStep"
                        type="button"
                        class="btn btn-default"
                        :disabled="!currentFormValid"
                        @click="onFinishClick"
                    >
                        {{ $t("additional:modules.tools.importerAddon.finish") }}
                    </button>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss">
  #sidebar {
      // dont let the sidebar go beyond the footer
      height: calc(100% - 30px) !important;
  }
</style>
