const nowDate = new Date();
const fullDate = nowDate.toISOString().split('T')[0];
const hour = nowDate.toLocaleTimeString().slice(0, -3);
[...document.querySelectorAll('.date')].map((dateInput) => {
  dateInput.value = `${fullDate}T${hour.length === 4 ? `0${hour}` : hour}`;
});

const loader = document.querySelector('#loader-container');
const submitButtonPunto = document.querySelector('#submit-punto');
const submitNube = document.querySelector('#submit-nube');
const zoomIn = document.querySelector('#zoom-in');
const zoomOut = document.querySelector('#zoom-out');
const clear = document.querySelector('#clear');
const center = document.querySelector('#center');
const tutorial = document.querySelector('#tutorial');
const montain = document.querySelector('#montain');

let heatMap = undefined;
let volcanes = undefined;

const markers = [];

const mymap = L.map('mapid', {
  scrollWheelZoom: true,
  zoomControl: false,
}).setView([13.8333, -88.9167], 8);

L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
  {
    maxZoom: 18,
    attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(mymap);

document.addEventListener('DOMContentLoaded', function () {
  const fabsToolbar = document.querySelectorAll('.fixed-action-btn.toolbar');
  const fabsControls = document.querySelectorAll('.fixed-action-btn.controls');
  const tooltipped = document.querySelectorAll('.tooltipped');
  const modal = document.querySelectorAll('.modal');
  const select = document.querySelectorAll('select');
  M.FloatingActionButton.init(fabsToolbar, {
    toolbarEnabled: true,
  });
  M.FloatingActionButton.init(fabsControls, {
    direction: 'right' /* 
    hoverEnabled: false, */,
  });
  M.Tooltip.init(tooltipped, { enterDelay: 500 });
  M.Modal.init(modal, {});
  M.FormSelect.init(select, {});
});

zoomIn.addEventListener('click', () => {
  mymap.zoomIn();
});

zoomOut.addEventListener('click', () => {
  mymap.zoomOut();
});

center.addEventListener('click', () => {
  mymap.flyTo([13.8333, -88.9167], 8);
});

submitButtonPunto.addEventListener('click', async () => {
  const dateElement = document.querySelector('#date-punto').value;
  const date = new Date(dateElement).getTime();
  const magnitudeElement = document.querySelector('#magnitude-punto');
  const depthElement = document.querySelector('#depth-punto');
  const magnitude =
    magnitudeElement.options[magnitudeElement.selectedIndex].value;
  const depth = depthElement.options[depthElement.selectedIndex].value;

  loader.style.visibility = 'visible';
  setTimeout(async () => {
    const [lat, lng] = await fetchPointData(date, magnitude, depth, true);
    const marker = L.marker([Number(lat), Number(lng)]).addTo(mymap);
    markers.push(marker);
    loader.style.visibility = 'hidden';
  }, 500);
});

submitNube.addEventListener('click', async () => {
  const dateElement = document.querySelector('#date-nube').value;
  const date = new Date(dateElement).getTime();
  const magnitudeElement = document.querySelector('#magnitude-nube');
  const depthElement = document.querySelector('#depth-nube');
  const magnitude =
    magnitudeElement.options[magnitudeElement.selectedIndex].value;
  const depth = depthElement.options[depthElement.selectedIndex].value;

  loader.style.visibility = 'visible';

  setTimeout(async () => {
    const array = await fetchPointData(date, magnitude, depth, false);
    if (array.length === 0) {
      Swal.fire(
        'No hay resultados',
        'La predicción de nuestro modelo no arrojó resultados'
      );
    }
    array.forEach(({ depth, lat, lng, mag }) => {
      const marker = L.marker([Number(lat), Number(lng)]).addTo(mymap);
      const strDepth = `${depth}`.slice(0, 5);
      const strMag = `${mag}`.slice(0, 3);
      marker.bindPopup(
        `<b>Magnitud: </b>${strMag}<br><b>Profundidad: </b>${strDepth} km`
      );
      markers.push(marker);
    });
    loader.style.visibility = 'hidden';
  }, 500);
});

clear.addEventListener('click', () => {
  markers.forEach((mark) => {
    mark.remove();
  });
  if (heatMap) {
    mymap.removeLayer(heatMap);
  }
  if (volcanes) {
    volcanes.removeSubLayer('volcanes');
  }
});

tutorial.addEventListener('click', () => {
  guides.start();
});

montain.addEventListener('click', () => {
  const volc = L.WMS.source(
    'http://geoserver.nelsoncaastro.me/geoserver/WGS84/wms',
    {
      layers: 'volcanes',
      format: 'image/png',
      transparent: true,
      attribution: 'centro nacional de resgistros',
    }
  );
  volcanes = volc;
  volc.addSubLayer('volcanes');
  volc.addTo(mymap);
});

document.querySelector('#heat').addEventListener('click', () => {
  showHeatMap();
});

const fetchPointData = async (timestamp, magnitude, depth, checked) => {
  const query = `timestamp=${timestamp}&magnitude=${magnitude}&depth=${depth}`;
  const response = await fetch(`${checked ? 'latitud' : 'magnitud'}?${query}`);
  return await response.json();
};

const fetchHeatData = async () => {
  const response = await fetch('/heat-points');
  return await response.json();
};

const showHeatMap = async () => {
  if (!heatMap) {
    const data = await fetchHeatData();
    const layer = L.heatLayer(
      data.map(({ lat, lgn }) => {
        return [lat, lgn, 5];
      }),
      { radius: 25 }
    ).addTo(mymap);
    heatMap = layer;
  }
};
