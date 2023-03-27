import axios from "axios";
import {WMSCapabilities} from "ol/format";

/**
 * Fetch a capabilities document.
 *
 * @param {String} url The url to fetch.
 * @returns {String} The GetCapabilities document.
 */
export async function fetchCapabilities (url) {
    const response = await axios({
        method: "get",
        url: url,
        responseType: "text"
    });

    return response.data;
}

/**
 * Get the layers from a capabilities document.
 *
 * @param {String} serviceType The type of the service.
 * @param {String} capabilitiesDoc The capabilities document.
 * @returns {object[]} List of objects containing layer names and titles.
 */
export function getLayersFromCapabilities (serviceType, capabilitiesDoc) {
    let layers;

    if (serviceType === "wms") {
        layers = getLayerNamesFromWMSCapabilities(capabilitiesDoc);
    }
    else if (serviceType === "wfs") {
        layers = getLayerNamesFromWFSCapabilities(capabilitiesDoc);
    }

    return layers;
}

/**
 * Get all layernames of a WMS GetCapabilities document.
 *
 * @param {String} capabilities The GetCapabilities XML as string.
 * @returns {Object[]} Array of objects containing title and name for each layer.
 */
function getLayerNamesFromWMSCapabilities (capabilities) {
    const format = new WMSCapabilities(),
        cap = format.read(capabilities),
        layerNames = getFlatLayers(cap.Capability.Layer);

    return layerNames;
}

/**
 * Get all layernames of a WFS GetCapabilities document.
 *
 * @param {String} capabilities The GetCapabilities XML as string.
 * @returns {Object[]} Array of objects containing title and name for each layer.
 */
function getLayerNamesFromWFSCapabilities (capabilities) {
    const parser = new DOMParser(),
        cap = parser.parseFromString(capabilities.toString(), "text/xml"),
        layerNames = [];

    cap.querySelectorAll("FeatureType").forEach(e => {
        const titleEl = e.querySelector("Title"),
            nameEl = e.querySelector("Name"),
            title = titleEl ? titleEl.textContent : undefined,
            name = nameEl ? nameEl.textContent : undefined;

        layerNames.push({
            name,
            title
        });
    });
    return layerNames;
}

/**
 * Get the version from the Capabilities document.
 *
 * @param {String} capabilities The capabilities document.
 * @returns {String} The version string.
 */
export function getVersionFromCapabilities (capabilities) {
    const parser = new DOMParser(),
        cap = parser.parseFromString(capabilities, "text/xml");

    return cap.children[0].getAttribute("version");
}

/**
 * Get flat list of all layers.
 *
 * @param {Object[]} layer List of capabilities Layer objects.
 * @returns {Object[]} List of flat layers, where each object consists of name and title.
 */
function getFlatLayers (layer) {
    let layers = [];

    if (Array.isArray(layer)) {
        layers = layers.concat(layer.map(l => getFlatLayers(l)));
    }
    else {
        if (layer.Name) {
            const layerTitle = layer.Title ? layer.Title : layer.Name;

            layers.push({title: layerTitle, name: layer.Name});
        }
        if (Object.prototype.hasOwnProperty.call(layer, "Layer")) {
            layers = layers.concat(...getFlatLayers(layer.Layer));
        }
    }

    return layers;
}

/**
 * Checks if the capabilities url is valid.
 *
 * @param {string} capabilitiesUrl The capabilitiesUrl to check.
 * @returns {boolean} True, if url is valid. False otherwise.
 */
export function isValidCapabilitiesUrl (capabilitiesUrl) {
    if (!capabilitiesUrl || capabilitiesUrl.length === 0) {
        return false;
    }

    const url = new URL(capabilitiesUrl),
        params = [];

    for (const k of url.searchParams.keys()) {
        params.push(k.toLowerCase());
    }

    return params.includes("service") && params.includes("request");
}

export default {
    fetchCapabilities,
    getLayersFromCapabilities,
    isValidCapabilitiesUrl
};
