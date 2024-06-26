<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersImporterAddon";
import mutations from "../store/mutationsImporterAddon";
import ColorUtil from "../utils/color";

export default {
    name: "StyleLayers",
    props: {
        layers: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters("Tools/ImporterAddon", Object.keys(getters))
    },
    created () {
        this.layers.forEach(layer => {
            layer.importedStyle = {
                "rules": [
                    {
                        "style": {
                            "type": "circle",
                            "circleFillColor": this.styleFillColor,
                            "circleStrokeColor": this.styleStrokeColor,
                            "circleStrokeWidth": this.styleStrokeWidth,
                            "circleRadius": this.styleCircleRadius,
                            "lineStrokeColor": this.styleStrokeColor,
                            "lineStrokewidth": this.styleStrokeWidth,
                            "polygonFillColor": this.styleFillColor,
                            "polygonStrokeColor": this.styleStrokeColor,
                            "polygonStrokeWidth": this.styleStrokeWidth
                        }
                    }
                ]
            };
        });
    },
    mounted () {
        this.focusOnHiddenInput();
    },
    methods: {
        ...mapActions("Tools/ImporterAddon", [
        ]),
        ...mapMutations("Tools/ImporterAddon", Object.keys(mutations)),
        rgbToHex (color) {
            return ColorUtil.rgbToHex(color[0], color[1], color[2]);
        },
        updateStyle (evt, layer, type) {
            let value = evt.target.value;

            if (value.indexOf("#") > -1) {
                const rgbArray = ColorUtil.hexToRgb(value);

                // add alpha channel
                rgbArray.push(1);
                value = rgbArray;
            }

            const style = layer.importedStyle.rules[0].style;

            if (type === "fillColor") {
                style.circleFillColor = value;
                style.polygonFillColor = value;
            }
            else if (type === "strokeColor") {
                style.circleStrokeColor = value;
                style.lineStrokeColor = value;
                style.polygonStrokeColor = value;
            }
            else if (type === "strokeWidth") {
                style.circleStrokeWidth = parseInt(value, 10);
                style.lineStrokewidth = parseInt(value, 10);
                style.polygonStrokeWidth = parseInt(value, 10);
            }
        },

        /**
         * Focus on the hidden input field.
         *
         * @returns {void}
         */
        focusOnHiddenInput () {
            this.$nextTick(() => {
                const hiddenInputRef = "importer-addon-hidden-input",
                    hiddenInput = this.$refs[hiddenInputRef];

                if (hiddenInput) {
                    hiddenInput.focus();
                }
            });
        }
    }
};
</script>

<template lang="html">
    <div class="importer-addon-style-layers">
        <div class="form-group">
            <div
                v-for="layer in layers"
                :key="layer.name"
                class="style-form"
            >
                <p>
                    <b>{{ $t("additional:modules.tools.importerAddon.setStyleMessage") }} {{ layer.name }}</b>
                </p>
                <div
                    class="style-selector fill-color"
                >
                    <label for="importer-addon-color">
                        {{ $t("additional:modules.tools.importerAddon.styleSelectFillColor") }}
                    </label>
                    <input
                        id="importer-addon-color"
                        type="color"
                        :value="rgbToHex(styleFillColor)"
                        @change="(evt) => updateStyle(evt, layer, 'fillColor')"
                    >
                </div>
                <div
                    class="style-selector stroke-color"
                >
                    <label for="importer-addon-stroke-color">
                        {{ $t("additional:modules.tools.importerAddon.styleSelectStrokeColor") }}
                    </label>
                    <input
                        id="importer-addon-stroke-color"
                        type="color"
                        :value="rgbToHex(styleStrokeColor)"
                        @change="(evt) => updateStyle(evt, layer, 'strokeColor')"
                    >
                </div>
                <div
                    class="style-selector stroke-width"
                >
                    <label for="importer-addon-stroke-width">
                        {{ $t("additional:modules.tools.importerAddon.styleSelectStrokeWidth") }}
                    </label>
                    <input
                        id="importer-addon-stroke-width"
                        type="number"
                        name="color_selection"
                        :value="styleStrokeWidth"
                        @change="(evt) => updateStyle(evt, layer, 'strokeWidth')"
                    >
                </div>
            </div>
            <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
            <input
                ref="importer-addon-hidden-input"
                type="text"
                class="hidden-text-input"
            >
        </div>
    </div>
</template>

<style lang="scss" scoped>
  .style-form {
      border: 1px solid gray;
      padding: 10px;

      label, input {
          flex: 1;
      }
  }
  .style-selector {
      display: flex;
  }
  .hidden-text-input {
    width: 0;
    height: 0;
    opacity: 0;
    position: fixed;
    top: -10000px;
    left: -10000px;
  }
</style>
