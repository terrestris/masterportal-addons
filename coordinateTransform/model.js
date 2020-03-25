import Tool from "../../modules/core/modelList/tool/model";

const CoordinateTransformModel = Tool.extend({
    defaults: {
        currentLng: "",
        i18nChooseCrsByTyping: "",
        i18nChooseCrsBySelecting: "",
        i18nDescription: "",
        i18nCrsSource: "",
        i18nCrsTarget: "",
        i18nCrsPlaceHolder: "",
        i18nCoordinateInputPlaceHolder: "",
        i18nResult: "",
        isActive: false,
        renderToWindow: true,
        sourceCrs: null,
        sourceCrsValid: false,
        targetCrs: null,
        targetCrsValid: false,
        sourceCoordinates: "",
        sourceCoordinatesValid: false,
        targetCoordinates: "",
        loading: false,
        id: "coordinateTransform",
        name: "Coordinate Transform",
        glyphicon: "glyphicon-record",
        availableSourceCrs: [],
        availableTargetCrs: []
    },

    /**
     * @class CoordinateTransformModel
     * @extends Tool
     * @memberof Addons.CoordinateTransform
     * @property {Boolean} isActive=false Flag if tool is initally active
     * @property {Boolean} renderToWindow=true Render tool to window
     * @property {String} sourceCrs=null The source CRS-Code, e.g. 4326
     * @property {Boolean} sourceCrsValid=false Flag if source CRS selection is valid
     * @property {String} targetCrs=null The target CRS-Code, e.g. 4326
     * @property {Boolean} targetCrsValid=false Flag if target CRS selection is valid
     * @property {String} sourceCoordinates="" String containing the coordinates to transform
     * @property {Boolean} sourceCoordinatesValid=false Flag if source coordinates are valid
     * @property {String} targetCoordinates="" String containing the transformed coordinates
     * @property {Boolean} loading=false Flag if tool is loading data in order to show a loadmask
     * @property {String} id="coordinateTransform" The model id
     * @property {String} name="Coordinate Transform" The model name
     * @property {String} glyphicon="glyphicon-record" The models glyphicon
     * @listens i18next#RadioTriggerLanguageChanged
     */
    initialize: function () {
        this.superInitialize();
        this.listenTo(this, {
            "change:sourceCrs": this.transform,
            "change:targetCrs": this.transform,
            "change:sourceCoordinates": _.debounce(this.transform, 500)
        });

        if (Config.coordinateTransformSourceCrs) {
            this.set("availableSourceCrs", Config.coordinateTransformSourceCrs);
            this.set("sourceCrs", Config.coordinateTransformSourceCrs[0]);
        }
        if (Config.coordinateTransformTargetCrs) {
            this.set("availableTargetCrs", Config.coordinateTransformTargetCrs);
            this.set("targetCrs", Config.coordinateTransformTargetCrs[0]);
        }
        this.listenTo(Radio.channel("i18next"), {
            "languageChanged": this.changeLang
        });
        this.changeLang(i18next.language);
    },

    /**
     * Fetch the available CRS from epsg.io by the given user query string
     *
     * @param {Object} request The request containing the user input
     * @param {Function} callback The callback function to invoke
     * @returns {void}
     */
    fetchCrsInfo: function (request, callback) {
        const url = "https://epsg.io/?q=" +
            request.term +
            "&format=json";

        fetch(url)
            .then(res => res.json())
            .then(json => callback(this.formatResponse(json)))
            .catch(err => callback(["Fehler bei der Abfrage: " + err]));
    },

    /**
     * Creates an response object that fits the jquery autocomplete feature
     *
     * @param {Object} json The JSON result
     * @returns {Object} The final object
     */
    formatResponse: function (json) {
        return json.results.map(el => {
            return {
                label: "EPSG:" + el.code + ", " + el.name,
                value: el.code
            };
        });
    },

    /**
     * Starts the coordinate transformation after the inputs have been validated.
     * Transformation is done through API call against epsg.io.
     * A loadmask will be shown while the request is pending.
     *
     * @returns {void}
     */
    transform: function () {
        if (!this.isValid()) {
            return;
        }

        let coords = this.get("sourceCoordinates");

        if (coords.endsWith(";")) {
            coords = coords.substring(0, coords.length - 1);
        }
        const sourceCrs = this.get("sourceCrs"),
            targetCrs = this.get("targetCrs"),
            url = "https://epsg.io/trans?data=" + coords +
            "&s_srs=" + sourceCrs + "&t_srs=" + targetCrs;

        this.set("targetCoordinates", "");
        this.set("loading", true);

        fetch(url)
            .then(res => res.json())
            .then((result) => {
                const resultCoords = [];

                result.forEach((entry) => {
                    resultCoords.push(entry.x + ", " + entry.y);
                });
                this.set("targetCoordinates", resultCoords.join("\n"));
            })
            .catch(() => {
                this.set("sourceCoordinatesValid", false);
                this.set("targetCoordinates", "");
            })
            .finally(() => this.set("loading", false));

    },

    /**
     * Check if the given inputs are valid, so that transformation can happen.
     * Source and target CRS have to be selected and the target coordinates
     * need to be given in the specified format (separated by comma, coordinate
     * pairs split by semicolon).
     *
     * @returns {Boolean} True if the inputs are valid, false if not
     */
    isValid: function () {
        const coords = this.get("sourceCoordinates"),
            sourceCrs = this.get("sourceCrs"),
            targetCrs = this.get("targetCrs"),
            // eslint-disable-next-line no-unneeded-ternary
            sourceCrsValid = sourceCrs && sourceCrs.length > 0 ? true : false,
            // eslint-disable-next-line no-unneeded-ternary
            targetCrsValid = targetCrs && targetCrs.length > 0 ? true : false,
            lastPair = coords && coords.split && coords.split(";")[
                coords.endsWith(";") ?
                    coords.split(";").length - 2 :
                    coords.split(";").length - 1
            ],
            sourceCoordinatesValid = coords && coords.length > 2 &&
                lastPair.split(",").length > 1 &&
                coords.split(",")[coords.split(",").length - 1].trim() !== "" &&
                // eslint-disable-next-line no-unneeded-ternary
                !lastPair.endsWith(",") ? true : false;

        this.set("sourceCrsValid", sourceCrsValid);
        this.set("targetCrsValid", targetCrsValid);
        this.set("sourceCoordinatesValid", sourceCoordinatesValid);

        return sourceCrsValid && targetCrsValid && sourceCoordinatesValid;
    },

    /**
     * change language - sets default values for the language
     * @param {String} lng the language changed to
     * @returns {Void}  -
     */
    changeLang: function (lng) {
        this.set({
            currentLng: lng,
            i18nChooseCrsByTyping: i18next.t("additional:modules.tools.coordinateTransform.i18nChooseCrsByTyping"),
            i18nChooseCrsBySelecting: i18next.t("additional:modules.tools.coordinateTransform.i18nChooseCrsBySelecting"),
            i18nDescription: i18next.t("additional:modules.tools.coordinateTransform.i18nDescription"),
            i18nCrsSource: i18next.t("additional:modules.tools.coordinateTransform.i18nCrsSource"),
            i18nCrsTarget: i18next.t("additional:modules.tools.coordinateTransform.i18nCrsTarget"),
            i18nCrsPlaceHolder: i18next.t("additional:modules.tools.coordinateTransform.i18nCrsPlaceHolder"),
            i18nCoordinateInputPlaceHolder: i18next.t("additional:modules.tools.coordinateTransform.i18nCoordinateInputPlaceHolder"),
            i18nResult: i18next.t("additional:modules.tools.coordinateTransform.i18nResult")
        });
    }
});

export default CoordinateTransformModel;
