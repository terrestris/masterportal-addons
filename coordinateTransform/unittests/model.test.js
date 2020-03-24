import CoordinateTransformModel from "./../model.js";
import {expect} from "chai";

describe("Coordinate Transform", function () {

    let model;

    beforeEach(function () {
        model = new CoordinateTransformModel();
        model.stopListening(model, {
            "change:sourceCrs": this.transform,
            "change:targetCrs": this.transform,
            "change:sourceCoordinates": this.transform
        });
        model.clear();
        model.set(model.defaults);
    });

    describe("validity check", function () {

        it("should be valid when all input params given", () => {
            model.set("sourceCrs", "4326");
            model.set("targetCrs", "3857");
            model.set("sourceCoordinates", "50, 7");
            expect(model.isValid()).to.be.true;
        });

        it("should fail when sourceCrs is missing", () => {
            model.set("sourceCrs", null);
            model.set("targetCrs", "3857");
            model.set("sourceCoordinates", "50, 7");
            expect(model.isValid()).to.be.false;
        });

        it("should fail when targetCrs is missing", () => {
            model.set("sourceCrs", "4326");
            model.set("targetCrs", null);
            model.set("sourceCoordinates", "50, 7");
            expect(model.isValid()).to.be.false;
        });

        it("should fail when sourceCoordinates are missing", () => {
            model.set("sourceCrs", "4326");
            model.set("targetCrs", "3857");
            model.set("sourceCoordinates", "");
            expect(model.isValid()).to.be.false;
        });

        it("should fail when sourceCoordinates are syntactically wrong", () => {
            model.set("sourceCrs", "4326");
            model.set("targetCrs", "3857");
            model.set("sourceCoordinates", "50.123;123");
            expect(model.isValid()).to.be.false;
        });
    });
});
