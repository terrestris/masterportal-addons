import CoordinateTransformTemplate from "text-loader!./template.html";
import CoordinateTransformModel from "./model.js";
import "./style.less";
import "jquery-ui/ui/widgets/autocomplete";
import "jquery-ui/themes/base/autocomplete.css";

const CoordinateTransformView = Backbone.View.extend({
    events: {
        "keyup .coordinate-input > textarea": "updateCoordinates"
    },

    /**
     * The initialize method
     *
     * @class CoordinateTransformView
     * @extends Backbone.View
     * @listens CoordinateTransformModel#changeIsActive
     * @listens CoordinateTransformModel#changeLoading
     * @listens CoordinateTransformModel#changeSourceCrsValid
     * @listens CoordinateTransformModel#changetargetCrsValid
     * @listens CoordinateTransformModel#changeSourceCoordinatesValid
     * @listens CoordinateTransformModel#changeTargetCoordinates
     */
    initialize: function () {
        const attributes = Radio.request("ModelList", "getModelByAttributes",
            {id: "coordinateTransform"}).attributes;

        this.model = new CoordinateTransformModel(attributes);
        this.listenTo(this.model, {
            "change:isActive": this.render,
            "change:loading": this.updateLoadmask,
            "change:sourceCrsValid": this.showValidState,
            "change:targetCrsValid": this.showValidState,
            "change:sourceCoordinatesValid": this.showValidState,
            "change:targetCoordinates": this.updateTargetCoordinates
        });
    },

    /**
     * Reference the render template
     */
    template: _.template(CoordinateTransformTemplate),

    /**
     * Modules render method.
     *
     * @param {Object} model The model
     * @param {Boolean} visible Falg if the view is visible
     * @returns {object} self
     */
    render: function (model, visible) {
        const attr = model.toJSON();
        let el = $(".coordinate-transform")[0];

        if (!el) {
            $("body").append("<div class='coordinate-transform'></div>");
            el = $(".coordinate-transform")[0];
        }

        if (visible) {
            this.setElement(document.getElementsByClassName("win-body")[0]);
            this.$el.html(this.template(attr));
            if (attr.availableSourceCrs.length === 0) {
                this.prepareCrsInput($("#sourcecrs"));
            }
            else {
                $("#sourcecrs").on("input", this.updateCrs.bind(this));
            }
            if (attr.availableTargetCrs.length === 0) {
                this.prepareCrsInput($("#targetcrs"));
            }
            else {
                $("#targetcrs").on("input", this.updateCrs.bind(this));
            }
            this.showValidState();
        }
        return this;
    },

    /**
     * Adds autocomplete functionality to the CRS input fields.
     * Available CRS will be queries against the epsg.io API
     *
     * @param {Object} input The input to add autocompletion to
     * @returns {void}
     */
    prepareCrsInput: function (input) {
        if (input && input.autocomplete) {
            input.autocomplete({
                appendTo: ".coordinate-transform",
                select: this.updateCrs.bind(this),
                delay: 100,
                source: this.model.fetchCrsInfo.bind(this.model)
            });
        }
    },

    /**
     * Sets the current selected CRS
     *
     * @param {Event} evt The browser event
     * @param {Object} selection The selection object
     * @returns {void}
     */
    updateCrs: function (evt, selection) {
        const val = selection && selection.item.value ? selection.item.value :
            evt.target.value;

        if (evt.target.id === "sourcecrs") {
            this.model.set("sourceCrs", val);
        }
        else {
            this.model.set("targetCrs", val);
        }
    },

    /**
     * Sets the source coordinates
     *
     * @param {Event} evt The browser event
     * @returns {void}
     */
    updateCoordinates: function (evt) {
        this.model.set("sourceCoordinates", evt.target.value);
    },

    /**
     * Shows validity information to the user based on the given input
     *
     * @returns {void}
     */
    showValidState: function () {
        const coordInput = this.$(".coordinate-input > #input"),
            sourcecrs = this.$("input#sourcecrs"),
            targetcrs = this.$("input#targetcrs");

        if (this.model.get("sourceCrsValid")) {
            sourcecrs.removeClass("invalid", 300);
        }
        else {
            sourcecrs.addClass("invalid", 300);
        }

        if (this.model.get("targetCrsValid")) {
            targetcrs.removeClass("invalid", 300);
        }
        else {
            targetcrs.addClass("invalid", 300);
        }

        if (this.model.get("sourceCoordinatesValid")) {
            coordInput.removeClass("invalid", 300);
        }
        else {
            coordInput.addClass("invalid", 300);
        }
    },

    /**
     * Updates the target coordinates in the view
     *
     * @returns {void}
     */
    updateTargetCoordinates: function () {
        this.$(".coordinate-output > textarea")[0].value =
            this.model.get("targetCoordinates");
    },

    /**
     * Shows or hides the loadmask on the result textarea
     *
     * @param {Object} self The self reference
     * @param {Boolean} loading Flag indicating if requests are pending
     * @returns {void}
     */
    updateLoadmask: function (self, loading) {
        const el = this.$(".coordinate-output > textarea");

        if (loading) {
            el.addClass("coordinates-loading");
            el[0].style.backgroundImage = "url(../../img/ajax-loader.gif)";
        }
        else {
            el.removeClass("coordinates-loading");
            el[0].style.backgroundImage = "unset";
        }
    }
});

export default CoordinateTransformView;
