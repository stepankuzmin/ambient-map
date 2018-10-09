import randomColor from 'randomcolor';

import style from './style';
import swatches from './swatches';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: style,
  center: [-74, 40.73],
  zoom: 12
});

function setIn(object, path, value) {
  const lastKeyIndex = path.length - 1;
  const tail = path.slice(0, lastKeyIndex).reduce((acc, p) => acc[p], object);
  tail[path[lastKeyIndex]] = value;
}

const minDuration = 2 * 1000;
const maxDuration = 12 * 1000;

function randomDuration() {
  return Math.floor(minDuration + Math.random() * (maxDuration - minDuration));
}

function transitionPath(path) {
  const transitionPath = path.length === 3 ? path.slice(0) : path.slice(0, 3);
  transitionPath[3] = path[3] + '-transition';
  return transitionPath;
}

function updateSwatch(swatch, color, duration) {
  swatch.paths.forEach((path) => {
    setIn(style, path, color);
    setIn(style, transitionPath(path), { duration: duration });
  });
}

function render(swatch) {
  function renderLoop() {
    const color = randomColor({ luminosity: swatch.luminosity });
    const duration = randomDuration();

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
  const duration = randomDuration();
  updateSwatch(swatch, color, duration);
  render(swatch);
});
