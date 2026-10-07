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

1. Verify, that the GeoPackage (`gpkg`) is defined as `supportedExportFormats` in your `config.json`.

## Notes

This plugin was developed and tested for Masterportal v3.27.0 (LTS).
