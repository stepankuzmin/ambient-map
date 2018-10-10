export const randomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export const transitionPath = (path) => {
  const tPath = path.length === 3 ? path.slice(0) : path.slice(0, 3);
  tPath[3] = `${path[3]}-transition`;
  return tPath;
}

export const setIn = (object, path, value) => {
  const lastKeyIndex = path.length - 1;
  const tail = path.slice(0, lastKeyIndex).reduce((acc, p) => acc[p], object);
  tail[path[lastKeyIndex]] = value;
}

// export const savePlace = () => ({
//   center: map.getCenter().toArray(),
//   zoom: map.getZoom()
// });