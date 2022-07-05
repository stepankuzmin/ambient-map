import mapboxgl from 'mapbox-gl';
import randomColor from 'randomcolor';

import style from './style';
import places from './places.json';
import swatches from './swatches';
import { randomInteger, transitionPath, setIn } from './utils';

const minDuration = 2 * 1000;
const maxDuration = 12 * 1000;
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

const placeIdx = randomInteger(0, places.length - 1);
const place = places[placeIdx];

const map = new mapboxgl.Map({
  container: 'map',
  style,
  center: place.center,
  zoom: place.zoom,
  projection: 'globe'
});

window.map = map;

// At low zooms, complete a revolution every two minutes.
const secondsPerRevolution = 120;

// Above zoom level 5, do not rotate.
const maxSpinZoom = 5;

// Rotate at intermediate speeds between zoom levels 3 and 5.
const slowSpinZoom = 3;

let userInteracting = false;
const spinEnabled = true;

function spinGlobe() {
  const zoom = map.getZoom();
  if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution;
    if (zoom > slowSpinZoom) {
      // Slow spinning at higher zooms
      const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
      distancePerSecond *= zoomDif;
    }
    const center = map.getCenter();
    center.lng -= distancePerSecond;
    // Smoothly animate the map over one second.
    // When this animation is complete, it calls a 'moveend' event.
    map.easeTo({ center, duration: 1000, easing: n => n });
  }
}

// Pause spinning on interaction
map.on('mousedown', () => {
  userInteracting = true;
});

// Restart spinning the globe when interaction is complete
map.on('mouseup', () => {
  userInteracting = false;
  spinGlobe();
});

// These events account for cases where the mouse has moved
// off the map, so 'mouseup' will not be fired.
map.on('dragend', () => {
  userInteracting = false;
  spinGlobe();
});
map.on('pitchend', () => {
  userInteracting = false;
  spinGlobe();
});
map.on('rotateend', () => {
  userInteracting = false;
  spinGlobe();
});

// When animation is complete, start spinning if there is no ongoing interaction
map.on('moveend', () => {
  spinGlobe();
});

const updateSwatch = (swatch, color, duration) => {
  swatch.paths.forEach((path) => {
    setIn(style, path, color);
    setIn(style, transitionPath(path), { duration });
  });
};

function render(swatch) {
  function renderLoop() {
    const color = randomColor({ luminosity: swatch.luminosity });
    const duration = randomInteger(minDuration, maxDuration);

    setTimeout(() => {
      updateSwatch(swatch, color, duration);
      map.setStyle(style);
      renderLoop();
    }, duration);
  }
  renderLoop();
}

swatches.forEach((swatch) => {
  const color = randomColor({ luminosity: swatch.luminosity });
  const duration = randomInteger(minDuration, maxDuration);
  updateSwatch(swatch, color, duration);
  render(swatch);
});
