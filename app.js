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

function updateSwatch(swatchIndex, value) {
  swatches[swatchIndex].paths.forEach((path) => {
    const lastKeyIndex = path.length - 1;
    const tail = path.slice(0, lastKeyIndex).reduce((acc, p) => acc[p], style);
    tail[path[lastKeyIndex]] = value;
  });
}

let colorIndex = 0;
const colorsCount = swatches[0].values.length;

function render() {
  if (colorIndex === colorsCount) {
    colorIndex = 0;
  }

  setTimeout(() => {
    swatches.forEach((swatch, index) => updateSwatch(index, swatch.values[colorIndex]));
    map.setStyle(style);
    colorIndex++;
    render();
  }, duration);
}

render();
