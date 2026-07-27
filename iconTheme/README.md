# IconTheme Addon

IconTheme is a custom GFI theme addon for Masterportal.  
It extends the default GFI rendering and adds:

- icon rendering for selected attribute keys (`iconMapping`)
- optional custom links below the attribute table (`links`)

## Supported Masterportal setup

- addon type: `gfiTheme`
- registration key in this repository: `iconTheme`

## Installation

1. Register the addon in `addons/addonsConf.json`:

```json
{
    "iconTheme": {
        "type": "gfiTheme"
    }
}
```

2. Enable the addon in `config.js`:

```js
addons: ["iconTheme"]
```

3. Configure a layer to use the theme in `config.json`:

```json
{
    "gfiTheme": {
        "name": "iconTheme",
        "params": {
            "beautifyKeys": true,
            "showObjectKeys": false,
            "showFavoriteIcons": true,
            "iconMapping": {
                "opening_hours": {
                    "aria": "Öffnungszeiten des kühlen Ortes",
                    "icon": "./resources/img/time.svg"
                },
                "bench": {
                    "aria": "Sitzmöglichkeiten am kühlen Ort",
                    "icon": "./resources/img/bench.svg"
                }
            },
            "links": [
                {
                    "name": "Weitere Informationen zu Hitze und Hitzeschutz",
                    "url": "https://meckenheim.de/Stadtentwicklung/Klima-und-Stadtgr%C3%BCn/Hitze-und-Hitzeschutz/"
                }
            ]
        }
    }
}
```

## Configuration

### gfiTheme object

| Name | Required | Type | Default | Description |
|---|---|---|---|---|
| `name` | yes | String | - | Must be `iconTheme`. |
| `params` | no | Object | `{}` | Theme parameters object. |

### params object

| Name | Required | Type | Default | Description |
|---|---|---|---|---|
| `iconMapping` | no | Object | `undefined` | Maps attribute keys to icon definitions. |
| `links` | no | Array<Object> | `undefined` | Additional links rendered below the table. |

### iconMapping entry

`iconMapping` is an object where each key is an attribute key from GFI properties.

| Name | Required | Type | Default | Description |
|---|---|---|---|---|
| `aria` | no | String | `undefined` | Accessible label and alt text. |
| `icon` | yes | String | - | Path or URL to icon image. |

### links entry

Each `links` item supports:

| Name | Required | Type | Default | Description |
|---|---|---|---|---|
| `name` | yes | String | - | Link text shown in the GFI. |
| `url` | yes | String | - | Target URL. |

## Notes

- If an attribute key is not present in `iconMapping`, the regular key label is shown.
- Link rendering is optional and only visible if `links` is configured.

## License

This addon is licensed under the MIT License, aligned with Masterportal licensing.
See `LICENSE` in this addon folder.
