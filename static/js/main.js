const date = new Date();
const fullDate = date.toISOString().split('T')[0];
const hour = date.toLocaleTimeString().slice(0, -3);
document.querySelector('#date').value = `${fullDate}T${
  hour.length === 4 ? `0${hour}` : hour
}`;
const loader = document.querySelector('#loader-container');
const submitButton = document.querySelector('#submit');
const markers = [];
let checked = true;

const mymap = L.map('mapid', {
  scrollWheelZoom: false,
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

submitButton.addEventListener('click', async () => {
  const dateElement = document.querySelector('#date').value;
  if (dateElement === '') {
    swal({
      title: 'Campos faltantes',
      text: 'Debes seleccionar la fecha de la aproximación!',
      icon: 'warning',
    });
    return;
  }
  const date = new Date(dateElement).getTime();
  const magnitudeElement = document.querySelector('#magnitude');
  const depthElement = document.querySelector('#depth');
  const magnitude =
    magnitudeElement.options[magnitudeElement.selectedIndex].value;
  const depth = depthElement.options[depthElement.selectedIndex].value;

  loader.style.visibility = 'visible';
  setTimeout(async () => {
    if (checked) {
      const [lat, lng] = await fetchPointData(date, magnitude, depth);
      const marker = L.marker([Number(lat), Number(lng)]).addTo(mymap);
      markers.push(marker);
      loader.style.visibility = 'hidden';
    } else {
      const array = await fetchPointData(date, magnitude, depth);
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
    }
  }, 500);
});

document.querySelector('#clear').addEventListener('click', () => {
  markers.forEach((mark) => {
    mark.remove();
  });
});

document.getElementById('toggle').addEventListener('change', (e) => {
  checked = e.target.checked;
  if (checked) {
    submitButton.style.backgroundColor = '#28a745';
    submitButton.innerText = 'Obtener posible epicentro';
  } else {
    submitButton.style.backgroundColor = '#dc3545';
    submitButton.innerText = 'Obtener nube de epicentros';
  }
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

const fetchPointData = async (timestamp, magnitude, depth) => {
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
    data.map(({ count, lat, lgn }) => {
      console.log(count, lat, lgn);
      return [lat, lgn, count * 0.8];
    })
  ).addTo(mymap);
};
