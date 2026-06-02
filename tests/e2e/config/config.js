// eslint-disable-next-line no-unused-vars
const Config = {
    addons: ["exporter"],
    alerting: {
        fetchBroadcastUrl: "./resources/newsFeedPortalAlerts.json"
    },
    namedProjections: [
        ["EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"]
    ],
    layerConf: "./resources/services.json",
    restConf: "./resources/rest-services.json",
    styleConf: "./resources/style_v3.json",
    wfsImgPath: "./resources/img/",
    portalLanguage: {
        enabled: true,
        debug: false,
        languages: {
            de: "Deutsch",
            en: "English"
        },
        fallbackLanguage: "de",
        changeLanguageOnStartWhen: ["querystring", "localStorage", "htmlTag"]
    },
    portalLocales: {
        de: {
            common: {
                modules: {
                    searchBar: {
                        placeholder: {
                            address: "Suche nach Themen"
                        }
                    }
                }
            }
        }
    }
};
