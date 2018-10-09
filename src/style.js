const style = {
  version: 8,
  name: 'My Cartogram Style',
  metadata: {
    'mapbox:sdk-support': {
      js: 'latest',
      android: 'latest',
      ios: 'latest'
    }
  },
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
  layers: [
    {
      id: 'background',
      type: 'background',
      layout: {},
      paint: {
        'background-color': 'hsl(0, 0%, 96%)'
      }
    },
    {
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
    },
    {
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
    },
    {
      id: 'water',
      type: 'fill',
      source: 'composite',
      'source-layer': 'water',
      layout: {},
      paint: {
        'fill-color': 'hsl(0, 0%, 71%)'
      }
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
      id: 'tunnel',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        [
          'all',
          ['==', 'structure', 'tunnel'],
          [
            'in',
            'class',
            'link',
            'motorway',
            'motorway_link',
            'pedestrian',
            'primary',
            'secondary',
            'street',
            'street_limited',
            'tertiary',
            'trunk'
          ]
        ]
      ],
      layout: {
        'line-cap': 'square',
        'line-join': 'round'
      },
      paint: {
        'line-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          5,
          [
            'match',
            ['get', 'class'],
            'motorway',
            0.75,
            'trunk',
            0.75,
            'primary',
            0.75,
            'secondary',
            0.5,
            'tertiary',
            0.5,
            0
          ],
          12,
          [
            'match',
            ['get', 'class'],
            'trunk',
            2,
            'primary',
            2,
            'motorway',
            2,
            'secondary',
            1,
            'tertiary',
            1,
            0.5
          ],
          18,
          [
            'match',
            ['get', 'class'],
            'motorway',
            32,
            'trunk',
            32,
            'primary',
            32,
            'secondary',
            26,
            'tertiary',
            26,
            18
          ]
        ],
        'line-color': 'hsl(0, 0%, 100%)',
        'line-dasharray': [1, 0.1],
        'line-opacity': 0.5
      }
    },
    {
      id: 'road-pedestrian',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 12,
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['all', ['==', 'class', 'pedestrian'], ['==', 'structure', 'none']]
      ],
      layout: {
        'line-join': 'round'
      },
      paint: {
        'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 14, 0.5, 18, 12],
        'line-color': 'hsl(0, 0%, 100%)',
        'line-opacity': ['interpolate', ['exponential', 1], ['zoom'], 13, 0, 14, 1],
        'line-dasharray': [
          'step',
          ['zoom'],
          ['literal', [1, 0]],
          15,
          ['literal', [1.5, 0.4]],
          16,
          ['literal', [1, 0.2]]
        ]
      }
    },
    {
      id: 'road-case',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      filter: [
        'all',
        ['!in', 'structure', 'bridge', 'tunnel'],
        [
          'in',
          'class',
          'link',
          'motorway',
          'motorway_link',
          'primary',
          'secondary',
          'service',
          'street',
          'street_limited',
          'tertiary',
          'track',
          'trunk'
        ]
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 7, 0.25, 16, 2],
        'line-color': 'hsl(0, 0%, 93%)',
        'line-opacity': 1,
        'line-gap-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          5,
          [
            'match',
            ['get', 'class'],
            'motorway',
            0.75,
            'trunk',
            0.75,
            'primary',
            0.75,
            'secondary',
            0.5,
            'tertiary',
            0.5,
            0
          ],
          12,
          [
            'match',
            ['get', 'class'],
            'trunk',
            2,
            'primary',
            2,
            'motorway',
            2,
            'secondary',
            1,
            'tertiary',
            1,
            0
          ],
          18,
          [
            'match',
            ['get', 'class'],
            'motorway',
            32,
            'trunk',
            32,
            'primary',
            32,
            'secondary',
            26,
            'tertiary',
            26,
            18
          ]
        ]
      }
    },
    {
      id: 'road',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      filter: [
        'all',
        ['!in', 'structure', 'bridge', 'tunnel'],
        [
          'in',
          'class',
          'link',
          'motorway',
          'motorway_link',
          'primary',
          'secondary',
          'service',
          'street',
          'street_limited',
          'tertiary',
          'track',
          'trunk'
        ]
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          5,
          [
            'match',
            ['get', 'class'],
            'motorway',
            0.75,
            'trunk',
            0.75,
            'primary',
            0.75,
            'secondary',
            0.5,
            'tertiary',
            0.5,
            0
          ],
          12,
          [
            'match',
            ['get', 'class'],
            'trunk',
            2,
            'primary',
            2,
            'motorway',
            2,
            'secondary',
            1,
            'tertiary',
            1,
            0.5
          ],
          18,
          [
            'match',
            ['get', 'class'],
            'motorway',
            32,
            'trunk',
            32,
            'primary',
            32,
            'secondary',
            26,
            'tertiary',
            26,
            18
          ]
        ],
        'line-color': 'hsl(0, 0%, 100%)',
        'line-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          13,
          ['match', ['get', 'class'], 'street', 0, 1],
          14,
          1
        ]
      }
    },
    {
      id: 'transit-line-rail-case',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 13,
      filter: [
        'all',
        ['!in', 'structure', 'bridge', 'tunnel'],
        ['in', 'class', 'major_rail', 'minor_rail']
      ],
      layout: {
        'line-join': 'miter',
        'line-cap': 'square'
      },
      paint: {
        'line-color': 'hsl(0, 0%, 93%)',
        'line-width': ['interpolate', ['exponential', 1.25], ['zoom'], 14, 2, 20, 4],
        'line-dasharray': [0.25, 10]
      }
    },
    {
      id: 'transit-line-rail',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 13,
      filter: [
        'all',
        ['!in', 'structure', 'bridge', 'tunnel'],
        ['in', 'class', 'major_rail', 'minor_rail']
      ],
      layout: {
        'line-join': 'round'
      },
      paint: {
        'line-color': 'hsl(0, 0%, 93%)',
        'line-width': ['interpolate', ['exponential', 1], ['zoom'], 14, 0.75, 20, 1]
      }
    },
    {
      id: 'bridge-case',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      filter: [
        'all',
        ['==', 'structure', 'bridge'],
        [
          'in',
          'class',
          'link',
          'motorway',
          'motorway_link',
          'pedestrian',
          'primary',
          'secondary',
          'service',
          'street',
          'street_limited',
          'tertiary',
          'track',
          'trunk'
        ]
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 7, 0.25, 16, 2],
        'line-color': 'hsl(0, 0%, 93%)',
        'line-gap-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          5,
          [
            'match',
            ['get', 'class'],
            'motorway',
            0.75,
            'trunk',
            0.75,
            'primary',
            0.75,
            'secondary',
            0.5,
            'tertiary',
            0.5,
            0
          ],
          12,
          [
            'match',
            ['get', 'class'],
            'trunk',
            2,
            'primary',
            2,
            'motorway',
            2,
            'secondary',
            1,
            'tertiary',
            1,
            0
          ],
          18,
          [
            'match',
            ['get', 'class'],
            'motorway',
            32,
            'trunk',
            32,
            'primary',
            32,
            'secondary',
            26,
            'tertiary',
            26,
            18
          ]
        ]
      }
    },
    {
      id: 'bridge',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      filter: [
        'all',
        ['==', 'structure', 'bridge'],
        [
          'in',
          'class',
          'link',
          'motorway',
          'motorway_link',
          'pedestrian',
          'primary',
          'secondary',
          'service',
          'street',
          'street_limited',
          'tertiary',
          'track',
          'trunk'
        ]
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          5,
          [
            'match',
            ['get', 'class'],
            'motorway',
            0.75,
            'trunk',
            0.75,
            'primary',
            0.75,
            'secondary',
            0.5,
            'tertiary',
            0.5,
            0
          ],
          12,
          [
            'match',
            ['get', 'class'],
            'trunk',
            2,
            'primary',
            2,
            'motorway',
            2,
            'secondary',
            1,
            'tertiary',
            1,
            0.5
          ],
          18,
          [
            'match',
            ['get', 'class'],
            'motorway',
            32,
            'trunk',
            32,
            'primary',
            32,
            'secondary',
            26,
            'tertiary',
            26,
            18
          ]
        ],
        'line-color': 'hsl(0, 0%, 100%)'
      }
    },
    {
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
    },
    {
      id: 'bridge-overhead-case',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      filter: [
        'all',
        ['==', 'structure', 'bridge'],
        ['>=', 'layer', 2],
        ['in', 'class', 'motorway', 'motorway_link', 'trunk', 'trunk_link']
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 7, 0.25, 16, 2],
        'line-color': 'hsl(0, 0%, 93%)',
        'line-gap-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          5,
          [
            'match',
            ['get', 'class'],
            'motorway',
            0.75,
            'trunk',
            0.75,
            'primary',
            0.75,
            'secondary',
            0.5,
            'tertiary',
            0.5,
            0
          ],
          12,
          [
            'match',
            ['get', 'class'],
            'trunk',
            2,
            'primary',
            2,
            'motorway',
            2,
            'secondary',
            1,
            'tertiary',
            1,
            0
          ],
          18,
          [
            'match',
            ['get', 'class'],
            'motorway',
            32,
            'trunk',
            32,
            'primary',
            32,
            'secondary',
            26,
            'tertiary',
            26,
            18
          ]
        ]
      }
    },
    {
      id: 'bridge-overhead',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      filter: [
        'all',
        ['==', 'structure', 'bridge'],
        ['>=', 'layer', 2],
        ['in', 'class', 'motorway', 'motorway_link', 'trunk', 'trunk_link']
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-width': [
          'interpolate',
          ['exponential', 1.5],
          ['zoom'],
          5,
          [
            'match',
            ['get', 'class'],
            'motorway',
            0.75,
            'trunk',
            0.75,
            'primary',
            0.75,
            'secondary',
            0.5,
            'tertiary',
            0.5,
            0
          ],
          12,
          [
            'match',
            ['get', 'class'],
            'trunk',
            2,
            'primary',
            2,
            'motorway',
            2,
            'secondary',
            1,
            'tertiary',
            1,
            0.5
          ],
          18,
          [
            'match',
            ['get', 'class'],
            'motorway',
            32,
            'trunk',
            32,
            'primary',
            32,
            'secondary',
            26,
            'tertiary',
            26,
            18
          ]
        ],
        'line-color': 'hsl(0, 0%, 100%)'
      }
    },
    {
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
    },
    {
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
    },
    {
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
        'line-color': [
          'interpolate',
          ['exponential', 1],
          ['zoom'],
          3,
          'hsl(0, 0%, 71%)',
          4,
          'hsl(0, 0%, 31%)'
        ],
        'line-width': ['interpolate', ['exponential', 1], ['zoom'], 3, 0.5, 10, 2]
      }
    },
    {
      id: 'poi-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'poi_label',
      layout: {
        'text-line-height': 1.1,
        'text-size': [
          'interpolate',
          ['exponential', 1],
          ['zoom'],
          10,
          ['match', ['get', 'scalerank'], 1, 12, 10],
          18,
          ['match', ['get', 'scalerank'], 1, 16, 12]
        ],
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
    },
    {
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
    },
    {
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
    },
    {
      id: 'transit',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'rail_station_label',
      minzoom: 1,
      filter: [
        'all',
        ['in', '$type', 'LineString', 'Point', 'Polygon'],
        ['in', 'maki', 'rail', 'rail-light', 'rail-metro']
      ],
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
    },
    {
      id: 'road-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'road_label',
      minzoom: 12,
      filter: ['==', '$type', 'LineString'],
      layout: {
        'text-size': [
          'interpolate',
          ['exponential', 1],
          ['zoom'],
          9,
          [
            'match',
            ['get', 'class'],
            'motorway',
            10,
            'primary',
            10,
            'secondary',
            10,
            'tertiary',
            10,
            'trunk',
            10,
            'link',
            8,
            'pedestrian',
            8,
            'street',
            8,
            'street_limited',
            8,
            6
          ],
          20,
          [
            'match',
            ['get', 'class'],
            'motorway',
            16,
            'primary',
            16,
            'secondary',
            16,
            'tertiary',
            16,
            'trunk',
            16,
            'link',
            14,
            'pedestrian',
            14,
            'street',
            14,
            'street_limited',
            14,
            12
          ]
        ],
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
        'text-halo-width': [
          'match',
          ['get', 'class'],
          'motorway',
          1,
          'primary',
          1,
          'secondary',
          1,
          'tertiary',
          1,
          'trunk',
          1,
          'link',
          1,
          'pedestrian',
          1,
          'street',
          1,
          'street_limited',
          1,
          1.25
        ],
        'text-halo-color': 'hsl(0, 0%, 96%)',
        'text-opacity': [
          'step',
          ['zoom'],
          ['match', ['get', 'class'], 'motorway', 1, 'secondary', 1, 'tertiary', 1, 'trunk', 1, 0],
          12,
          ['match', ['get', 'class'], 'motorway', 1, 'secondary', 1, 'tertiary', 1, 'trunk', 1, 0],
          13,
          [
            'match',
            ['get', 'class'],
            'motorway',
            1,
            'primary',
            1,
            'secondary',
            1,
            'tertiary',
            1,
            'trunk',
            1,
            'link',
            1,
            'pedestrian',
            1,
            'street',
            1,
            'street_limited',
            1,
            0
          ],
          15,
          1
        ]
      }
    },
    {
      id: 'suburb-neighbourhood-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'place_label',
      minzoom: 11,
      maxzoom: 16,
      filter: [
        'all',
        ['in', '$type', 'LineString', 'Point', 'Polygon'],
        ['in', 'type', 'neighbourhood', 'suburb']
      ],
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
    },
    {
      id: 'town-village-hamlet-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'place_label',
      minzoom: 7,
      maxzoom: 16,
      filter: ['in', 'type', 'hamlet', 'town', 'village'],
      layout: {
        'text-size': [
          'interpolate',
          ['exponential', 1],
          ['zoom'],
          7,
          12,
          15,
          ['match', ['get', 'type'], 'town', 20, 'village', 18, 16]
        ],
        'text-font': [
          'step',
          ['zoom'],
          ['literal', ['Arial Unicode MS Regular']],
          12,
          [
            'match',
            ['get', 'type'],
            'town',
            ['literal', ['Arial Unicode MS Bold']],
            ['literal', ['Arial Unicode MS Regular']]
          ]
        ],
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
    },
    {
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
    },
    {
      id: 'city-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'place_label',
      minzoom: 1,
      maxzoom: 16,
      filter: ['all', ['==', '$type', 'Point'], ['==', 'type', 'city']],
      layout: {
        'text-size': [
          'interpolate',
          ['exponential', 1.25],
          ['zoom'],
          6,
          12,
          12,
          ['case', ['<=', ['number', ['get', 'scalerank']], 2], 32, 26]
        ],
        'text-font': [
          'step',
          ['zoom'],
          [
            'case',
            ['<=', ['number', ['get', 'scalerank']], 2],
            ['literal', ['Arial Unicode MS Bold']],
            ['literal', ['Arial Unicode MS Regular']]
          ],
          12,
          ['literal', ['Arial Unicode MS Bold']]
        ],
        'text-offset': [0, 0],
        'text-field': ['get', 'name_en'],
        'text-max-width': 7
      },
      paint: {
        'text-color': 'hsl(0, 0%, 31%)',
        'text-halo-color': 'hsl(0, 0%, 96%)',
        'text-halo-width': ['case', ['>', ['number', ['get', 'scalerank']], 5], 1.25, 1]
      }
    },
    {
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
        'text-letter-spacing': [
          'case',
          ['==', ['get', 'labelrank'], 1],
          0.25,
          ['<=', ['number', ['get', 'labelrank']], 3],
          0.15,
          0.1
        ],
        'text-line-height': 1.5,
        'text-font': ['Arial Unicode MS Regular'],
        'text-size': [
          'interpolate',
          ['exponential', 1],
          ['zoom'],
          2,
          ['match', ['get', 'labelrank'], 1, 12, 14],
          4,
          [
            'case',
            ['==', ['get', 'labelrank'], 1],
            28,
            ['<=', ['number', ['get', 'labelrank']], 3],
            20,
            15
          ]
        ],
        'symbol-placement': 'line',
        'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 4, 100, 6, 400]
      },
      paint: {
        'text-color': 'hsl(0, 0%, 31%)'
      }
    },
    {
      id: 'state-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'state_label',
      minzoom: 3,
      maxzoom: 9,
      layout: {
        'text-size': [
          'interpolate',
          ['exponential', 1],
          ['zoom'],
          4,
          10,
          8,
          [
            'case',
            ['>=', ['number', ['get', 'area']], 8e4],
            18,
            ['>=', ['number', ['get', 'area']], 2e4],
            16,
            14
          ]
        ],
        'text-transform': 'uppercase',
        'text-font': ['Arial Unicode MS Bold'],
        'text-max-width': 6,
        'text-field': [
          'step',
          ['zoom'],
          ['get', 'abbr'],
          4,
          ['case', ['>=', ['number', ['get', 'area']], 8e4], ['get', 'name_en'], ['get', 'abbr']],
          5,
          ['case', ['>=', ['number', ['get', 'area']], 2e4], ['get', 'name_en'], ['get', 'abbr']],
          6,
          ['get', 'name_en']
        ],
        'text-letter-spacing': 0.15
      },
      paint: {
        'text-halo-width': 1,
        'text-color': 'hsl(0, 0%, 31%)',
        'text-halo-color': 'hsl(0, 0%, 96%)',
        'text-opacity': [
          'step',
          ['zoom'],
          1,
          7,
          ['case', ['>=', ['number', ['get', 'area']], 8e4], 0, 1],
          8,
          ['case', ['>=', ['number', ['get', 'area']], 2e4], 0, 1]
        ]
      }
    },
    {
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
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          1,
          10,
          8,
          [
            'case',
            ['<=', ['number', ['get', 'scalerank']], 2],
            28,
            ['<=', ['number', ['get', 'scalerank']], 4],
            26,
            22
          ]
        ]
      },
      paint: {
        'text-halo-width': 1.25,
        'text-halo-color': 'hsl(0, 0%, 96%)',
        'text-color': 'hsl(0, 0%, 31%)'
      }
    }
  ],
  owner: 'tristen',
  visibility: 'private'
};
