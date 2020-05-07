# Fontawesome Addon

This addon imports the fontawesome icons and css and thereby allows the usage of fontawesome icons.

## Setup

Run `npm i` to install all dependencies.

A postinstall script will then automatically copy the required fonts to the projects `css/fonts` folder.

## Usage

fontawesome icons can then be used in the [typical way](https://fontawesome.com/how-to-use/on-the-web/referencing-icons/basic-use), i.e. using the respective classes of the icons.

Please note that only the freely available fontawesome icons and styles can be used. More info [here](https://fontawesome.com/how-to-use/on-the-web/referencing-icons/basic-use).

### Example

We can replace the default icons in the menu with custom fontawesome icons by using the fontawesome class
in the `glyphicon` property. Please note that also the style class (e.g.`fas`) has to be set here.

```json
{
    "Portalconfig": {
        "menu": {
            "tools": {
                "name": "Werkzeuge",
                "glyphicon": "fas fa-camera",
                "children": {
                    "gfi": {
                        "name": "Informationen abfragen",
                        "glyphicon": "fas fa-camera"
                    }
                }
            }
        }
    }
}
```
