# TourGuide Addon

This addon enables a customised tour through the masterportal. Elements can be highlighted and provided with descriptions and graphics. Technically, it is basically a wrapper for [intro.js](https://introjs.com/) with minor adaptions to fit the masterportal design.

## Supported Masterportal Versions

- [v3.3.4](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/v3.3.4/)

## Installation

1. Install the `intro.js` package that is not provided via masterportal core: Run `npm ci` in the addons folder.
2. Register the addon on your `addonsConf.json` and `config.js`: `addons: ["tourGuide"]`
3. Add the tour to your menu in `config.json`, using a `customMenuElement`, e.g.:

```
{
    "type": "customMenuElement",
    "name": "Tour",
    "execute": {
        "action": "TourGuide/startTour"
    }
}
```

## Configuration

In `config.js` you can define custom steps for the tour.

|Name|Required|Type|Default|Description|
|----|--------|----|-------|-----------|
|element|no|String||The querySelector of the element that shall be highlighted.|
|intro|yes|**[intro](###Text)**||The content of the step.|
|classes|no|String||The css classes to add to your step. Use `step-large` to 

For further detailed configuration, please check the [intro.js docs](https://introjs.com/docs/tour/api#introjsaddstepoptions).

### Intro

Define the content of the step per available language in your portal instance:

```
intro: {
    de: "<p>Klicken Sie auf das Icon um die Hintergrundkarte zu wechseln.</p>",
    en: "<p>Click on the icon to change the background map.</p>"
}
```

The content can be of type `string` or `HTMLElement`. Please check the intro.js docs and examples, e.g. https://introjs.com/docs/tour/examples/html-tooltip.

### Configuration Examples

```
    {
        element: "#search-bar",
        intro: {
            de: `
                <p>Es müssen mindestens drei Buchstaben in die Suchmaske eingegeben werden.</p>
                `,
            en: `
                <p>At least three letters must be entered in the search mask in order to receive suggestions.</p>
                `
        },
    },
```
