// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/randomcolor/randomColor.js":[function(require,module,exports) {
var define;
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function(root, factory) {

  // Support CommonJS
  if (typeof exports === 'object') {
    var randomColor = factory();

    // Support NodeJS & Component, which allow module.exports to be a function
    if (typeof module === 'object' && module && module.exports) {
      exports = module.exports = randomColor;
    }

    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;

  // Support AMD
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);

  // Support vanilla script loading
  } else {
    root.randomColor = factory();
  }

}(this, function() {

  // Seed to get repeatable colors
  var seed = null;

  // Shared color dictionary
  var colorDictionary = {};

  // Populate the color dictionary
  loadColorBounds();

  var randomColor = function (options) {

    options = options || {};

    // Check if there is a seed and ensure it's an
    // integer. Otherwise, reset the seed value.
    if (options.seed !== undefined && options.seed !== null && options.seed === parseInt(options.seed, 10)) {
      seed = options.seed;

    // A string was passed as a seed
    } else if (typeof options.seed === 'string') {
      seed = stringToInteger(options.seed);

    // Something was passed as a seed but it wasn't an integer or string
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError('The seed value must be an integer or string');

    // No seed, reset the value outside.
    } else {
      seed = null;
    }

    var H,S,B;

    // Check if we need to generate multiple colors
    if (options.count !== null && options.count !== undefined) {

      var totalColors = options.count,
          colors = [];

      options.count = null;

      while (totalColors > colors.length) {

        // Since we're generating multiple colors,
        // incremement the seed. Otherwise we'd just
        // generate the same color each time...
        if (seed && options.seed) options.seed += 1;

        colors.push(randomColor(options));
      }

      options.count = totalColors;

      return colors;
    }

    // First we pick a hue (H)
    H = pickHue(options);

    // Then use H to determine saturation (S)
    S = pickSaturation(H, options);

    // Then use S and H to determine brightness (B).
    B = pickBrightness(H, S, options);

    // Then we return the HSB color in the desired format
    return setFormat([H,S,B], options);
  };

  function pickHue (options) {

    var hueRange = getHueRange(options.hue),
        hue = randomWithin(hueRange);

    // Instead of storing red as two seperate ranges,
    // we group them, using negative numbers
    if (hue < 0) {hue = 360 + hue;}

    return hue;

  }

  function pickSaturation (hue, options) {

    if (options.hue === 'monochrome') {
      return 0;
    }

    if (options.luminosity === 'random') {
      return randomWithin([0,100]);
    }

    var saturationRange = getSaturationRange(hue);

    var sMin = saturationRange[0],
        sMax = saturationRange[1];

    switch (options.luminosity) {

      case 'bright':
        sMin = 55;
        break;

      case 'dark':
        sMin = sMax - 10;
        break;

      case 'light':
        sMax = 55;
        break;
   }

    return randomWithin([sMin, sMax]);

  }

  function pickBrightness (H, S, options) {

    var bMin = getMinimumBrightness(H, S),
        bMax = 100;

    switch (options.luminosity) {

      case 'dark':
        bMax = bMin + 20;
        break;

      case 'light':
        bMin = (bMax + bMin)/2;
        break;

      case 'random':
        bMin = 0;
        bMax = 100;
        break;
    }

    return randomWithin([bMin, bMax]);
  }

  function setFormat (hsv, options) {

    switch (options.format) {

      case 'hsvArray':
        return hsv;

      case 'hslArray':
        return HSVtoHSL(hsv);

      case 'hsl':
        var hsl = HSVtoHSL(hsv);
        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

      case 'hsla':
        var hslColor = HSVtoHSL(hsv);
        var alpha = options.alpha || Math.random();
        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + alpha + ')';

      case 'rgbArray':
        return HSVtoRGB(hsv);

      case 'rgb':
        var rgb = HSVtoRGB(hsv);
        return 'rgb(' + rgb.join(', ') + ')';

      case 'rgba':
        var rgbColor = HSVtoRGB(hsv);
        var alpha = options.alpha || Math.random();
        return 'rgba(' + rgbColor.join(', ') + ', ' + alpha + ')';

      default:
        return HSVtoHex(hsv);
    }

  }

  function getMinimumBrightness(H, S) {

    var lowerBounds = getColorInfo(H).lowerBounds;

    for (var i = 0; i < lowerBounds.length - 1; i++) {

      var s1 = lowerBounds[i][0],
          v1 = lowerBounds[i][1];

      var s2 = lowerBounds[i+1][0],
          v2 = lowerBounds[i+1][1];

      if (S >= s1 && S <= s2) {

         var m = (v2 - v1)/(s2 - s1),
             b = v1 - m*s1;

         return m*S + b;
      }

    }

    return 0;
  }

  function getHueRange (colorInput) {

    if (typeof parseInt(colorInput) === 'number') {

      var number = parseInt(colorInput);

      if (number < 360 && number > 0) {
        return [number, number];
      }

    }

    if (typeof colorInput === 'string') {

      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {return color.hueRange;}
      } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        var hue = HexToHSB(colorInput)[0];
        return [ hue, hue ];
      }
    }

    return [0,360];

  }

  function getSaturationRange (hue) {
    return getColorInfo(hue).saturationRange;
  }

  function getColorInfo (hue) {

    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue-= 360;
    }

    for (var colorName in colorDictionary) {
       var color = colorDictionary[colorName];
       if (color.hueRange &&
           hue >= color.hueRange[0] &&
           hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
       }
    } return 'Color not found';
  }

  function randomWithin (range) {
    if (seed === null) {
      return Math.floor(range[0] + Math.random()*(range[1] + 1 - range[0]));
    } else {
      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      var max = range[1] || 1;
      var min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    }
  }

  function HSVtoHex (hsv){

    var rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

    return hex;

  }

  function defineColor (name, hueRange, lowerBounds) {

    var sMin = lowerBounds[0][0],
        sMax = lowerBounds[lowerBounds.length - 1][0],

        bMin = lowerBounds[lowerBounds.length - 1][1],
        bMax = lowerBounds[0][1];

    colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [sMin, sMax],
      brightnessRange: [bMin, bMax]
    };

  }

  function loadColorBounds () {

    defineColor(
      'monochrome',
      null,
      [[0,0],[100,0]]
    );

    defineColor(
      'red',
      [-26,18],
      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
    );

    defineColor(
      'orange',
      [19,46],
      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
    );

    defineColor(
      'yellow',
      [47,62],
      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
    );

    defineColor(
      'green',
      [63,178],
      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
    );

    defineColor(
      'blue',
      [179, 257],
      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
    );

    defineColor(
      'purple',
      [258, 282],
      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
    );

    defineColor(
      'pink',
      [283, 334],
      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
    );

  }

  function HSVtoRGB (hsv) {

    // this doesn't work for the values of 0 and 360
    // here's the hacky fix
    var h = hsv[0];
    if (h === 0) {h = 1;}
    if (h === 360) {h = 359;}

    // Rebase the h,s,v values
    h = h/360;
    var s = hsv[1]/100,
        v = hsv[2]/100;

    var h_i = Math.floor(h*6),
      f = h * 6 - h_i,
      p = v * (1 - s),
      q = v * (1 - f*s),
      t = v * (1 - (1 - f)*s),
      r = 256,
      g = 256,
      b = 256;

    switch(h_i) {
      case 0: r = v; g = t; b = p;  break;
      case 1: r = q; g = v; b = p;  break;
      case 2: r = p; g = v; b = t;  break;
      case 3: r = p; g = q; b = v;  break;
      case 4: r = t; g = p; b = v;  break;
      case 5: r = v; g = p; b = q;  break;
    }

    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
    return result;
  }

  function HexToHSB (hex) {
    hex = hex.replace(/^#/, '');
    hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;

    var red = parseInt(hex.substr(0, 2), 16) / 255,
          green = parseInt(hex.substr(2, 2), 16) / 255,
          blue = parseInt(hex.substr(4, 2), 16) / 255;

    var cMax = Math.max(red, green, blue),
          delta = cMax - Math.min(red, green, blue),
          saturation = cMax ? (delta / cMax) : 0;

    switch (cMax) {
      case red: return [ 60 * (((green - blue) / delta) % 6) || 0, saturation, cMax ];
      case green: return [ 60 * (((blue - red) / delta) + 2) || 0, saturation, cMax ];
      case blue: return [ 60 * (((red - green) / delta) + 4) || 0, saturation, cMax ];
    }
  }

  function HSVtoHSL (hsv) {
    var h = hsv[0],
      s = hsv[1]/100,
      v = hsv[2]/100,
      k = (2-s)*v;

    return [
      h,
      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
      k/2 * 100
    ];
  }

  function stringToInteger (string) {
    var total = 0
    for (var i = 0; i !== string.length; i++) {
      if (total >= Number.MAX_SAFE_INTEGER) break;
      total += string.charCodeAt(i)
    }
    return total
  }

  return randomColor;
}));

},{}],"style.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var style = {
  version: 8,
  name: 'Cartogram Style',
  center: [-73.99519273984345, 40.71988730982491],
  zoom: 14.429724903175206,
  bearing: 0,
  pitch: 0,
  sources: {
    composite: {
      url: 'mapbox://mapbox.mapbox-streets-v7',
      type: 'vector'
    }
  },
  glyphs: 'mapbox://fonts/tristen/{fontstack}/{range}.pbf',
  layers: [{
    id: 'background',
    type: 'background',
    layout: {},
    paint: {
      'background-color': 'hsl(0, 0%, 96%)'
    }
  }, {
    id: 'national-parks',
    type: 'fill',
    source: 'composite',
    'source-layer': 'landuse_overlay',
    filter: ['==', 'class', 'national_park'],
    layout: {},
    paint: {
      'fill-color': 'hsl(0, 0%, 93%)',
      'fill-opacity': ['interpolate', ['exponential', 1], ['zoom'], 5, 0, 6, 0.75]
    }
  }, {
    id: 'parks',
    type: 'fill',
    source: 'composite',
    'source-layer': 'landuse',
    filter: ['in', 'class', 'cemetery', 'park'],
    layout: {},
    paint: {
      'fill-color': 'hsl(0, 0%, 93%)',
      'fill-opacity': ['interpolate', ['exponential', 1], ['zoom'], 5, 0, 6, 0.75]
    }
  }, {
    id: 'water',
    type: 'fill',
    source: 'composite',
    'source-layer': 'water',
    layout: {},
    paint: {
      'fill-color': 'hsl(0, 0%, 71%)'
    }
  }, {
    id: 'waterways-rivers-canals',
    type: 'line',
    source: 'composite',
    'source-layer': 'waterway',
    minzoom: 8,
    filter: ['any', ['==', 'class', 'canal'], ['==', 'class', 'river']],
    layout: {
      'line-cap': ['step', ['zoom'], 'butt', 11, 'round'],
      'line-join': 'round'
    },
    paint: {
      'line-color': 'hsl(0, 0%, 71%)',
      'line-width': ['interpolate', ['exponential', 1.3], ['zoom'], 8.5, 0.1, 20, 8],
      'line-opacity': ['interpolate', ['exponential', 1], ['zoom'], 8, 0, 8.5, 1]
    }
  }, {
    id: 'barrier-line-land-line',
    type: 'line',
    source: 'composite',
    'source-layer': 'barrier_line',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'class', 'land']],
    layout: {
      'line-cap': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.99], ['zoom'], 14, 0.75, 20, 40],
      'line-color': 'hsl(0, 0%, 93%)'
    }
  }, {
    id: 'airports',
    type: 'fill',
    source: 'composite',
    'source-layer': 'aeroway',
    minzoom: 11,
    filter: ['all', ['!=', 'type', 'apron'], ['==', '$type', 'Polygon']],
    layout: {},
    paint: {
      'fill-color': 'hsl(0, 0%, 96%)',
      'fill-opacity': ['interpolate', ['exponential', 1], ['zoom'], 11, 0, 11.5, 1]
    }
  }, {
    id: 'transit-line-airport',
    type: 'line',
    source: 'composite',
    'source-layer': 'aeroway',
    minzoom: 9,
    filter: ['all', ['==', '$type', 'LineString'], ['in', 'type', 'runway', 'taxiway']],
    layout: {},
    paint: {
      'line-color': 'hsl(0, 0%, 96%)',
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 9, 1, 18, 80]
    }
  }, {
    id: 'buildings',
    type: 'fill',
    source: 'composite',
    'source-layer': 'building',
    minzoom: 13,
    filter: ['==', 'underground', 'false'],
    layout: {},
    paint: {
      'fill-color': 'hsl(0, 0%, 93%)',
      'fill-antialias': !0,
      'fill-outline-color': 'hsl(0, 0%, 96%)'
    }
  }, {
    id: 'tunnel',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['all', ['==', '$type', 'LineString'], ['all', ['==', 'structure', 'tunnel'], ['in', 'class', 'link', 'motorway', 'motorway_link', 'pedestrian', 'primary', 'secondary', 'street', 'street_limited', 'tertiary', 'trunk']]],
    layout: {
      'line-cap': 'square',
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, ['match', ['get', 'class'], 'motorway', 0.75, 'trunk', 0.75, 'primary', 0.75, 'secondary', 0.5, 'tertiary', 0.5, 0], 12, ['match', ['get', 'class'], 'trunk', 2, 'primary', 2, 'motorway', 2, 'secondary', 1, 'tertiary', 1, 0.5], 18, ['match', ['get', 'class'], 'motorway', 32, 'trunk', 32, 'primary', 32, 'secondary', 26, 'tertiary', 26, 18]],
      'line-color': 'hsl(0, 0%, 100%)',
      'line-dasharray': [1, 0.1],
      'line-opacity': 0.5
    }
  }, {
    id: 'road-pedestrian',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    minzoom: 12,
    filter: ['all', ['==', '$type', 'LineString'], ['all', ['==', 'class', 'pedestrian'], ['==', 'structure', 'none']]],
    layout: {
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 0.5, 18, 12],
      'line-color': 'hsl(0, 0%, 100%)',
      'line-opacity': ['interpolate', ['exponential', 1], ['zoom'], 13, 0, 14, 1],
      'line-dasharray': ['step', ['zoom'], ['literal', [1, 0]], 15, ['literal', [1.5, 0.4]], 16, ['literal', [1, 0.2]]]
    }
  }, {
    id: 'road-case',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['all', ['!in', 'structure', 'bridge', 'tunnel'], ['in', 'class', 'link', 'motorway', 'motorway_link', 'primary', 'secondary', 'service', 'street', 'street_limited', 'tertiary', 'track', 'trunk']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 7, 0.25, 16, 2],
      'line-color': 'hsl(0, 0%, 93%)',
      'line-opacity': 1,
      'line-gap-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, ['match', ['get', 'class'], 'motorway', 0.75, 'trunk', 0.75, 'primary', 0.75, 'secondary', 0.5, 'tertiary', 0.5, 0], 12, ['match', ['get', 'class'], 'trunk', 2, 'primary', 2, 'motorway', 2, 'secondary', 1, 'tertiary', 1, 0], 18, ['match', ['get', 'class'], 'motorway', 32, 'trunk', 32, 'primary', 32, 'secondary', 26, 'tertiary', 26, 18]]
    }
  }, {
    id: 'road',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['all', ['!in', 'structure', 'bridge', 'tunnel'], ['in', 'class', 'link', 'motorway', 'motorway_link', 'primary', 'secondary', 'service', 'street', 'street_limited', 'tertiary', 'track', 'trunk']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, ['match', ['get', 'class'], 'motorway', 0.75, 'trunk', 0.75, 'primary', 0.75, 'secondary', 0.5, 'tertiary', 0.5, 0], 12, ['match', ['get', 'class'], 'trunk', 2, 'primary', 2, 'motorway', 2, 'secondary', 1, 'tertiary', 1, 0.5], 18, ['match', ['get', 'class'], 'motorway', 32, 'trunk', 32, 'primary', 32, 'secondary', 26, 'tertiary', 26, 18]],
      'line-color': 'hsl(0, 0%, 100%)',
      'line-opacity': ['interpolate', ['linear'], ['zoom'], 13, ['match', ['get', 'class'], 'street', 0, 1], 14, 1]
    }
  }, {
    id: 'transit-line-rail-case',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    minzoom: 13,
    filter: ['all', ['!in', 'structure', 'bridge', 'tunnel'], ['in', 'class', 'major_rail', 'minor_rail']],
    layout: {
      'line-join': 'miter',
      'line-cap': 'square'
    },
    paint: {
      'line-color': 'hsl(0, 0%, 93%)',
      'line-width': ['interpolate', ['exponential', 1.25], ['zoom'], 14, 2, 20, 4],
      'line-dasharray': [0.25, 10]
    }
  }, {
    id: 'transit-line-rail',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    minzoom: 13,
    filter: ['all', ['!in', 'structure', 'bridge', 'tunnel'], ['in', 'class', 'major_rail', 'minor_rail']],
    layout: {
      'line-join': 'round'
    },
    paint: {
      'line-color': 'hsl(0, 0%, 93%)',
      'line-width': ['interpolate', ['exponential', 1], ['zoom'], 14, 0.75, 20, 1]
    }
  }, {
    id: 'bridge-case',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['all', ['==', 'structure', 'bridge'], ['in', 'class', 'link', 'motorway', 'motorway_link', 'pedestrian', 'primary', 'secondary', 'service', 'street', 'street_limited', 'tertiary', 'track', 'trunk']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 7, 0.25, 16, 2],
      'line-color': 'hsl(0, 0%, 93%)',
      'line-gap-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, ['match', ['get', 'class'], 'motorway', 0.75, 'trunk', 0.75, 'primary', 0.75, 'secondary', 0.5, 'tertiary', 0.5, 0], 12, ['match', ['get', 'class'], 'trunk', 2, 'primary', 2, 'motorway', 2, 'secondary', 1, 'tertiary', 1, 0], 18, ['match', ['get', 'class'], 'motorway', 32, 'trunk', 32, 'primary', 32, 'secondary', 26, 'tertiary', 26, 18]]
    }
  }, {
    id: 'bridge',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['all', ['==', 'structure', 'bridge'], ['in', 'class', 'link', 'motorway', 'motorway_link', 'pedestrian', 'primary', 'secondary', 'service', 'street', 'street_limited', 'tertiary', 'track', 'trunk']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, ['match', ['get', 'class'], 'motorway', 0.75, 'trunk', 0.75, 'primary', 0.75, 'secondary', 0.5, 'tertiary', 0.5, 0], 12, ['match', ['get', 'class'], 'trunk', 2, 'primary', 2, 'motorway', 2, 'secondary', 1, 'tertiary', 1, 0.5], 18, ['match', ['get', 'class'], 'motorway', 32, 'trunk', 32, 'primary', 32, 'secondary', 26, 'tertiary', 26, 18]],
      'line-color': 'hsl(0, 0%, 100%)'
    }
  }, {
    id: 'transit-line-rail-bridge',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    minzoom: 13,
    filter: ['all', ['==', 'structure', 'bridge'], ['in', 'class', 'major_rail', 'minor_rail']],
    layout: {
      'line-join': 'round'
    },
    paint: {
      'line-color': 'hsl(0, 0%, 93%)',
      'line-width': ['interpolate', ['exponential', 1], ['zoom'], 14, 0.75, 20, 1]
    }
  }, {
    id: 'bridge-overhead-case',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['all', ['==', 'structure', 'bridge'], ['>=', 'layer', 2], ['in', 'class', 'motorway', 'motorway_link', 'trunk', 'trunk_link']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 7, 0.25, 16, 2],
      'line-color': 'hsl(0, 0%, 93%)',
      'line-gap-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, ['match', ['get', 'class'], 'motorway', 0.75, 'trunk', 0.75, 'primary', 0.75, 'secondary', 0.5, 'tertiary', 0.5, 0], 12, ['match', ['get', 'class'], 'trunk', 2, 'primary', 2, 'motorway', 2, 'secondary', 1, 'tertiary', 1, 0], 18, ['match', ['get', 'class'], 'motorway', 32, 'trunk', 32, 'primary', 32, 'secondary', 26, 'tertiary', 26, 18]]
    }
  }, {
    id: 'bridge-overhead',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['all', ['==', 'structure', 'bridge'], ['>=', 'layer', 2], ['in', 'class', 'motorway', 'motorway_link', 'trunk', 'trunk_link']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, ['match', ['get', 'class'], 'motorway', 0.75, 'trunk', 0.75, 'primary', 0.75, 'secondary', 0.5, 'tertiary', 0.5, 0], 12, ['match', ['get', 'class'], 'trunk', 2, 'primary', 2, 'motorway', 2, 'secondary', 1, 'tertiary', 1, 0.5], 18, ['match', ['get', 'class'], 'motorway', 32, 'trunk', 32, 'primary', 32, 'secondary', 26, 'tertiary', 26, 18]],
      'line-color': 'hsl(0, 0%, 100%)'
    }
  }, {
    id: 'border-subnational',
    type: 'line',
    source: 'composite',
    'source-layer': 'admin',
    filter: ['all', ['==', 'maritime', 0], ['>=', 'admin_level', 3]],
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-dasharray': ['step', ['zoom'], ['literal', [2, 0]], 7, ['literal', [2, 2, 6, 2]]],
      'line-width': ['interpolate', ['exponential', 1], ['zoom'], 7, 0.75, 12, 1.5],
      'line-opacity': ['interpolate', ['exponential', 1], ['zoom'], 2, 0, 3, 1],
      'line-color': 'hsl(0, 0%, 71%)'
    }
  }, {
    id: 'border-national',
    type: 'line',
    source: 'composite',
    'source-layer': 'admin',
    minzoom: 1,
    filter: ['all', ['==', 'admin_level', 2], ['==', 'disputed', 0], ['==', 'maritime', 0]],
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': 'hsl(0, 0%, 31%)',
      'line-width': ['interpolate', ['exponential', 1], ['zoom'], 3, 0.5, 10, 2]
    }
  }, {
    id: 'border-national-dispute',
    type: 'line',
    source: 'composite',
    'source-layer': 'admin',
    minzoom: 1,
    filter: ['all', ['==', 'admin_level', 2], ['==', 'disputed', 1], ['==', 'maritime', 0]],
    layout: {
      'line-join': 'round'
    },
    paint: {
      'line-dasharray': [1.5, 1.5],
      'line-color': ['interpolate', ['exponential', 1], ['zoom'], 3, 'hsl(0, 0%, 71%)', 4, 'hsl(0, 0%, 31%)'],
      'line-width': ['interpolate', ['exponential', 1], ['zoom'], 3, 0.5, 10, 2]
    }
  }, {
    id: 'poi-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'poi_label',
    layout: {
      'text-line-height': 1.1,
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 10, ['match', ['get', 'scalerank'], 1, 12, 10], 18, ['match', ['get', 'scalerank'], 1, 16, 12]],
      'text-max-angle': 38,
      'symbol-spacing': 250,
      'text-font': ['Arial Unicode MS Regular'],
      'text-offset': [0, 0],
      'text-field': ['get', 'name_en'],
      'text-max-width': 8
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)',
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-halo-width': 1
    }
  }, {
    id: 'waterway-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'waterway_label',
    minzoom: 12,
    filter: ['in', 'class', 'canal', 'river'],
    layout: {
      'text-field': ['get', 'name_en'],
      'text-font': ['Arial Unicode MS Regular'],
      'symbol-placement': 'line',
      'text-max-angle': 30,
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 13, 12, 18, 16]
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)'
    }
  }, {
    id: 'water-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'water_label',
    minzoom: 5,
    filter: ['>', 'area', 1e4],
    layout: {
      'text-field': ['get', 'name_en'],
      'text-font': ['Arial Unicode MS Regular'],
      'text-max-width': 7,
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 13, 14, 18, 18],
      'symbol-avoid-edges': !1,
      'text-rotation-alignment': 'viewport'
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)'
    }
  }, {
    id: 'transit',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'rail_station_label',
    minzoom: 1,
    filter: ['all', ['in', '$type', 'LineString', 'Point', 'Polygon'], ['in', 'maki', 'rail', 'rail-light', 'rail-metro']],
    layout: {
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 14, 11, 20, 12],
      'symbol-avoid-edges': !1,
      'text-max-angle': 30,
      'symbol-spacing': 400,
      'text-font': ['Arial Unicode MS Regular'],
      'symbol-placement': 'point',
      'text-rotation-alignment': 'viewport',
      'text-field': ['get', 'name_en']
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)',
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-halo-width': 1
    }
  }, {
    id: 'road-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'road_label',
    minzoom: 12,
    filter: ['==', '$type', 'LineString'],
    layout: {
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 9, ['match', ['get', 'class'], 'motorway', 10, 'primary', 10, 'secondary', 10, 'tertiary', 10, 'trunk', 10, 'link', 8, 'pedestrian', 8, 'street', 8, 'street_limited', 8, 6], 20, ['match', ['get', 'class'], 'motorway', 16, 'primary', 16, 'secondary', 16, 'tertiary', 16, 'trunk', 16, 'link', 14, 'pedestrian', 14, 'street', 14, 'street_limited', 14, 12]],
      'text-max-angle': 30,
      'symbol-spacing': 400,
      'text-font': ['Arial Unicode MS Regular'],
      'symbol-placement': 'line',
      'text-field': ['get', 'name_en'],
      'text-rotation-alignment': 'map',
      'text-pitch-alignment': 'viewport'
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)',
      'text-halo-width': ['match', ['get', 'class'], 'motorway', 1, 'primary', 1, 'secondary', 1, 'tertiary', 1, 'trunk', 1, 'link', 1, 'pedestrian', 1, 'street', 1, 'street_limited', 1, 1.25],
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-opacity': ['step', ['zoom'], ['match', ['get', 'class'], 'motorway', 1, 'secondary', 1, 'tertiary', 1, 'trunk', 1, 0], 12, ['match', ['get', 'class'], 'motorway', 1, 'secondary', 1, 'tertiary', 1, 'trunk', 1, 0], 13, ['match', ['get', 'class'], 'motorway', 1, 'primary', 1, 'secondary', 1, 'tertiary', 1, 'trunk', 1, 'link', 1, 'pedestrian', 1, 'street', 1, 'street_limited', 1, 0], 15, 1]
    }
  }, {
    id: 'suburb-neighbourhood-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'place_label',
    minzoom: 11,
    maxzoom: 16,
    filter: ['all', ['in', '$type', 'LineString', 'Point', 'Polygon'], ['in', 'type', 'neighbourhood', 'suburb']],
    layout: {
      'text-field': ['get', 'name_en'],
      'text-transform': 'uppercase',
      'text-font': ['Arial Unicode MS Regular'],
      'text-letter-spacing': 0.1,
      'text-max-width': 7,
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 12, 11, 16, 16]
    },
    paint: {
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-halo-width': 1,
      'text-color': 'hsl(0, 0%, 31%)'
    }
  }, {
    id: 'town-village-hamlet-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'place_label',
    minzoom: 7,
    maxzoom: 16,
    filter: ['in', 'type', 'hamlet', 'town', 'village'],
    layout: {
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 7, 12, 15, ['match', ['get', 'type'], 'town', 20, 'village', 18, 16]],
      'text-font': ['step', ['zoom'], ['literal', ['Arial Unicode MS Regular']], 12, ['match', ['get', 'type'], 'town', ['literal', ['Arial Unicode MS Bold']], ['literal', ['Arial Unicode MS Regular']]]],
      'text-max-width': ['match', ['get', 'type'], 'village', 10, 7],
      'text-offset': [0, 0],
      'text-field': ['get', 'name_en'],
      'text-letter-spacing': ['match', ['get', 'type'], 'suburb', 0.1, 0]
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)',
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-halo-width': 1.25
    }
  }, {
    id: 'island-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'place_label',
    maxzoom: 16,
    filter: ['==', 'type', 'island'],
    layout: {
      'text-line-height': 1.2,
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 10, 11, 18, 16],
      'text-max-angle': 38,
      'symbol-spacing': 250,
      'text-font': ['Arial Unicode MS Regular'],
      'text-padding': 10,
      'text-offset': [0, 0],
      'text-field': ['get', 'name_en'],
      'text-max-width': 7
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)',
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-halo-width': 1
    }
  }, {
    id: 'city-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'place_label',
    minzoom: 1,
    maxzoom: 16,
    filter: ['all', ['==', '$type', 'Point'], ['==', 'type', 'city']],
    layout: {
      'text-size': ['interpolate', ['exponential', 1.25], ['zoom'], 6, 12, 12, ['case', ['<=', ['number', ['get', 'scalerank']], 2], 32, 26]],
      'text-font': ['step', ['zoom'], ['case', ['<=', ['number', ['get', 'scalerank']], 2], ['literal', ['Arial Unicode MS Bold']], ['literal', ['Arial Unicode MS Regular']]], 12, ['literal', ['Arial Unicode MS Bold']]],
      'text-offset': [0, 0],
      'text-field': ['get', 'name_en'],
      'text-max-width': 7
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)',
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-halo-width': ['case', ['>', ['number', ['get', 'scalerank']], 5], 1.25, 1]
    }
  }, {
    id: 'marine-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'marine_label',
    minzoom: 3,
    maxzoom: 10,
    filter: ['==', '$type', 'LineString'],
    layout: {
      'text-field': ['get', 'name_en'],
      'text-max-width': 5,
      'text-letter-spacing': ['case', ['==', ['get', 'labelrank'], 1], 0.25, ['<=', ['number', ['get', 'labelrank']], 3], 0.15, 0.1],
      'text-line-height': 1.5,
      'text-font': ['Arial Unicode MS Regular'],
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 2, ['match', ['get', 'labelrank'], 1, 12, 14], 4, ['case', ['==', ['get', 'labelrank'], 1], 28, ['<=', ['number', ['get', 'labelrank']], 3], 20, 15]],
      'symbol-placement': 'line',
      'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 4, 100, 6, 400]
    },
    paint: {
      'text-color': 'hsl(0, 0%, 31%)'
    }
  }, {
    id: 'state-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'state_label',
    minzoom: 3,
    maxzoom: 9,
    layout: {
      'text-size': ['interpolate', ['exponential', 1], ['zoom'], 4, 10, 8, ['case', ['>=', ['number', ['get', 'area']], 8e4], 18, ['>=', ['number', ['get', 'area']], 2e4], 16, 14]],
      'text-transform': 'uppercase',
      'text-font': ['Arial Unicode MS Bold'],
      'text-max-width': 6,
      'text-field': ['step', ['zoom'], ['get', 'abbr'], 4, ['case', ['>=', ['number', ['get', 'area']], 8e4], ['get', 'name_en'], ['get', 'abbr']], 5, ['case', ['>=', ['number', ['get', 'area']], 2e4], ['get', 'name_en'], ['get', 'abbr']], 6, ['get', 'name_en']],
      'text-letter-spacing': 0.15
    },
    paint: {
      'text-halo-width': 1,
      'text-color': 'hsl(0, 0%, 31%)',
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-opacity': ['step', ['zoom'], 1, 7, ['case', ['>=', ['number', ['get', 'area']], 8e4], 0, 1], 8, ['case', ['>=', ['number', ['get', 'area']], 2e4], 0, 1]]
    }
  }, {
    id: 'country-label',
    type: 'symbol',
    source: 'composite',
    'source-layer': 'country_label',
    minzoom: 1,
    maxzoom: 7,
    layout: {
      'text-field': ['get', 'name_en'],
      'text-max-width': ['interpolate', ['exponential', 1], ['zoom'], 0, 5, 3, 6],
      'text-font': ['Arial Unicode MS Regular'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 1, 10, 8, ['case', ['<=', ['number', ['get', 'scalerank']], 2], 28, ['<=', ['number', ['get', 'scalerank']], 4], 26, 22]]
    },
    paint: {
      'text-halo-width': 1.25,
      'text-halo-color': 'hsl(0, 0%, 96%)',
      'text-color': 'hsl(0, 0%, 31%)'
    }
  }]
};
var _default = style;
exports.default = _default;
},{}],"places.json":[function(require,module,exports) {
module.exports = [{
  "label": "New York",
  "center": [-73.9916, 40.7288],
  "zoom": 13
}, {
  "label": "Boston",
  "center": [-71.059, 42.359],
  "zoom": 13
}, {
  "label": "Shenzhen",
  "center": [114.05, 22.54],
  "zoom": 12
}, {
  "label": "Shanghai",
  "center": [121.48, 31.22],
  "zoom": 12
}, {
  "label": "Darmstadt",
  "center": [8.64, 49.87],
  "zoom": 12.5
}, {
  "label": "Frankfurt",
  "center": [8.67, 50.108],
  "zoom": 12
}];
},{}],"swatches.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var swatches = [{
  label: 'Road',
  luminosity: 'dark',
  brightness: 58,
  luminance: 0.042311410620809675,
  paths: [['layers', '9', 'paint', 'line-color'], ['layers', '10', 'paint', 'line-color'], ['layers', '12', 'paint', 'line-color'], ['layers', '16', 'paint', 'line-color'], ['layers', '19', 'paint', 'line-color']]
}, {
  label: 'Land',
  luminosity: 'dark',
  brightness: 100,
  luminance: 0.12743768043564743,
  paths: [['layers', '0', 'paint', 'background-color'], ['layers', '6', 'paint', 'fill-color'], ['layers', '7', 'paint', 'line-color'], ['layers', '8', 'paint', 'fill-outline-color'], ['layers', '23', 'paint', 'text-halo-color'], ['layers', '26', 'paint', 'text-halo-color'], ['layers', '27', 'paint', 'text-halo-color'], ['layers', '28', 'paint', 'text-halo-color'], ['layers', '29', 'paint', 'text-halo-color'], ['layers', '30', 'paint', 'text-halo-color'], ['layers', '31', 'paint', 'text-halo-color'], ['layers', '33', 'paint', 'text-halo-color'], ['layers', '34', 'paint', 'text-halo-color']]
}, {
  label: 'Building',
  luminosity: 'bright',
  brightness: 148,
  luminance: 0.2961382707983211,
  paths: [['layers', '1', 'paint', 'fill-color'], ['layers', '2', 'paint', 'fill-color'], ['layers', '5', 'paint', 'line-color'], ['layers', '8', 'paint', 'fill-color'], ['layers', '11', 'paint', 'line-color'], ['layers', '13', 'paint', 'line-color'], ['layers', '14', 'paint', 'line-color'], ['layers', '15', 'paint', 'line-color'], ['layers', '17', 'paint', 'line-color'], ['layers', '18', 'paint', 'line-color']]
}, {
  label: 'Water',
  luminosity: 'light',
  brightness: 196,
  luminance: 0.5520114015120001,
  paths: [['layers', '3', 'paint', 'fill-color'], ['layers', '4', 'paint', 'line-color'], ['layers', '20', 'paint', 'line-color'], ['layers', '22', 'paint', 'line-color', '4']]
}, {
  label: 'Label',
  luminosity: 'light',
  brightness: 244,
  luminance: 0.9046611743911496,
  paths: [['layers', '21', 'paint', 'line-color'], ['layers', '22', 'paint', 'line-color', '6'], ['layers', '23', 'paint', 'text-color'], ['layers', '24', 'paint', 'text-color'], ['layers', '25', 'paint', 'text-color'], ['layers', '26', 'paint', 'text-color'], ['layers', '27', 'paint', 'text-color'], ['layers', '28', 'paint', 'text-color'], ['layers', '29', 'paint', 'text-color'], ['layers', '30', 'paint', 'text-color'], ['layers', '31', 'paint', 'text-color'], ['layers', '32', 'paint', 'text-color'], ['layers', '33', 'paint', 'text-color'], ['layers', '34', 'paint', 'text-color']]
}];
var _default = swatches;
exports.default = _default;
},{}],"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setIn = exports.transitionPath = exports.randomInteger = void 0;

