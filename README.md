# Masterportal-addons

This repo contains addons for the [Masterportal](https://bitbucket.org/geowerkstatt-hamburg/masterportal/).

## Installation

Please check the `README` or `doc` files within the respective addon folder.

## Overview

| Addon name          | description                                           | Compability | Project Background |
|---------------------|-------------------------------------------------------|-------------|--------------------|
| Importer            | Import common geodata formats and OGC services        | > v2.30¹    | [MDI-DE Portal](https://projekt.mdi-de.org/)      |
| Exporter            | Export WFS and vector layer to common geodata formats | > v2.30¹    | [MDI-DE Portal](https://projekt.mdi-de.org/)      |
| backgroundSwitcher  | Overviewmap to change background map                  | v2.5²       | [LGB](https://geobasis-bb.de/lgb/de/geodaten/portale-anwendungen/geoportal-brandenburg/#) |
| coordinateTransform | Transform coordinates using epsg.io API               | v2.5²       | [LGB](https://geobasis-bb.de/lgb/de/geodaten/portale-anwendungen/geoportal-brandenburg/#) |
| fontawesome         | Add fontawesome as icon library                       | v2.5²       | [LGB](https://geobasis-bb.de/lgb/de/geodaten/portale-anwendungen/geoportal-brandenburg/#) |
| simpleLineChart     | Renders data points on simple chart.js component      | v3.8.0       | [FOSSGIS WS](https://github.com/terrestris/masterportal-ws)  |
| tourGuide     | This addon enables a customised tour through the masterportal. Elements can be highlighted and provided with descriptions and graphics. Technically, it is basically a wrapper for [intro.js](https://introjs.com/) with minor adaptions to fit the masterportal design.      | v3.8.0       | [Meckenheim Geoportal](https://geoportal.meckenheim.de)  |
| importer (v3)       | Import common geodata formats and OGC services        | v3.15.1 (LTS)|      |
| exporter (v3)       | Export WFS and vector layer to common geodata formats | v3.13.0    |      |

¹ Should work on older versions that use the new Vue.js framework.
² Last tested version. Should work on more recent versions that still use Backbone.js framework.
