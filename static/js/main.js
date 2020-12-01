const date = new Date();
const fullDate = date.toISOString().split('T')[0];
const hour = date.toLocaleTimeString().slice(0, -3);
[...document.querySelectorAll('.date')].map((dateInput)=>{
  dateInput.value = `${fullDate}T${
    hour.length === 4 ? `0${hour}` : hour
  }`;
})

const loader = document.querySelector('#loader-container');
const submitButtonPunto = document.querySelector('#submitPunto');
const submitNube = document.querySelector('#submitNube');

const markers = [];

const mymap = L.map('mapid', {
  scrollWheelZoom: true,
  zoomControl: true,
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

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.fixed-action-btn');
  const instances = M.FloatingActionButton.init(elems, {
    toolbarEnabled: true
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.tooltipped');
  const instances = M.Tooltip.init(elems, {enterDelay:500});
});

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.modal');
  const instances = M.Modal.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('select');
  const instances = M.FormSelect.init(elems, {});
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

document.querySelector('#clear').addEventListener('click', () => {
  markers.forEach((mark) => {
    mark.remove();
  });
});

document.querySelector('#tutorial').addEventListener('click', () => {
  swal({
    title: 'Lo que puedes hacer',
    text:
      'En tremor puedes predecir epicentros de dos maneras, por un punto o por una nube de puntos. Puedes cambiar ' +
      'el tipo en el slider de la derecha',
    icon: 'info',
  });
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
  const response = await fetch('/test');
  return await response.json();
};

const showHeatMap = async () => {
  const data = await fetchHeatData();
  L.heatLayer(
    data.map(({ magn, lat, lgn }) => {
      return [lat, lgn, 5];
    }), {radius:25}
  ).addTo(mymap);
};
