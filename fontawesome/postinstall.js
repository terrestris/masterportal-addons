const fs = require("fs");

console.log("Copying fonts to css/fonts");

fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf", "../../css/fonts/fa-brands-400.ttf");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf", "../../css/fonts/fa-regular-400.ttf");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf", "../../css/fonts/fa-solid-900.ttf");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff", "../../css/fonts/fa-brands-400.woff");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff", "../../css/fonts/fa-regular-400.woff");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff", "../../css/fonts/fa-solid-900.woff");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2", "../../css/fonts/fa-brands-400.woff2");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2", "../../css/fonts/fa-regular-400.woff2");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2", "../../css/fonts/fa-solid-900.woff2");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.eot", "../../css/fonts/fa-brands-400.eot");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.eot", "../../css/fonts/fa-regular-400.eot");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.eot", "../../css/fonts/fa-solid-900.eot");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.svg", "../../css/fonts/fa-brands-400.svg");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.svg", "../../css/fonts/fa-regular-400.svg");
fs.copyFileSync("./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.svg", "../../css/fonts/fa-solid-900.svg");
