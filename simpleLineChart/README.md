# Simple Line Chart Addon for Masterportal

This provides an `gfiTheme` addon for Masterportal that displays time series data.

Tested for Masterportal [v2.42.0](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/v2.42.0/).

## Prerequisites

- WMS service that has a corresponding WFS service that contains data for all timestamps.

### Example:
- [CDC GeoServer of DWD](https://cdc.dwd.de/geoserver)
- WMS Layer: `OBS_DEU_P1M_T2M` (Monatsmittel der Stationsmessungen der Lufttemperatur in 2 m Höhe in °C)
- WFS TypeName: `OBS_DEU_P1M_T2M`

In this case the WMS is a WMS time layer, but we use it without time parameter.
