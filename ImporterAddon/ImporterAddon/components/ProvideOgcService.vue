<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersImporterAddon";
import mutations from "../store/mutationsImporterAddon";
import {isValidCapabilitiesUrl} from "../utils/capabilities";

export default {
    name: "ProvideOgcService",
    props: {
        serviceType: {
            type: String,
            required: true,
            validator: value => {
                return [
                    "wms",
                    "wfs"
                ].includes(value);
            }
        }
    },
    data () {
        return {
            inputValid: true
        };
    },
    computed: {
        ...mapGetters("Tools/ImporterAddon", Object.keys(getters)),
        capabilitiesUrlValue: {
            get () {
                return this.capabilitiesUrl;
            },
            set (value) {
                this.setCapabilitiesUrl(value);
            }
        }
    },
    created () {
        const isValid = this.isFormValid();

        this.setCurrentFormValid(isValid);
    },
    methods: {
        ...mapActions("Tools/ImporterAddon", [
        ]),
        ...mapMutations("Tools/ImporterAddon", Object.keys(mutations)),

        /**
         * Handler for the Capabilities URL input events.
         *
         * @param {Object} evt The triggered event.
         * @returns {void}
         */
        onInputChange (evt) {
            const val = evt.target.value,
                isValid = val.length > 0;

            this.inputValid = isValid;
            this.setCurrentFormValid(this.isFormValid());
        },

        /**
         * Check if the form is valid.
         *
         * @returns {Boolean} True, if form is valid. False otherwise.
         */
        isFormValid () {
            return isValidCapabilitiesUrl(this.capabilitiesUrl);
        }
    }
};
</script>

<template lang="html">
    <div class="importer-addon-provide-ogc-service">
        <div v-if="serviceType === 'wms'">
            <span>
                {{ $t("additional:modules.tools.importerAddon.provideWMSText") }}
            </span>
            <span class="example">
                {{ $t("additional:modules.tools.importerAddon.provideOgcServiceExample") }}
                <br>
                {{ wmsExampleBase }}<span class="query">{{ wmsExampleQuery }}</span>
            </span>
        </div>
        <div v-if="serviceType === 'wfs'">
            <span>
                {{ $t("additional:modules.tools.importerAddon.provideWFSText") }}
            </span>
            <span class="example">
                {{ $t("additional:modules.tools.importerAddon.provideOgcServiceExample") }}
                <br>
                {{ wfsExampleBase }}<span class="query">{{ wfsExampleQuery }}</span>
            </span>
        </div>
        <form>
            <div :class="['form-group', {['has-error']: !inputValid}]">
                <input
                    v-model="capabilitiesUrlValue"
                    :class="['form-control', {['has-error']: !inputValid}]"
                    :placeholder="$t('additional:modules.tools.importerAddon.capabilitiesUrlPlaceholder')"
                    aria-describedby="capabilities-url-help-block"
                    @input="onInputChange"
                    @blur="onInputChange"
                >
                <span
                    v-if="!inputValid"
                    id="capabilities-url-help-block"
                    class="help-block"
                >
                    {{ $t("additional:modules.tools.importerAddon.capabilitiesUrlRequiredText") }}
                </span>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.importer-addon-provide-ogc-service {
    .example {
        font-style: italic;

        .query {
            font-weight: bold;
        }
    }
}
</style>
