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

import isMobile from "../../../src/utils/isMobile";

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
        ...mapActions("Alerting", {addSingleAlert: "addSingleAlert"}),
        ...mapActions("Tools", ["setToolActive"]),

        /**
         * Handler for closing the tool.
         *
         * @returns {void}
         */
        close () {
            this.resetImporterAddon();
            this.setToolActive({id: "ImporterAddon", active: false});
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
            if (isMobile) {
                this.addSingleAlert(i18next.t("additional:modules.tools.importerAddon.completeMessage", {count: this.selectedLayers.length}));
            }
            applyStyles(this.selectedLayers);
            this.close();
            if (this.onImportFinished) {
                this.onImportFinished();
                this.setOnImportFinished(undefined);
            }
        },

        onFormSubmit (evt) {
            evt.preventDefault();
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
                <form @submit="onFormSubmit">
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
                                :fileupload-icon="fileUploadIcon"
                                :removefile-icon="removeFileIcon"
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
                            ref="importer-addon-next-btn"
                            type="submit"
                            :class="{btn: true, 'btn-default': !currentFormValid, 'btn-primary': currentFormValid}"
                            :disabled="!currentFormValid"
                            @click="onNextClick"
                        >
                            {{ $t("additional:modules.tools.importerAddon.next") }}
                        </button>
                        <button
                            v-if="isLastStep"
                            ref="importer-addon-finish-btn"
                            type="submit"
                            :class="{btn: true, 'btn-default': !currentFormValid, 'btn-primary': currentFormValid}"
                            :disabled="!currentFormValid"
                            @click="onFinishClick"
                        >
                            {{ $t("additional:modules.tools.importerAddon.finish") }}
                        </button>
                    </div>
                </form>
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
