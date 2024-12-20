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
| simpleLineChart     | Renders data points on simple chart.js component      | v3.3.3       | [FOSSGIS WS](https://github.com/terrestris/masterportal-ws)  |

¹ Should work on older versions that use the new Vue.js framework.  
² Last tested version. Should work on more recent versions that still use Backbone.js framework.

