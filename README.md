# Masterportal Addons

This repo contains addons for the current stable [Masterportal](https://bitbucket.org/geowerkstatt-hamburg/masterportal/), developed by [terrestris](https://terrestris.de).  
We also developed several other addons to customize layout, design (e.g. icon library), start page, detail search. Feel free to contact us at sales@terrestris.de for more information.

## Installation

Please check the `README` or `doc` files within the respective addon folder.

## Overview

| Addon name          | description                                           | Compability | Demo |
|---------------------|-------------------------------------------------------|-------------|--------------------|
| Data Narrator¹     | Addon to integrate the Data Narrator Platform: Story dashboard, story editor, step editor, playback mode, layer selection, handle GeoJSON and 3D models. | v3.15.x (LTS)  |  tba |
| embedit²       | Integrates the fully customizable form-based Geo-Editor to create/update/delete your data. | v3.15.x (LTS) | [terrestris Masterportal](https://masterportal.terrestris.de) |
| exporter       | Export WFS and vector layers to common geodata formats. | v3.15.x (LTS)    |[terrestris Masterportal](https://masterportal.terrestris.de)|
| importer       | Import common geodata formats and OGC services.        | v3.15.x (LTS)|[terrestris Masterportal](https://masterportal.terrestris.de)|
| simpleLineChart     | Renders data points on simple chart.js component.      | v3.15.x (LTS)       | [FOSSGIS WS](https://github.com/terrestris/masterportal-ws)  |
| tourGuide     | This addon enables a customised tour through the masterportal. Elements can be highlighted and provided with descriptions and graphics. Technically, it is basically a wrapper for [intro.js](https://introjs.com/) with minor adaptions to fit the masterportal design.      | v3.15.x (LTS)       | [Meckenheim Geoportal](https://geoportal.meckenheim.de)  |

¹ Code Repository: https://github.com/citysciencelab/cut-dana-platform-addon
² Code Repository: https://github.com/formcapture/masterportal-addons

## Testing

### Unit Tests

The unit tests run together with the Masterportal core module tests. They can be found within the `tests`folder of the respective addon. [Documentation](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/docs/Dev/unitTestVue.md).

### E2E

The E2E tests are triggered automatically on pull requests against the `main` branch. Since the Masterportal core does not support e2e tests, the test files can be found in `test/e2e` on the project root. The tests can be run locally, just adjust the adress and port for your local setup.
