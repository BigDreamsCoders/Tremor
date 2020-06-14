const icon = L.icon({
	iconUrl:"/static/img/earthquake.png",
	iconSize: [20, 20],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
})

const mymap = L.map('mapid'/*,{icon, zoomControl:false}*/).setView([13.8333000, -88.9167000], 9);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(mymap);


document.querySelector("#fetch").addEventListener('click', async ()=>{
	const valu1 = document.querySelector("#input0").textContent
	const valu2 = document.querySelector("#input1").textContent
	const valu3 = document.querySelector("#input2").textContent
	console.log(valu1, valu2, valu3)
	await fetchData()
})

const fetchData = async ()=>{
	const response = await fetch('/data')
    const {data} = (await response.json())
	const [lat, log] = data.split(" ")
	const marker = L.marker([lat, log ], {icon}).addTo(mymap)
	marker.bindPopup("Here will be a tornado shake").openPopup()
}
