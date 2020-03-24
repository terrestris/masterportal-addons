# Coordinate Transform Addon

This addon allows the user to transform coordinates from one spatial reference system to another.
The user has access to all available reference systems available on epsg.io, as we use their API
to query and transform the data.
Alternatively you can specify a list of allowed CRS to be choosen from by the user.

This addon is meant to be displayed in a window and can be configured
as a tool in the menu.

## Setup
Add the addon to your masterportal in the addons folder.
Create or modify the `addonsConf.json` and add an entry like this:

```
{
  "coordinateTransform": "view.js"
}
```

You will need to add the tool to the menu by editing the `config.json` file

```
...
"tools": {
    "name": "Werkzeuge",
    "children": {
        "coordinateTransform": {
            "name": "Koordinaten transformieren",
            "glyphicon": "glyphicon-record"
        }
    }
...
```

Finally, add the addon to your `config.js` file in the section addons:

```
addons: [
    "coordinateTransform"
]
```

If you want to restrict the list of allowed CRS used for transformation, add
the desired codes to your `config.js` file like this:
```
coordinateTransformSourceCrs: [
    "25832",
    "4326",
    "3857"
],
coordinateTransformTargetCrs: [
    "25833",
    "25832",
    "4326",
    "3857"
]
```
