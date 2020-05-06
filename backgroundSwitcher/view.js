import BackgroundSwitcherTemplate from "text-loader!./template.html";
import BackgroundSwitcherModel from "./model.js";
import "slick-carousel";
import "slick-carousel/slick/slick.less";
import "./style.less";

const BackgroundSwitcherView = Backbone.View.extend({
    events: {
        "click .expanded .backgroundswitcher-preview > img": "setBackgroundLayer",
        "touchstart .expanded .backgroundswitcher-preview > img": "setBackgroundLayer",
        "click .titlebar, .collapsed": "toggle",
        "touchstart .titlebar": "toggle"
    },

    /**
     * The initialize method
     *
     * @class BackgroundSwitcherView
     * @extends Backbone.View
     * @listens BackgroundSwitcherModel#changeActiveLayer
     * @listens BackgroundSwitcherModel#changeOpen
     * @listens BackgroundSwitcherModel#changePreviews
     */
    initialize: function () {
        this.model = new BackgroundSwitcherModel();
        this.listenTo(this.model, {
            "change:activeLayer": this.renderActiveLayer,
            "change:open": this.render,
            "change:previews": this.renderPreviews,
            "change:currentLng": this.render
        });
        if (this.model.get("backgroundLayers").length < 2) {
            console.warn("You need to have at least 2 background layers to " +
                "use the backgroundswitcher.");
            return;
        }
        this.render(this.model, true);
    },

    /**
     * Reference the render template
     */
    template: _.template(BackgroundSwitcherTemplate),

    /**
     * Modules render method. Adds the slick-js carousel to the div
     * for comfortable scrolling through available layers
     *
     * @returns {object} self
     */
    render: function () {
        const attr = this.model.toJSON(),
            layerCount = this.model.get("backgroundLayers").length;
        let el = $(".background-switcher")[0];

        // try to add background-switcher to map
        // if no map found add it to the body element
        if (!el) {
            const map = $("#map");

            if (map.length > 0) {
                map.append("<div class='background-switcher'></div>");
            }
            else {
                $("body").append("<div class='background-switcher'></div>");
            }
            el = $(".background-switcher")[0];
        }
        this.setElement(el);
        this.$el.html(this.template(attr));

        $(".background-switcher .expanded").slick({
            dots: false,
            arrows: false,
            infinite: true,
            slidesToShow: layerCount > 4 ? 4 : layerCount,
            slidesToScroll: layerCount > 4 ? 4 : layerCount,
            speed: 300,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: layerCount > 3 ? 3 : layerCount,
                        slidesToScroll: layerCount > 3 ? 3 : layerCount
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
        return this;
    },

    /**
     * Updates the preview images by fading them in and out smoothly.
     * This avoids flickering and sudden height change effects.
     *
     * @param {Object} model The model
     * @param {Array} previews The previews array holding the image URLs
     * @returns {void}
     */
    renderPreviews: function (model, previews) {
        previews.forEach((preview) => {
            const img = $("<img src='" + preview.img + "' id='" +
                preview.layer.id + "' style='opacity:0'></img>");

            img[0].onload = () => {
                const existingImage = $(".background-switcher img[id='" +
                    preview.layer.id + "']");

                existingImage.fadeOut(100, () => {
                    existingImage.replaceWith(img[0]);
                    img.fadeTo(100, 1);
                });
            };
        });
    },

    /**
     * Switch CSS classes of active element instead of calling full render
     * method to avoid flickering effects
     *
     * @returns {void}
     */
    renderActiveLayer: function () {
        const attr = this.model.toJSON(),
            activeEl = $(".backgroundswitcher-preview > img[id='" +
              attr.activeLayer.id + "']"),
            previousActive = $(".backgroundswitcher-preview.active");

        if (previousActive) {
            previousActive.each((idx, el) => {
                el.className = "backgroundswitcher-preview";
            });
        }
        if (activeEl) {
            activeEl.each((idx, el) => {
                el.parentNode.className = "backgroundswitcher-preview active";
            });
        }
        // auto close slider after layer selection
        this.toggle();
    },

    /**
     * Sets the active background layer by the given preview image click event
     *
     * @param {Event} evt The event emitted by the click on the layerimage
     * @returns {void}
     */
    setBackgroundLayer: function (evt) {
        this.model.setActiveLayerById(evt.target.id);
    },

    /**
     * Toggles the open and closed state of the background switcher.
     * Will also update the preview images on toggle.
     *
     * @returns {void}
     */
    toggle: function () {
        this.model.set("open", !this.model.get("open"));
        this.model.updatePreviews();
    }
});

export default BackgroundSwitcherView;
