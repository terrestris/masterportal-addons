# Background Switcher Addon

This addon searches for all available background layers and adds them to the `switcher` in the lower right corner, allowing the user to graphically switch the background layer.

The switcher can be opened and closed. If its open, you can swipe through the available layers, thus allowing an unlimited number of layers.

This component works for desktop and mobile.

## Setup
Add the addon to your masterportal in the addons folder.
Create or modify the `addonsConf.json` and add an entry like this:

```
{
  "backgroundSwitcher": "view.js"
}
```

You will need to change to the backgroundSwitcher directory and issue a

```
npm install
```

to install the required slick-carousel component.

Finally, add the addon to your `config.js` file in the section addons:

```
addons: [
    "backgroundSwitcher"
]
```

Make sure you have added some layers (at least 2) in the `Hintergrundkarten` section of your `config.json` file.

Startup your application and the switcher should appear in the lower right corner.
