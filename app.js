// https://www.html5rocks.com/en/tutorials/audio/scheduling/

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q';

const duration = 5000;
style.transition = {
  duration: duration,
  delay: 0
};

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
const maxDuration = 15 * 1000;
function randomDuration() {
  return Math.floor(minDuration + Math.random() * (maxDuration - minDuration));
}

function randomHsl() {
  return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
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

swatches.forEach(render);
