import randomColor from 'randomcolor';

import style from './style';
import places from './places';
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
  zoom: place.zoom
});

const updateSwatch = (swatch, color, duration) => {
  swatch.paths.forEach((path) => {
    setIn(style, path, color);
    setIn(style, transitionPath(path), { duration });
  });
}

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
