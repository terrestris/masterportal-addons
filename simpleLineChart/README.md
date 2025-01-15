# Simple Line Chart Addon for Masterportal

This provides an `gfiTheme` addon for Masterportal that displays time series data. It is a demonstration addon that has been developed for the [FOSSGIS Masterportal Workshop]([workshop slides](https://github.com/terrestris/masterportal-ws)) in 2024.

If you want to test the addon, please check the  for instructions.

## Disclaimer

This addon is a demonstration addon (not intended for production environments). Please contact the repository maintainer, if you want to use and develop this addon.

## Supported Masterportal Versions

- [v3.3.3](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/v3.3.3/)

## Prerequisites

- WMS service that has a corresponding WFS service that contains data for all timestamps.

## Installation

1. Register the addon on your `config.js`: `addons: ["simpleLineChart"]`
2. Use the gfiTheme in a layer definition. Example:

```json
  {
    "id": "obs_deu_p1m_t2m",
    "name": "OBS",
    "url": "https://cdc.dwd.de/geoserver/ows",
    "layers": "OBS_DEU_P1M_T2M",
    "typ": "WMS",
    "format": "image/png",
    "version": "1.3.0",
    "singleTile": false,
    "transparent": true,
    "transparency": 0,
    "tilesize": 256,
    "gutter": 0,
    "gfiAttributes": "showAll",
    "layerAttribution": "nicht vorhanden",
    "legendURL": "ignore",
    "gfiTheme": {
      "name": "simpleLineChart",
      "params": {
        "wfs": {
          "url": "https://localhost:9001/dwd/ows",
          "featureType": "CDC:OBS_DEU_P1M_T2M",
          "attributes": {
            "timestamp": "ZEITSTEMPEL",
            "value": "WERT"
          }
        }
      }
    }
  }
```

In this example the CDC [GeoServer of the German weather service (DWD)](https://cdc.dwd.de/geoserver) is used:
    - WMS Layer: `OBS_DEU_P1M_T2M` (Monatsmittel der Stationsmessungen der Lufttemperatur in 2 m Höhe in °C)
    - WFS TypeName: `OBS_DEU_P1M_T2M`

In this case the WMS is a WMS time layer, but we use it without time parameter.
