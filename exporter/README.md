# Exporter Addon

## Installation

### Basic

1. Copy the folder to your `addons` folder within your masterportal project.
2. Run `npm i` within the specific addon folder: `addons/exporter`
3. Adapt the `addons/addonsConf.json` by adding:

```json
{
  "exporter": {
    "type": "tool"
  }
}
```

4. Refer the new addon in your portal's `config.js`:

```js
addons: [
  "exporter"
]
```

5. Configure the addon in your portal's `config.json`. See an example in `/doc/config.json.md`.

For more information, please check the official [Masterportal documentation](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/addOnsVue.md).

### GeoPackage Support

GeoPackage support works out of the box: the [GeoPackage library](https://www.npmjs.com/package/@ngageoint/geopackage) and the WebAssembly version of `Sql.js` are installed via `npm i` (step 2) and bundled by Vite. No additional files in the portal's `resources` folder are required.

1. Verify that `gpkg` is defined in `supportedExportFormats` in your `config.json` (it is by default).

## Notes

This plugin was developed and tested for Masterportal v3.27.0 (LTS).
