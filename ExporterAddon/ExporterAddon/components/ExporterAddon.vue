<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

import ExternalWfsLayerSelection from "./ExternalWfsLayerSelection.vue";
import LayerDownloadOptions from "./LayerDownloadOptions.vue";
import LayerSelection from "./LayerSelection.vue";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";

import getters from "../store/gettersExporterAddon";
import mutations from "../store/mutationsExporterAddon";

import {downloadLayer} from "../utils/download";

import STEPS from "../constants/steps";

export default {
    name: "ExporterAddon",
    components: {
        ExternalWfsLayerSelection,
        LayerDownloadOptions,
        LayerSelection,
        ToolTemplate
    },
    data () {
        return {
            isLoading: false
        };
    },
    computed: {
        ...mapGetters("Tools/ExporterAddon", Object.keys(getters)),

        steps () {
            return STEPS;
        }
    },
    created () {
        this.$on("close", this.close);
    },
    mounted () {
        this.applyTranslationKey(this.name);
    },
    methods: {
        ...mapActions("Tools/ExporterAddon", [
        ]),
        ...mapMutations("Tools/ExporterAddon", Object.keys(mutations)),

        /**
         * Handler for closing the tool.
         *
         * @returns {void}
         */
        close () {
            this.resetExporterAddon();
            this.setActive(false);

            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.$store.state.Tools.ExporterAddon.id});

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
            this.resetStep({stepName: this.currentStep});
            this.setCurrentStep(this.prevStep);
        },

        /**
         * Handler for clicking on the next button.
         *
         * @returns {void}
         */
        onNextClick () {
            this.setCurrentStep(this.nextStep);
        },

        /**
         * Handler for clicking on the finish button.
         *
         * @returns {void}
         */
        async onFinishClick () {
            this.isLoading = true;
            try {
                await downloadLayer(this.selectedLayer, this.selectedBoundary, this.selectedExportFormat);
            }
            catch (e) {
                let msg = i18next.t("additional:modules.tools.exporterAddon.downloadFailedForFormat");

                if (e.sender === "shapeUnsupportedMultiPolygon") {
                    msg = i18next.t("additional:modules.tools.exporterAddon.shapeUnsupportedMultiPolygon");
                }
                this.$store.dispatch("Alerting/addSingleAlert", {
                    content: msg
                }, {root: true});
            }
            finally {
                this.isLoading = false;
            }

            if (this.onExportFinished) {
                this.onExportFinished();
                this.setOnExportFinished(undefined);
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
                id="exporter-addon"
            >
                <div v-if="isLoading">
                    {{ $t("additional:modules.tools.exporterAddon.loadingText") }}
                </div>
                <div v-if="!isLoading">
                    <div class="exporter-addon-wizard-content">
                        <LayerSelection
                            v-if="currentStep === steps.selectLayer"
                        />
                        <ExternalWfsLayerSelection
                            v-if="currentStep === steps.selectExternalWfsLayer"
                        />
                        <LayerDownloadOptions
                            v-if="currentStep === steps.downloadLayer"
                        />
                    </div>
                    <div class="exporter-addon-wizard-navigation">
                        <button
                            v-if="!isFirstStep"
                            type="button"
                            class="btn btn-default"
                            @click="onPrevClick"
                        >
                            {{ $t("additional:modules.tools.exporterAddon.prev") }}
                        </button>
                        <button
                            v-if="!isLastStep"
                            type="button"
                            class="btn btn-default"
                            :disabled="!currentFormValid"
                            @click="onNextClick"
                        >
                            {{ $t("additional:modules.tools.exporterAddon.next") }}
                        </button>
                        <button
                            v-if="isLastStep"
                            type="button"
                            class="btn btn-default"
                            :disabled="!currentFormValid"
                            @click="onFinishClick"
                        >
                            {{ $t("additional:modules.tools.exporterAddon.finish") }}
                        </button>
                    </div>
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
