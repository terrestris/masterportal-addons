import Tool from "../../modules/core/modelList/tool/model";

const BackgroundSwitcherModel = Tool.extend({
    defaults: {
        currentLng: "",
        i18nTitle: "",
        i18nShowSwitcher: "",
        i18nHideSwitcher: "",
        backgroundLayers: [],
        activeLayer: null,
        open: false,
        previews: []
    },

    type: "tool",
    id: "backgroundSwitcher",
    name: "Background Switcher",
    glyphicon: "glyphicon-example",

    /**
     * @class BackgroundSwitcherModel
     * @extends Tool
     * @property {Array} backgroundLayers=[] Array of background layers
     * @property {Object} activeLayer=null The current active layer object
     * @property {Boolean} open=false Flag if switcher is expanded or collapsed
     * @property {Array} previews=[] Array of layerobjects and corresponding example getMap request URL
     * @listens i18next#RadioTriggerLanguageChanged
     */
    initialize: function () {
        this.superInitialize();
        let bgLayers = Radio.request("Parser", "getItemsByAttributes",
            {isBaseLayer: true}) || [];
        const map = Radio.request("Map", "getMap");

        bgLayers = bgLayers.filter(l => l.isNeverVisibleInTree !== true);

        this.set("backgroundLayers", bgLayers);
        this.set("activeLayer", bgLayers.find(l => l.isVisibleInMap));

        // using openlayers events here as they propagate more accurately
        map.on("moveend", this.updatePreviews.bind(this));
        map.getLayerGroup().on("change", this.updatePreviews.bind(this));

        this.updatePreviews();

        this.listenTo(Radio.channel("i18next"), {
            "languageChanged": this.changeLang
        });
        this.changeLang(i18next.language);
    },

    /**
     * Sets the active layer by the given id. Toggles the visibility
     * in the map and in the tree.
     *
     * @param {String} id The id of the layer to set as active
     * @returns {void}
     */
    setActiveLayerById: function (id) {
        const activeRawLayer = this.get("backgroundLayers").
            find(l => l.id === id);

        this.set("activeLayer", activeRawLayer);
        this.get("backgroundLayers").forEach((bgLayer) => {
            let layer = Radio.request("ModelList", "getModelsByAttributes",
                {id: bgLayer.id});

            if (layer) {
                layer = layer[0];
                if (layer.id === id) {
                    layer.setIsVisibleInMap(true);
                    layer.setIsSelected(true);
                }
                else {
                    layer.setIsVisibleInMap(false);
                    layer.setIsSelected(false);
                }
            }
        });
    },

    /**
     * Updates the preview image URLs of the layers
     *
     * @returns {void}
     */
    updatePreviews: function () {
        const extent = Radio.request("MapView", "getCurrentExtent"),
            proj = Radio.request("MapView", "getProjection").getCode(),
            ratio = (extent[2] - extent[0]) / (extent[3] - extent[1]),
            previews = this.get("backgroundLayers").map((l) => {
                const url = new URL(l.url);

                url.searchParams.append("REQUEST", "GetMap");
                url.searchParams.append("SERVICE", "WMS");
                url.searchParams.append("VERSION", l.version);
                url.searchParams.append("CRS", proj);
                url.searchParams.append("LAYERS", l.layers);
                url.searchParams.append("FORMAT", l.format);
                url.searchParams.append("WIDTH", "256");
                url.searchParams.append("HEIGHT", Math.round(256 / ratio));
                url.searchParams.append("STYLES", "");
                url.searchParams.append("BBOX", extent);
                return {
                    layer: l,
                    img: url.href
                };
            });

        this.set("previews", previews);
    },

    /**
     * change language - sets default values for the language
     * @param {String} lng the language changed to
     * @returns {Void}  -
     */
    changeLang: function (lng) {
        this.set({
            currentLng: lng,
            i18nTitle: i18next.t("additional:backgroundSwitcher.i18nTitle"),
            i18nShowSwitcher: i18next.t("additional:backgroundSwitcher.i18nShowSwitcher"),
            i18nHideSwitcher: i18next.t("additional:backgroundSwitcher.i18nHideSwitcher")
        });
    }
});

export default BackgroundSwitcherModel;
