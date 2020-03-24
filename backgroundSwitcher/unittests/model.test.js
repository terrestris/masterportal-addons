import BackgroundSwitcherModel from "./../model.js";
import Map from "@modules/core/map";
import {expect} from "chai";

describe("Background Switcher", function () {
    let model;
    const demoLayer = {
        format: "image/png",
        id: "1000",
        isBaseLayer: true,
        isChildLayer: false,
        isSelected: true,
        isVisibleInMap: true,
        isVisibleInTree: true,
        layers: "OSM-WMS",
        level: 0,
        maxScale: "10001000000",
        minScale: "0",
        name: "OSM WMS",
        parentId: "tree",
        singleTile: false,
        tilesize: "256",
        transparent: false,
        typ: "WMS",
        type: "layer",
        url: "https://ows.terrestris.de/osm/service?",
        version: "1.3.0"
    };

    // Map is required to get access to Map radio channels
    new Map({
        "epsg": "EPSG:3857"
    });

    before(function () {
        model = new BackgroundSwitcherModel();
    });

    describe("updatePreviews", function () {

        it("should return array of same length as backgroundlayers", () => {
            model.set("backgroundLayers", [demoLayer, demoLayer, demoLayer]);
            model.updatePreviews();
            const layers = model.get("backgroundLayers"),
                previews = model.get("previews");

            expect(previews).to.be.an("array");
            expect(previews).to.have.length(layers.length);
        });

        it("previews should contain a getMap URL", () => {
            model.set("backgroundLayers", [demoLayer, demoLayer, demoLayer]);
            model.updatePreviews();
            const preview = model.get("previews")[0];

            expect(preview.img).to.contain("http");
            expect(preview.img.toLowerCase()).to.contain("getmap");
        });
    });

    describe("setActiveLayerById", function () {

        it("should set the active layer by the given id", () => {
            const demoLayer1 = {...demoLayer},
                demoLayer2 = {...demoLayer},
                demoLayer3 = {...demoLayer};

            demoLayer2.id = 2;
            demoLayer3.id = 3;

            model.set("backgroundLayers", [demoLayer1, demoLayer2, demoLayer3]);
            model.setActiveLayerById("1000");

            expect(model.get("activeLayer").id).to.equal("1000");
        });

    });

});
