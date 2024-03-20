import Vuex from "vuex";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import SimpleLineChartTheme from "../../../components/SimpleLineChart.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("/src/modules/tools/gfi/components/themes/simpleLineChart/components/SimpleLineChart.vue", () => {
    let wrapper;

    const featureData = {
            getTheme: () => {
                return {
                    "name": "SimpleLineChart",
                    "params": {
                        "wfs": {
                            "url": "https://cdc.dwd.de/geoserver/wfs?SERVICE=WFS&acceptedVersions=2.0.0",
                            "featureType": "CDC:OBS_DEU_P1M_T2M" ,
                            "attributes": {
                              "timestamp": "ZEITSTEMPEL",
                              "value": "WERT"
                            }
                          }
                    }
                };
            },
            getTitle: () => "SimpleLineChart",
            getFeatures: () => {
                return undefined
            },
            getProperties: () => {
                return {
                    "boundedBy": [
                        559447.3788,
                        5925773.5169,
                        559447.3788,
                        5925773.5169
                    ],
                    "SDO_NAME": "Hamburg-Neuwiedenthal",
                    "ZEITSTEMPEL": "2021-05-01T00:00:00Z",
                    "ZEITINTERVALL": "P1M",
                    "WERT": "11.32",
                    "EINHEIT": "°C"
                }
            }
        },
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "de-DE"
                    }
                }
            }
        });

    beforeEach(() => {
        wrapper = shallowMount(SimpleLineChartTheme, {
            localVue,
            store,
            propsData: {
                feature: featureData
            },
            getData: () => {
                    return false
            }
        });
    });

    describe("Component DOM", () => {
        it("It should exist a container for a data table", () => {
            expect(wrapper.find("#simpleLineChart").exists()).to.be.true;
        });

    });

    // TODO test methods, test chart
});
