// eslint-disable-next-line no-unused-vars
const Config = {
    addons: ["exporter", "importer", "tourGuide", "simpleLineChart"],
    alerting: {
        fetchBroadcastUrl: "./resources/news.json"
    },
    namedProjections: [
        ["EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"]
    ],
    portalConf: "/e2e/config.json",
    layerConf: "/e2e/resources/services.json",
    restConf: "/e2e/resources/rest-services.json",
    styleConf: "/e2e/resources/style_v3.json",
    portalLanguage: {
        enabled: true,
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
    },
    tourGuide: {
        steps: [
            {
                intro: {
                    de: `
                        <p>Es müssen mindestens drei Buchstaben in die Suchmaske eingegeben werden.</p>
                        `,
                    en: `
                        <p>At least three letters must be entered in the search mask in order to receive suggestions.</p>
                        `
                }
            }
        ]
    }
};