var randomInteger = function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

exports.randomInteger = randomInteger;

var transitionPath = function transitionPath(path) {
  var tPath = path.length === 3 ? path.slice(0) : path.slice(0, 3);
  tPath[3] = "".concat(path[3], "-transition");
  return tPath;
};

exports.transitionPath = transitionPath;

var setIn = function setIn(object, path, value) {
  var lastKeyIndex = path.length - 1;
  var tail = path.slice(0, lastKeyIndex).reduce(function (acc, p) {
    return acc[p];
  }, object);
  tail[path[lastKeyIndex]] = value;
}; // export const savePlace = () => ({
//   center: map.getCenter().toArray(),
//   zoom: map.getZoom()
// });


exports.setIn = setIn;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _randomcolor = _interopRequireDefault(require("randomcolor"));

var _style = _interopRequireDefault(require("./style"));

var _places = _interopRequireDefault(require("./places"));

var _swatches = _interopRequireDefault(require("./swatches"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var minDuration = 2 * 1000;
var maxDuration = 12 * 1000;
mapboxgl.accessToken = "pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q";
var placeIdx = (0, _utils.randomInteger)(0, _places.default.length - 1);
var place = _places.default[placeIdx];
var map = new mapboxgl.Map({
  container: 'map',
  style: _style.default,
  center: place.center,
  zoom: place.zoom
});

var updateSwatch = function updateSwatch(swatch, color, duration) {
  swatch.paths.forEach(function (path) {
    (0, _utils.setIn)(_style.default, path, color);
    (0, _utils.setIn)(_style.default, (0, _utils.transitionPath)(path), {
      duration: duration
    });
  });
};

function render(swatch) {
  function renderLoop() {
    var color = (0, _randomcolor.default)({
      luminosity: swatch.luminosity
    });
    var duration = (0, _utils.randomInteger)(minDuration, maxDuration);
    setTimeout(function () {
      updateSwatch(swatch, color, duration);
      map.setStyle(_style.default);
      renderLoop();
    }, duration);
  }

  renderLoop();
}

_swatches.default.forEach(function (swatch) {
  var color = (0, _randomcolor.default)({
    luminosity: swatch.luminosity
  });
  var duration = (0, _utils.randomInteger)(minDuration, maxDuration);
  updateSwatch(swatch, color, duration);
  render(swatch);
});
},{"randomcolor":"../node_modules/randomcolor/randomColor.js","./style":"style.js","./places":"places.json","./swatches":"swatches.js","./utils":"utils.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63852" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.map